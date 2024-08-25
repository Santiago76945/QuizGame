//game.js

import { player1Name, player2Name, setPlayerNames } from './playersInfo.js';

let questions = [];
let currentQuestionIndex = 0;
let roundsLeft = 5;
let player1Score = 0;
let player2Score = 0;
let currentPlayer = null; 
let playersWhoAnswered = 0; 
let timers = {}; 

let player1Answers = [];
let player2Answers = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente cargado y analizado, iniciando fetch de preguntas.");

    const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    
    console.log(`Idioma seleccionado obtenido de localStorage: ${selectedLanguage}`);

    displaySelectedLanguage(true, selectedLanguage);

    setPlayerNames();  // Establece los nombres de los jugadores en el DOM

    console.log(`Nombres de los jugadores: Jugador 1 - ${player1Name}, Jugador 2 - ${player2Name}`);

    updateTextForLanguage(selectedLanguage);  // Actualiza los textos según el idioma

    fetchQuestions().then(() => {
        setupGame(selectedLanguage);
    });
});

function translate(key, selectedLanguage) {
    const translations = {
        'press_red_button': {
            'en': 'Press the red button if you know the answer.',
            'es': 'Presiona el botón rojo si sabes la respuesta.'
        },
        'points': {
            'en': 'Points',
            'es': 'Puntos'
        },
        'opponent_points': {
            'en': 'Points of your opponent',
            'es': 'Puntos de tu oponente'
        },
        'rounds_left': {
            'en': 'Rounds left',
            'es': 'Rondas restantes'
        },
        'correct_answer': {
            'en': 'Correct answer!',
            'es': '¡Respuesta correcta!'
        },
        'incorrect_answer': {
            'en': 'Incorrect answer.',
            'es': 'Respuesta incorrecta.'
        },
        'seconds_remaining': {
            'en': 'seconds remaining',
            'es': 'segundos restantes'
        },
        'opponent_correct': {
            'en': 'The opponent answered correctly, you lost the round.',
            'es': 'El jugador contrario respondió bien, perdiste la ronda.'
        },
        'time_up': {
            'en': "Time's up!",
            'es': '¡Se acabó tu tiempo!'
        },
        'your_turn': {
            'en': "Your turn",
            'es': 'Es tu turno'
        },
        'other_player_turn': {
            'en': "The other player didn't answer in time, it's your turn.",
            'es': 'El otro jugador no respondió a tiempo, es tu turno.'
        },
        'wait_other_player': {
            'en': 'Wait for the other player to respond',
            'es': 'Espera a que el otro jugador responda'
        },
        'round_over': {
            'en': 'Round over, new question in',
            'es': 'Ronda finalizada, nueva pregunta en'
        },
        'winner_message': {
            'en': 'The winner is',
            'es': '¡El ganador es'
        },
        'draw_message': {
            'en': "It's a draw!",
            'es': '¡Es un empate!'
        },
        'language_display': {
            'en': 'Language: ',
            'es': 'Idioma: '
        }
    };

    return translations[key] && translations[key][selectedLanguage] ? translations[key][selectedLanguage] : key;
}


function updateTextForLanguage(selectedLanguage) {
    document.getElementById('dynamic-message-on-screen1').innerText = translate('press_red_button', selectedLanguage);
    document.getElementById('dynamic-message-on-screen2').innerText = translate('press_red_button', selectedLanguage);
    
    document.querySelector('#player1-section .scoreboard p:nth-child(1)').innerHTML = `${translate('points', selectedLanguage)}: <span id="player1-score">0</span>`;
    document.querySelector('#player1-section .scoreboard p:nth-child(2)').innerHTML = `${translate('opponent_points', selectedLanguage)}: <span id="player2-score-mirror">0</span>`;
    document.querySelector('#player1-section .scoreboard p:nth-child(3)').innerHTML = `${translate('rounds_left', selectedLanguage)}: <span id="rounds-left-mirror">5</span>`;
    
    document.querySelector('#player2-section .scoreboard p:nth-child(1)').innerHTML = `${translate('points', selectedLanguage)}: <span id="player2-score">0</span>`;
    document.querySelector('#player2-section .scoreboard p:nth-child(2)').innerHTML = `${translate('opponent_points', selectedLanguage)}: <span id="player1-score-mirror">0</span>`;
    document.querySelector('#player2-section .scoreboard p:nth-child(3)').innerHTML = `${translate('rounds_left', selectedLanguage)}: <span id="rounds-left">5</span>`;
    
    // Añadir más actualizaciones de texto aquí según sea necesario
}

async function fetchQuestions() {
    console.log("Iniciando fetchQuestions.");
    try {
        const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
        const questionsFile = selectedLanguage === 'es' ? '/questionsES.json' : '/questionsEN.json';
        
        const response = await fetch(questionsFile); // Ruta al archivo JSON basado en el idioma seleccionado
        questions = await response.json();
        shuffleArray(questions);
        console.log(`Preguntas cargadas desde ${questionsFile} y mezcladas:`, questions);
    } catch (error) {
        console.error('Error al cargar las preguntas:', error);
    }
}

