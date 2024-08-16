//game.js

let questions = [];
let currentQuestionIndex = 0;
let roundsLeft = 5;
let player1Score = 0;
let player2Score = 0;
let canPressButtons = true; // Variable para controlar la interacción de los botones

document.addEventListener('DOMContentLoaded', () => {
    fetchQuestions().then(() => {
        setupGame();
    });
});

async function fetchQuestions() {
    try {
        const response = await fetch('questions.json'); // Ruta al archivo JSON
        questions = await response.json();
        shuffleArray(questions);
    } catch (error) {
        console.error('Error al cargar las preguntas:', error);
    }
}

function setupGame() {
    setQuestion();
    enableButton('bigRedButton1');
    enableButton('bigRedButton2');

    document.getElementById('bigRedButton1').addEventListener('click', () => startPlayerTurn(1));
    document.getElementById('bigRedButton2').addEventListener('click', () => startPlayerTurn(2));
}

function setQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    let shuffledAnswers = shuffleArray(currentQuestion.answers);

    document.getElementById('question-container').innerText = currentQuestion.question;
    document.getElementById('question-container-mirror').innerText = currentQuestion.question;

    shuffledAnswers.forEach((answer, index) => {
        let button1 = document.getElementById(`answer1-${index + 1}`);
        let button2 = document.getElementById(`answer2-${index + 1}`);
        button1.innerText = button2.innerText = answer.text;
        button1.className = button2.className = 'answerButtons';
        button1.disabled = false;
        button2.disabled = false;

        if (answer.correct) {
            button1.classList.add('correctAnswer');
            button2.classList.add('correctAnswer');
        } else {
            button1.classList.add('incorrectAnswer');
            button2.classList.add('incorrectAnswer');
        }
    });
}

function startPlayerTurn(playerNumber) {
    canPressButtons = true; // Habilita los botones para el jugador actual

    let playerStatus = document.getElementById(`player${playerNumber}-status`);
    playerStatus.innerText = 'Tienes 5 segundos para responder';
    disableButton(`bigRedButton${playerNumber}`);
    enableAnswerButtons(playerNumber);

    let countdown = 5;
    let interval = setInterval(() => {
        countdown--;
        playerStatus.innerText = `Tienes ${countdown} segundos para responder`;
        if (countdown === 0) {
            clearInterval(interval);
            handlePlayerTimeout(playerNumber);
        }
    }, 1000);
}

function enableAnswerButtons(playerNumber) {
    for (let i = 1; i <= 4; i++) {
        let button = document.getElementById(`answer${playerNumber}-${i}`);
        button.classList.add('enabled');
        button.disabled = false;
        button.addEventListener('click', () => handleAnswerClick(button, playerNumber));
    }
}

function handleAnswerClick(button, playerNumber) {
    if (!canPressButtons) return;

    let isCorrect = button.classList.contains('correctAnswer');
    if (isCorrect) {
        updateScore(playerNumber, 10);
        disableAnswerButtons(playerNumber, true);
        canPressButtons = false;
        showMessage(playerNumber, 'Respondiste correctamente +10 puntos');
        proceedToNextRound();
    } else {
        updateScore(playerNumber, -10);
        button.style.backgroundColor = 'red';
        button.disabled = true;
        canPressButtons = false;
        showMessage(playerNumber, 'Respondiste mal la respuesta -10 puntos');
        allowOtherPlayerToAnswer(playerNumber);
    }
}

