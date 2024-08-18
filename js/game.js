// game.js

let questions = [];
let currentQuestionIndex = 0;
let roundsLeft = 5;
let player1Score = 0;
let player2Score = 0;
let canPressButtons = true; // Variable para controlar la interacción de los botones
let playersWhoAnswered = 0; // Nueva variable para rastrear cuántos jugadores han respondido

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
        playRedButtonSound();
        startPlayerTurn(1);
    });
    document.getElementById('bigRedButton2').addEventListener('click', () => {
        playRedButtonSound();
        startPlayerTurn(2);
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
        button1.disabled = false;
        button2.disabled = false;

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
}

function startPlayerTurn(playerNumber) {
    playTickTockSound();  // Inicia el sonido de "Tick Tock" cuando comienza el turno del jugador
    canPressButtons = true; // Habilita los botones para el jugador actual
    let otherPlayer = playerNumber === 1 ? 2 : 1;

    // Deshabilitar los botones del otro jugador
    disableAnswerButtons(otherPlayer, true);
    disableButton(`bigRedButton${otherPlayer}`);

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

    // Guardar el intervalo en una propiedad del objeto para poder detenerlo si es necesario
    playerStatus.interval = interval;
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
    stopTickTockSound();  // Detiene el sonido de "Tick Tock" cuando el jugador responde

    if (!canPressButtons) return; // Evitar múltiples clics

    canPressButtons = false; // Desactivar inmediatamente después del primer clic
    let isCorrect = button.classList.contains('correctAnswer');
    let playerStatus = document.getElementById(`player${playerNumber}-status`);

    if (isCorrect) {
        playCorrectSound();  // Reproduce el sonido correcto
        updateScore(playerNumber, 10);
        disableAnswerButtons(playerNumber, true);
        showMessage(playerNumber, 'Respondiste correctamente +10 puntos');
        clearInterval(playerStatus.interval); // Detener el contador si se responde correctamente
    } else {
        playIncorrectSound();  // Reproduce el sonido incorrecto
        updateScore(playerNumber, -10);
        button.style.backgroundColor = 'red';
        button.disabled = true;
        showMessage(playerNumber, 'Respondiste mal la respuesta -10 puntos');
        clearInterval(playerStatus.interval); // Detener el contador si se responde incorrectamente
    }

    playersWhoAnswered++; // Incrementa el contador de jugadores que han respondido

    if (playersWhoAnswered === 2) { // Si ambos jugadores han respondido
        setTimeout(() => {
            playersWhoAnswered = 0; // Resetea el contador para la siguiente ronda
            proceedToNextRound();
        }, 5000); // Espera 5 segundos antes de avanzar a la siguiente ronda
    } else {
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
    stopTickTockSound();  // Detiene el sonido de "Tick Tock" cuando el tiempo se acaba
    playIncorrectSound(); // Reproduce el sonido incorrecto porque no respondió a tiempo
    updateScore(playerNumber, -10);
    showMessage(playerNumber, 'No respondiste a tiempo -10 puntos');
    playersWhoAnswered++; // Incrementa el contador si el jugador no respondió a tiempo

    if (playersWhoAnswered === 2) { // Si ambos jugadores han respondido o se les acabó el tiempo
        setTimeout(() => {
            playersWhoAnswered = 0; // Resetea el contador para la siguiente ronda
            proceedToNextRound();
        }, 5000); // Espera 5 segundos antes de avanzar a la siguiente ronda
    } else {
        allowOtherPlayerToAnswer(playerNumber);
    }
}

function allowOtherPlayerToAnswer(playerNumber) {
    let otherPlayer = playerNumber === 1 ? 2 : 1;
    canPressButtons = true; // Permitir que el otro jugador interactúe

    document.getElementById(`player${otherPlayer}-status`).innerText = 'Tienes 15 segundos para responder';
    enableAnswerButtons(otherPlayer); // Habilitar directamente los botones de respuesta

    let countdown = 15;
    let interval = setInterval(() => {
        countdown--;
        document.getElementById(`player${otherPlayer}-status`).innerText = `Tienes ${countdown} segundos para responder`;
        if (countdown === 0) {
            clearInterval(interval);
            handlePlayerTimeout(otherPlayer);
        }
    }, 1000);

    // Guardar el intervalo en una propiedad del objeto para poder detenerlo después de que el jugador responda
    document.getElementById(`player${otherPlayer}-status`).interval = interval;
}

function updateScore(playerNumber, points) {
    console.log(`Updating score for Player ${playerNumber}`);
    console.log(`Points to add: ${points}`);

    if (playerNumber === 1) {
        player1Score += points;
        console.log(`New Player 1 score: ${player1Score}`);
        document.getElementById('player1-score').innerText = player1Score;

        // Actualizar los puntos del oponente en la pantalla de Player 2
        let player2Mirror = document.getElementById('player1-score-mirror');
        if (player2Mirror) {
            console.log(`Updating Player 1 score on Player 2's screen: ${player1Score}`);
            player2Mirror.innerText = player1Score;
        }

        // Actualizar los puntos de Player 2 en la pantalla de Player 1 (como puntos del oponente)
        console.log(`Current Player 2 score: ${player2Score}`);
        let player2ScoreElement = document.getElementById('player2-score-mirror');
        if (player2ScoreElement) {
            player2ScoreElement.innerText = player2Score;
        } else {
            console.log('Element player2-score-mirror not found!');
        }
    } else {
        player2Score += points;
        console.log(`New Player 2 score: ${player2Score}`);
        document.getElementById('player2-score').innerText = player2Score;

        // Actualizar los puntos del oponente en la pantalla de Player 1
        let player1Mirror = document.getElementById('player2-score-mirror');
        if (player1Mirror) {
            console.log(`Updating Player 2 score on Player 1's screen: ${player2Score}`);
            player1Mirror.innerText = player2Score;
        }

        // Actualizar los puntos de Player 1 en la pantalla de Player 2 (como puntos del oponente)
        console.log(`Current Player 1 score: ${player1Score}`);
        let player1ScoreElement = document.getElementById('player1-score-mirror');
        if (player1ScoreElement) {
            player1ScoreElement.innerText = player1Score;
        } else {
            console.log('Element player1-score-mirror not found!');
        }
    }
}

function proceedToNextRound() {
    stopTickTockSound();  // Detener el sonido "Tick Tock" al final de la ronda
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
            canPressButtons = true; // Restablecer la variable para la nueva ronda
            setupGame(); // Llamada para volver a habilitar los botones grandes y configurar la ronda
            playTickTockSound(); // Reanudar el sonido "Tick Tock" al comienzo de la nueva ronda
        }, 10000);
    }
}

function endGame() {
    stopTickTockSound();  // Detener el sonido "Tick Tock" al finalizar el juego
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



