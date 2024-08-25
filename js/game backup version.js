//otherScript.js

let questions = [];
let currentQuestionIndex = 0;
let roundsLeft = 5;
let player1Score = 0;
let player2Score = 0;
let currentPlayer = null; // Para rastrear quién está respondiendo
let playersWhoAnswered = 0; // Para rastrear cuántos jugadores han respondido
let timers = {}; // Almacenar temporizadores para cada jugador

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente cargado y analizado, iniciando fetch de preguntas.");
    fetchQuestions().then(() => {
        setupGame();
    });
});

async function fetchQuestions() {
    console.log("Iniciando fetchQuestions.");
    try {
        const response = await fetch('/questions.json'); // Ruta al archivo JSON
        questions = await response.json();
        shuffleArray(questions);
        console.log("Preguntas cargadas y mezcladas:", questions);
    } catch (error) {
        console.error('Error al cargar las preguntas:', error);
    }
}

function setupGame() {
    console.log("Configurando el juego.");
    setQuestion();
    enableButton('bigRedButton1');
    enableButton('bigRedButton2');

    document.getElementById('bigRedButton1').addEventListener('click', () => {
        redButtonSound.play();  // Reproduce el sonido del botón rojo
        console.log("Botón rojo del Jugador 1 presionado, iniciando su turno.");
        startPlayerTurn(1, 5); // Jugador 1 con 5 segundos
    });

    document.getElementById('bigRedButton2').addEventListener('click', () => {
        redButtonSound.play();  // Reproduce el sonido del botón rojo
        console.log("Botón rojo del Jugador 2 presionado, iniciando su turno.");
        startPlayerTurn(2, 5); // Jugador 2 con 5 segundos
    });
}

function enableAnswerButtons(playerNumber) {
    console.log(`Habilitando botones de respuesta para el Jugador ${playerNumber}.`);
    for (let i = 1; i <= 4; i++) {
        let button = document.getElementById(`answer${playerNumber}-${i}`);
        button.disabled = false;
        button.classList.remove('disabled');
        button.classList.add('enabled');
        button.addEventListener('click', handleAnswerClick);
    }
}

function disableAnswerButtons(playerNumber) {
    console.log(`Deshabilitando botones de respuesta para el Jugador ${playerNumber}.`);
    for (let i = 1; i <= 4; i++) {
        let button = document.getElementById(`answer${playerNumber}-${i}`);
        button.disabled = true;
        button.classList.add('disabled');
        button.classList.remove('enabled');
        button.removeEventListener('click', handleAnswerClick); // Desasociar el evento para evitar múltiples clics
    }
    clearTimeout(timers[playerNumber]);
    console.log(`Temporizador para el Jugador ${playerNumber} detenido.`);
}

function showMessage(playerNumber, baseMessage, timeLimit) {
    const statusElement = document.getElementById(`dynamic-message-on-screen${playerNumber}`);
    let timeLeft = parseInt(timeLimit, 10);

    if (isNaN(timeLeft)) {
        console.error("El valor de timeLimit no es un número válido:", timeLimit);
        timeLeft = 0; // Asignar un valor predeterminado si es NaN
    }

    // Limpiar cualquier intervalo previo para evitar conflictos
    if (statusElement.interval) {
        clearInterval(statusElement.interval);
        statusElement.interval = null;
    }

    // Mostrar mensaje inicial con el tiempo restante
    statusElement.innerText = `${baseMessage} ${timeLeft} segundos restantes`;

    // Si el tiempo es 0 o menor, no iniciar el intervalo
    if (timeLeft <= 0) {
        return;
    }

    // Crear un intervalo que actualice el mensaje cada segundo
    statusElement.interval = setInterval(() => {
        timeLeft--;

        // Actualizar el mensaje con el tiempo restante
        statusElement.innerText = `${baseMessage} ${timeLeft} segundos restantes`;

        // Si el tiempo se agota, detener el intervalo y limpiar el mensaje
        if (timeLeft <= 0) {
            clearInterval(statusElement.interval);
            statusElement.innerText = ''; // Limpia el mensaje después de que el tiempo se agote
            statusElement.interval = null;
        }
    }, 1000);
}