function setupGame(selectedLanguage) {
    console.log("Configurando el juego.");
    setQuestion(selectedLanguage);
    enableButton('bigRedButton1');
    enableButton('bigRedButton2');

    document.getElementById('bigRedButton1').addEventListener('click', () => {
        redButtonSound.play().catch((error) => console.error('Error al reproducir el sonido:', error));
        console.log("Botón rojo del Jugador 1 presionado, iniciando su turno.");
        startPlayerTurn(1, 5, selectedLanguage); // Jugador 1 con 5 segundos
    });

    document.getElementById('bigRedButton2').addEventListener('click', () => {
        redButtonSound.play().catch((error) => console.error('Error al reproducir el sonido:', error));
        console.log("Botón rojo del Jugador 2 presionado, iniciando su turno.");
        startPlayerTurn(2, 5, selectedLanguage); // Jugador 2 con 5 segundos
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

    console.log(`Mostrando mensaje para el Jugador ${playerNumber} en ${selectedLanguage}: "${baseMessage}" con un tiempo límite de ${timeLimit} segundos.`);

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
    statusElement.innerText = `${baseMessage} ${timeLeft} ${translate('seconds_remaining', selectedLanguage)}`;

    // Si el tiempo es 0 o menor, no iniciar el intervalo
    if (timeLeft <= 0) {
        return;
    }

    // Crear un intervalo que actualice el mensaje cada segundo
    statusElement.interval = setInterval(() => {
        timeLeft--;

        // Actualizar el mensaje con el tiempo restante
        statusElement.innerText = `${baseMessage} ${timeLeft} ${translate('seconds_remaining', selectedLanguage)}`;

        // Si el tiempo se agota, detener el intervalo y limpiar el mensaje
        if (timeLeft <= 0) {
            clearInterval(statusElement.interval);
            statusElement.innerText = ''; // Limpia el mensaje después de que el tiempo se agote
            statusElement.interval = null;
            console.log(`Tiempo agotado para el Jugador ${playerNumber}, mensaje limpiado.`);
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

    storeAnswer(playerNumber, questions[currentQuestionIndex].question, button.innerText, isCorrect);

    if (isCorrect) {
        console.log(`Jugador ${playerNumber} respondió correctamente.`);
        playCorrectSound();
        updateScore(playerNumber, 10);
        showMessage(playerNumber, translate('correct_answer', selectedLanguage), 3); 

        let otherPlayer = playerNumber === 1 ? 2 : 1;
        showMessage(otherPlayer, translate('opponent_correct', selectedLanguage), 3);

        setTimeout(() => {
            proceedToNextRound(selectedLanguage);
        }, 3000); 
    } else {
        console.log(`Jugador ${playerNumber} respondió incorrectamente.`);
        playIncorrectSound();
        button.style.backgroundColor = 'red';
        updateScore(playerNumber, -10);
        showMessage(playerNumber, translate('incorrect_answer', selectedLanguage), 3);

        playersWhoAnswered++;

        if (playersWhoAnswered < 2) {
            setTimeout(() => {
                allowOtherPlayerToAnswer(playerNumber, selectedLanguage);
            }, 3000); 
        } else {
            setTimeout(() => {
                proceedToNextRound(selectedLanguage);
            }, 3000); 
        }
    }
}

function storeAnswer(playerNumber, question, answer, isCorrect) {
    let answerRecord = { question, answer, isCorrect };
    if (playerNumber === 1) {
        player1Answers.push(answerRecord);
    } else {
        player2Answers.push(answerRecord);
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

function endGame(selectedLanguage) {
    console.log("El juego ha terminado, determinando el ganador.");

    let winnerMessage = '';
    const player1NameStored = localStorage.getItem('player1Name') || 'Player 1';
    const player2NameStored = localStorage.getItem('player2Name') || 'Player 2';

    if (player1Score > player2Score) {
        winnerMessage = `${translate('winner_message', selectedLanguage)} ${player1NameStored}!`;
    } else if (player2Score > player1Score) {
        winnerMessage = `${translate('winner_message', selectedLanguage)} ${player2NameStored}!`;
    } else {
        winnerMessage = translate('draw_message', selectedLanguage);
    }

    localStorage.setItem('player1Results', JSON.stringify(player1Answers));
    localStorage.setItem('player2Results', JSON.stringify(player2Answers));
    localStorage.setItem('player1Score', player1Score);
    localStorage.setItem('player2Score', player2Score);
    localStorage.setItem('winnerMessage', winnerMessage);

    console.log(`Mensaje del ganador almacenado: ${winnerMessage}`);

    window.location.href = '/pages/results.html';
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

function startPlayerTurn(playerNumber, timeLimit, selectedLanguage) {
    currentPlayer = playerNumber;
    let otherPlayer = playerNumber === 1 ? 2 : 1;

    console.log(`Iniciando turno para el Jugador ${playerNumber} con un límite de tiempo de ${timeLimit} segundos.`);

    if (timers[playerNumber]) {
        clearTimeout(timers[playerNumber]);
    }
    if (timers[otherPlayer]) {
        clearTimeout(timers[otherPlayer]);
    }

    stopTickTockSound();

    disableButton(`bigRedButton${otherPlayer}`);
    showMessage(otherPlayer, translate('wait_other_player', selectedLanguage), timeLimit);

    disableAnswerButtons(otherPlayer);
    disableButton(`bigRedButton${playerNumber}`);

    enableAnswerButtons(playerNumber);
    showMessage(playerNumber, translate('your_turn', selectedLanguage), timeLimit);

    timers[playerNumber] = setTimeout(() => {
        console.log(`Tiempo agotado para el Jugador ${playerNumber}.`);
        handlePlayerTimeout(playerNumber, timeLimit, selectedLanguage);
    }, timeLimit * 1000);
}

function handlePlayerTimeout(playerNumber, timeLimit, selectedLanguage) {
    console.log(`Tiempo agotado para el Jugador ${playerNumber}.`);

    let otherPlayer = playerNumber === 1 ? 2 : 1;

    // Deshabilitar botones de respuesta para el jugador que se quedó sin tiempo
    disableAnswerButtons(playerNumber);

    // Mostrar mensaje de tiempo agotado
    showMessage(playerNumber, translate('time_up', selectedLanguage), 5);
    showMessage(otherPlayer, translate('other_player_turn', selectedLanguage), 5);

    playersWhoAnswered++;
    console.log(`Número de jugadores que han respondido o agotado su tiempo: ${playersWhoAnswered}`);

    if (playersWhoAnswered < 2) {
        console.log(`Permitiendo al Jugador ${otherPlayer} responder después de 5 segundos.`);
        setTimeout(() => {
            allowOtherPlayerToAnswer(playerNumber, selectedLanguage);
        }, 5000);
    } else {
        console.log("Ambos jugadores han respondido o agotado su tiempo. Procediendo a la siguiente ronda.");
        setTimeout(() => {
            proceedToNextRound(selectedLanguage);
        }, 5000);
    }
}

function allowOtherPlayerToAnswer(playerNumber, selectedLanguage) {
    let otherPlayer = playerNumber === 1 ? 2 : 1;
    console.log(`Permitiendo al Jugador ${otherPlayer} responder después de que el Jugador ${playerNumber} falló.`);

    enableButton(`bigRedButton${otherPlayer}`);
    enableAnswerButtons(otherPlayer);

    startPlayerTurn(otherPlayer, 30, selectedLanguage); 
}

function proceedToNextRound(selectedLanguage) {
    roundsLeft--;
    document.getElementById('rounds-left').innerText = roundsLeft;
    document.getElementById('rounds-left-mirror').innerText = roundsLeft;
    console.log(`Rondas restantes: ${roundsLeft}`);

    if (roundsLeft === 0) {
        console.log("No quedan más rondas, finalizando juego.");
        endGame(selectedLanguage);
    } else {
        currentQuestionIndex++;
        playersWhoAnswered = 0; 

        showMessage(1, translate('round_over', selectedLanguage), 10);
        showMessage(2, translate('round_over', selectedLanguage), 10);

        setTimeout(() => {
            setQuestion(selectedLanguage); 
            enableButton('bigRedButton1');
            enableButton('bigRedButton2');

            if (document.getElementById('dynamic-message-on-screen1').interval) {
                clearInterval(document.getElementById('dynamic-message-on-screen1').interval);
            }
            if (document.getElementById('dynamic-message-on-screen2').interval) {
                clearInterval(document.getElementById('dynamic-message-on-screen2').interval);
            }

            document.getElementById('dynamic-message-on-screen1').innerText = translate('press_red_button', selectedLanguage);
            document.getElementById('dynamic-message-on-screen2').innerText = translate('press_red_button', selectedLanguage);

            console.log("Nueva ronda configurada. Mensaje de botón rojo mostrado.");
        }, 10000); 
    }
}

function setQuestion(selectedLanguage) {
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
        button1.style.backgroundColor = ''; 
        button2.style.backgroundColor = '';
        button1.disabled = true; 
        button2.disabled = true; 

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

function displaySelectedLanguage(show, selectedLanguage) {
    const languageDisplayElement = document.getElementById('language-display');
    if (show) {
        languageDisplayElement.innerText = translate('language_display', selectedLanguage) + selectedLanguage;
        languageDisplayElement.style.display = 'block';
    } else {
        languageDisplayElement.style.display = 'none';
    }
}




