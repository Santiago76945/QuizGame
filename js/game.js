//game.js

let questions = [];
let currentQuestionIndex = 0;
let roundsLeft = 5;
let player1Score = 0;
let player2Score = 0;
let currentPlayer = null; // Para rastrear quién está respondiendo
let playersWhoAnswered = 0; // Para rastrear cuántos jugadores han respondido
let timers = {}; // Almacenar temporizadores para cada jugador

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

    document.getElementById('bigRedButton1').addEventListener('click', () => {
        startPlayerTurn(1, 5); // Jugador 1 con 5 segundos
    });
    document.getElementById('bigRedButton2').addEventListener('click', () => {
        startPlayerTurn(2, 5); // Jugador 2 con 5 segundos
    });
}

function setQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    let shuffledAnswers = shuffleArray(currentQuestion.answers);

    document.getElementById('question-container').innerText = currentQuestion.question;
    document.getElementById('question-container-mirror').innerText = currentQuestion.question;

    shuffledAnswers.forEach((answer, index) => {
        let button1 = document.getElementById(`answer1-${index + 1}`);
        let button2 = document.getElementById(`answer2-${index + 1}`);

        // Restablecer el estado y los estilos de los botones
        button1.className = 'answerButtons';
        button2.className = 'answerButtons';
        button1.style.backgroundColor = ''; // Eliminar cualquier estilo de color de fondo aplicado
        button2.style.backgroundColor = '';
        button1.disabled = true; // Comienzan deshabilitados
        button2.disabled = true; // Comienzan deshabilitados

        // Asignar el texto correcto desde el objeto "answer"
        button1.innerText = answer.text;
        button2.innerText = answer.text;

        if (answer.correct) {
            button1.classList.add('correctAnswer');
            button2.classList.add('correctAnswer');
        } else {
            button1.classList.add('incorrectAnswer');
            button2.classList.add('incorrectAnswer');
        }
    });

    // Iniciar el sonido de tick-tock cuando se establece una nueva pregunta
    playTickTockSound();
}

function startPlayerTurn(playerNumber, timeLimit) {
    currentPlayer = playerNumber;
    let otherPlayer = playerNumber === 1 ? 2 : 1;

    // Detener el sonido de tick-tock cuando se presiona el botón rojo
    stopTickTockSound();

    // Deshabilitar los botones del otro jugador
    disableAnswerButtons(otherPlayer);
    disableButton(`bigRedButton${otherPlayer}`);
    disableButton(`bigRedButton${playerNumber}`);

    // Habilitar los botones de respuesta del jugador actual
    enableAnswerButtons(playerNumber);

    // Mostrar mensaje de que el jugador tiene un tiempo limitado para responder
    showMessage(playerNumber, `Tienes ${timeLimit} segundos para responder`, timeLimit * 1000);

    // Iniciar el contador de tiempo
    timers[playerNumber] = setTimeout(() => {
        handlePlayerTimeout(playerNumber);
    }, timeLimit * 1000);
}

function enableAnswerButtons(playerNumber) {
    for (let i = 1; i <= 4; i++) {
        let button = document.getElementById(`answer${playerNumber}-${i}`);
        button.disabled = false;
        button.classList.remove('disabled');
        button.classList.add('enabled');
        button.addEventListener('click', handleAnswerClick);
    }
}

function disableAnswerButtons(playerNumber) {
    for (let i = 1; i <= 4; i++) {
        let button = document.getElementById(`answer${playerNumber}-${i}`);
        button.disabled = true;
        button.classList.add('disabled');
        button.classList.remove('enabled');
        button.removeEventListener('click', handleAnswerClick);
    }
}

function handleAnswerClick(event) {
    let button = event.target;
    let playerNumber = currentPlayer;

    // Detener el temporizador si el jugador respondió
    clearTimeout(timers[playerNumber]);

    let isCorrect = button.classList.contains('correctAnswer');
    if (isCorrect) {
        playCorrectSound();
        updateScore(playerNumber, 10);
        showMessage(playerNumber, 'Respuesta correcta +10 puntos');
        proceedToNextRound();
    } else {
        playIncorrectSound();
        button.style.backgroundColor = 'red';
        updateScore(playerNumber, -10);
        showMessage(playerNumber, 'Respuesta incorrecta -10 puntos');
        allowOtherPlayerToAnswer(playerNumber);
    }
}

function handlePlayerTimeout(playerNumber) {
    playIncorrectSound();
    updateScore(playerNumber, -10);
    showMessage(playerNumber, 'No respondiste a tiempo -10 puntos');
    allowOtherPlayerToAnswer(playerNumber);
}

function allowOtherPlayerToAnswer(playerNumber) {
    playersWhoAnswered++;
    if (playersWhoAnswered === 2) {
        proceedToNextRound();
    } else {
        let otherPlayer = playerNumber === 1 ? 2 : 1;
        startPlayerTurn(otherPlayer, 30); // El otro jugador tiene 30 segundos
    }
}

function updateScore(playerNumber, points) {
    if (playerNumber === 1) {
        player1Score += points;
        document.getElementById('player1-score').innerText = player1Score;
        document.getElementById('player1-score-mirror').innerText = player1Score;
    } else {
        player2Score += points;
        document.getElementById('player2-score').innerText = player2Score;
        document.getElementById('player2-score-mirror').innerText = player2Score;
    }
}

function proceedToNextRound() {
    roundsLeft--;
    document.getElementById('rounds-left').innerText = roundsLeft;
    document.getElementById('rounds-left-mirror').innerText = roundsLeft;

    if (roundsLeft === 0) {
        endGame();
    } else {
        currentQuestionIndex++;
        playersWhoAnswered = 0; // Reiniciar el contador
        setQuestion();
        setTimeout(() => {
            setupGame(); // Volver a configurar la ronda
        }, 3000);
    }
}

function endGame() {
    let message;
    if (player1Score > player2Score) {
        message = 'Jugador 1 gana';
    } else if (player2Score > player1Score) {
        message = 'Jugador 2 gana';
    } else {
        message = 'Empate';
    }
    showMessage(1, message, 5000);
    showMessage(2, message, 5000);
    alert('El juego ha terminado');
}

function disableButton(buttonId) {
    let button = document.getElementById(buttonId);
    button.disabled = true;
    button.classList.add('disabled');
    button.classList.remove('enabled');
}

function enableButton(buttonId) {
    let button = document.getElementById(buttonId);
    button.disabled = false;
    button.classList.remove('disabled');
    button.classList.add('enabled');
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function showMessage(playerNumber, message, duration = 3000) {
    const playerSection = document.getElementById(`player${playerNumber}-section`);
    const messageElement = document.createElement('div');
    let messageClass = `messageOnScreen ${playerNumber === 1 ? 'top' : 'bottom'} show`;

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