function handleAnswerClick(event) {
    let button = event.target;
    let playerNumber = currentPlayer;

    console.log(`Jugador ${playerNumber} hizo clic en una respuesta.`);

    disableAnswerButtons(playerNumber);
    clearTimeout(timers[playerNumber]);

    let isCorrect = button.classList.contains('correctAnswer');

    if (isCorrect) {
        console.log(`Jugador ${playerNumber} respondió correctamente.`);
        playCorrectSound();
        updateScore(playerNumber, 10);
        showMessage(playerNumber, 'Respuesta correcta!', 3);  // Mostrar el mensaje durante 3 segundos

        let otherPlayer = playerNumber === 1 ? 2 : 1;
        showMessage(otherPlayer, 'El jugador contrario respondió bien, perdiste la ronda.', 3);

        setTimeout(() => {
            proceedToNextRound();
        }, 3000); // Espera 3 segundos antes de proceder a la siguiente ronda
    } else {
        console.log(`Jugador ${playerNumber} respondió incorrectamente.`);
        playIncorrectSound();
        button.style.backgroundColor = 'red';
        updateScore(playerNumber, -10);
        showMessage(playerNumber, 'Respuesta incorrecta.', 3);

        playersWhoAnswered++;

        if (playersWhoAnswered < 2) {
            setTimeout(() => {
                allowOtherPlayerToAnswer(playerNumber);
            }, 3000); // Espera 3 segundos antes de permitir que el otro jugador responda
        } else {
            setTimeout(() => {
                proceedToNextRound();
            }, 3000); // Espera 3 segundos antes de proceder a la siguiente ronda
        }
    }
}

function updateScore(playerNumber, points) {
    if (playerNumber === 1) {
        player1Score += points;
        document.getElementById('player1-score').innerText = player1Score;
        document.getElementById('player1-score-mirror').innerText = player1Score;
        console.log(`Puntuación actualizada para el Jugador 1: ${player1Score}`);
    } else {
        player2Score += points;
        document.getElementById('player2-score').innerText = player2Score;
        document.getElementById('player2-score-mirror').innerText = player2Score;
        console.log(`Puntuación actualizada para el Jugador 2: ${player2Score}`);
    }
}

function endGame() {
    console.log("El juego ha terminado, determinando el ganador.");
    let message;
    if (player1Score > player2Score) {
        message = 'Ganaste!';
        showMessage(1, message, 5000);
        showMessage(2, 'Perdiste', 5000);
        console.log("Jugador 1 ganó el juego.");
    } else if (player2Score > player1Score) {
        message = 'Ganaste!';
        showMessage(2, message, 5000);
        showMessage(1, 'Perdiste', 5000);
        console.log("Jugador 2 ganó el juego.");
    } else {
        message = 'Empate';
        showMessage(1, message, 5000);
        showMessage(2, message, 5000);
        console.log("El juego terminó en empate.");
    }
    setTimeout(() => {
        alert('El juego ha terminado');
    }, 5000);
}

function disableButton(buttonId) {
    let button = document.getElementById(buttonId);
    button.disabled = true;
    button.classList.add('disabled');
    button.classList.remove('enabled');
    console.log(`Botón ${buttonId} deshabilitado.`);
}

function enableButton(buttonId) {
    let button = document.getElementById(buttonId);
    button.disabled = false;
    button.classList.remove('disabled');
    button.classList.add('enabled');
    console.log(`Botón ${buttonId} habilitado.`);
}

function shuffleArray(array) {
    console.log("Mezclando arreglo.");
    return array.sort(() => Math.random() - 0.5);
}

function startPlayerTurn(playerNumber, timeLimit) {
    currentPlayer = playerNumber;
    let otherPlayer = playerNumber === 1 ? 2 : 1;

    console.log(`Iniciando turno para el Jugador ${playerNumber} con un límite de tiempo de ${timeLimit} segundos.`);

    // Limpia cualquier temporizador activo antes de iniciar uno nuevo
    if (timers[playerNumber]) {
        clearTimeout(timers[playerNumber]);
    }
    if (timers[otherPlayer]) {
        clearTimeout(timers[otherPlayer]);
    }

    stopTickTockSound();

    disableButton(`bigRedButton${otherPlayer}`);
    showMessage(otherPlayer, 'Espera a que el otro jugador responda', timeLimit);

    disableAnswerButtons(otherPlayer);
    disableButton(`bigRedButton${playerNumber}`);

    enableAnswerButtons(playerNumber);
    showMessage(playerNumber, `Tienes ${timeLimit} segundos para responder`, timeLimit);

    timers[playerNumber] = setTimeout(() => {
        console.log(`Tiempo agotado para el Jugador ${playerNumber}.`);
        handlePlayerTimeout(playerNumber, timeLimit);
    }, timeLimit * 1000);
}