function disableAnswerButtons(playerNumber, disableAll = false) {
    for (let i = 1; i <= 4; i++) {
        let button = document.getElementById(`answer${playerNumber}-${i}`);
        if (disableAll) {
            button.classList.remove('enabled');
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    }
}

function handlePlayerTimeout(playerNumber) {
    updateScore(playerNumber, -10);
    showMessage(playerNumber, 'No respondiste a tiempo -10 puntos');
    allowOtherPlayerToAnswer(playerNumber);
}

function allowOtherPlayerToAnswer(playerNumber) {
    let otherPlayer = playerNumber === 1 ? 2 : 1;
    canPressButtons = true; // Permitir que el otro jugador interactúe

    document.getElementById(`player${otherPlayer}-status`).innerText = 'Tienes 15 segundos para responder';
    enableAnswerButtons(otherPlayer);
    let countdown = 15;
    let interval = setInterval(() => {
        countdown--;
        document.getElementById(`player${otherPlayer}-status`).innerText = `Tienes ${countdown} segundos para responder`;
        if (countdown === 0) {
            clearInterval(interval);
            handlePlayerTimeout(otherPlayer);
        }
    }, 1000);
}

function updateScore(playerNumber, points) {
    if (playerNumber === 1) {
        player1Score += points;
        document.getElementById('player1-score').innerText = player1Score;
        document.getElementById('player2-score-mirror').innerText = player1Score; // Actualiza el espejo en la pantalla de Player 2
    } else {
        player2Score += points;
        document.getElementById('player2-score').innerText = player2Score;
        document.getElementById('player1-score-mirror').innerText = player2Score; // Actualiza el espejo en la pantalla de Player 1
    }
}

function proceedToNextRound() {
    roundsLeft--;
    document.getElementById('rounds-left').innerText = roundsLeft;
    document.getElementById('rounds-left-mirror').innerText = roundsLeft;

    if (roundsLeft === 0) {
        endGame();
    } else {
        showCountdownMessage('Ronda finalizada, la nueva ronda comienza en', 10);
        setTimeout(() => {
            currentQuestionIndex++;
            setQuestion();
            setupGame();
        }, 10000);
    }
}

function endGame() {
    if (player1Score > player2Score) {
        showMessage(1, 'Felicitaciones jugador, ganaste');
        showMessage(2, 'Perdiste, qué triste, no hay nadie peor que tú');
    } else if (player2Score > player1Score) {
        showMessage(2, 'Felicitaciones jugador, ganaste');
        showMessage(1, 'Perdiste, qué triste, no hay nadie peor que tú');
    } else {
        showMessage(1, '¡Empate! Bien jugado.');
        showMessage(2, '¡Empate! Bien jugado.');
    }
    alert('¡El juego ha terminado!');
}

function disableButton(buttonId) {
    let button = document.getElementById(buttonId);
    button.classList.remove('enabled');
    button.disabled = true;
}

function enableButton(buttonId) {
    let button = document.getElementById(buttonId);
    button.classList.add('enabled');
    button.disabled = false;
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function showMessage(playerNumber, message, duration = 3000) {
    const playerSection = document.getElementById(`player${playerNumber}-section`);
    const messageElement = document.createElement('div');
    let messageClass = `messageOnScreen ${playerNumber === 1 ? 'top' : 'bottom'} show`;

    // Si el jugador tiene la pantalla invertida (Player 2), corregimos la orientación del mensaje
    if (playerNumber === 2) {
        messageClass += ' correctOrientation';
    }

    messageElement.className = messageClass;
    messageElement.innerText = message;
    playerSection.appendChild(messageElement);

    setTimeout(() => {
        messageElement.classList.remove('show');
        setTimeout(() => messageElement.remove(), 500);
    }, duration);
}

function showCountdownMessage(message, countdownDuration = 10) {
    const messageElement1 = document.createElement('div');
    const messageElement2 = document.createElement('div');
    
    // El jugador 1 ve el mensaje normalmente
    messageElement1.className = `messageOnScreen bottom show`;
    // El jugador 2 necesita la corrección de orientación
    messageElement2.className = `messageOnScreen top show correctOrientation`;
    
    messageElement1.innerText = `${message} ${countdownDuration}`;
    messageElement2.innerText = `${message} ${countdownDuration}`;
    
    document.getElementById('player1-section').appendChild(messageElement1);
    document.getElementById('player2-section').appendChild(messageElement2);

    let countdown = countdownDuration;
    const interval = setInterval(() => {
        countdown--;
        messageElement1.innerText = `${message} ${countdown}`;
        messageElement2.innerText = `${message} ${countdown}`;
        if (countdown === 0) {
            clearInterval(interval);
            messageElement1.classList.remove('show');
            messageElement2.classList.remove('show');
            setTimeout(() => {
                messageElement1.remove();
                messageElement2.remove();
            }, 500);
        }
    }, 1000);
}