function handlePlayerTimeout(playerNumber, timeLimit) {
    console.log(`Tiempo agotado para el Jugador ${playerNumber}.`);

    let otherPlayer = playerNumber === 1 ? 2 : 1;
    console.log(`El siguiente turno será para el Jugador ${otherPlayer}.`);

    showMessage(playerNumber, 'Se acabó tu tiempo!', 5);  // Usar un mensaje fijo
    showMessage(otherPlayer, 'El otro jugador no respondió a tiempo, es tu turno.', 5);

    playersWhoAnswered++;
    console.log(`Número de jugadores que han respondido o agotado su tiempo: ${playersWhoAnswered}`);

    if (playersWhoAnswered < 2) {
        console.log(`Permitiendo al Jugador ${otherPlayer} responder después de 5 segundos.`);
        setTimeout(() => {
            allowOtherPlayerToAnswer(playerNumber);
        }, 5000);
    } else {
        console.log("Ambos jugadores han respondido o agotado su tiempo. Procediendo a la siguiente ronda.");
        setTimeout(() => {
            proceedToNextRound();
        }, 5000);
    }
}

function allowOtherPlayerToAnswer(playerNumber) {
    let otherPlayer = playerNumber === 1 ? 2 : 1;
    console.log(`Permitiendo al Jugador ${otherPlayer} responder después de que el Jugador ${playerNumber} falló.`);

    enableButton(`bigRedButton${otherPlayer}`);
    enableAnswerButtons(otherPlayer);

    startPlayerTurn(otherPlayer, 30); // El otro jugador tiene 30 segundos
}

function proceedToNextRound() {
    roundsLeft--;
    document.getElementById('rounds-left').innerText = roundsLeft;
    document.getElementById('rounds-left-mirror').innerText = roundsLeft;
    console.log(`Rondas restantes: ${roundsLeft}`);

    if (roundsLeft === 0) {
        console.log("No quedan más rondas, finalizando juego.");
        endGame();
    } else {
        currentQuestionIndex++;
        playersWhoAnswered = 0; // Reiniciar el contador

        // Mostrar el mensaje de ronda finalizada
        showMessage(1, 'Ronda finalizada, nueva pregunta en', 10);
        showMessage(2, 'Ronda finalizada, nueva pregunta en', 10);

        // Esperar 10 segundos antes de comenzar la nueva ronda
        setTimeout(() => {
            setQuestion(); // Configurar la nueva pregunta
            enableButton('bigRedButton1');
            enableButton('bigRedButton2');

            // Limpiar cualquier temporizador anterior o mensaje dinámico
            if (document.getElementById('dynamic-message-on-screen1').interval) {
                clearInterval(document.getElementById('dynamic-message-on-screen1').interval);
            }
            if (document.getElementById('dynamic-message-on-screen2').interval) {
                clearInterval(document.getElementById('dynamic-message-on-screen2').interval);
            }

            // Mostrar el mensaje "Aprieta el botón rojo si sabes la respuesta"
            document.getElementById('dynamic-message-on-screen1').innerText = 'Aprieta el botón rojo si sabes la respuesta';
            document.getElementById('dynamic-message-on-screen2').innerText = 'Aprieta el botón rojo si sabes la respuesta';

            console.log("Nueva ronda configurada. Mensaje de botón rojo mostrado.");
        }, 10000); // Espera exactamente 10 segundos
    }
}


function setQuestion() {
    console.log("Configurando nueva pregunta.");
    let currentQuestion = questions[currentQuestionIndex];
    let shuffledAnswers = shuffleArray(currentQuestion.answers);

    document.getElementById('question-container').innerText = currentQuestion.question;
    document.getElementById('question-container-mirror').innerText = currentQuestion.question;

    shuffledAnswers.forEach((answer, index) => {
        let button1 = document.getElementById(`answer1-${index + 1}`);
        let button2 = document.getElementById(`answer2-${index + 1}`);

        button1.className = 'answerButtons';
        button2.className = 'answerButtons';
        button1.style.backgroundColor = ''; // Eliminar cualquier estilo de color de fondo aplicado
        button2.style.backgroundColor = '';
        button1.disabled = true; // Comienzan deshabilitados
        button2.disabled = true; // Comienzan deshabilitados

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

    playTickTockSound();
    console.log("Pregunta y respuestas configuradas.");
}


















