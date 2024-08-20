// soundEffects.js

// Carga de sonidos
const tickTockSound = new Audio('/sounds/tickTockSound.mp3');
const correctSound = new Audio('/sounds/correct.mp3');
const incorrectSound = new Audio('/sounds/incorrect.mp3');
const redButtonSound = new Audio('/sounds/redButton.mp3');
const backgroundMusic = new Audio('/music/quizBackground.mp3');  // Carga de la música de fondo

// Funciones para reproducir sonidos
function playTickTockSound() {
    tickTockSound.loop = true;  // Hacer que el sonido se repita
    tickTockSound.play();
}

function stopTickTockSound() {
    tickTockSound.pause();
    tickTockSound.currentTime = 0;  // Reiniciar el sonido para que comience desde el principio la próxima vez
}

function playCorrectSound() {
    correctSound.play();
}

function playIncorrectSound() {
    incorrectSound.play();
}

function playRedButtonSound() {
    redButtonSound.play();
}

function playBackgroundMusic() {
    backgroundMusic.loop = true;  // Hacer que la música de fondo se repita
    backgroundMusic.play();
}

// Verificar si la página es /index.html y reproducir la música de fondo
if (window.location.pathname === '/index.html') {
    playBackgroundMusic();
}

// Exponer funciones globalmente
window.playTickTockSound = playTickTockSound;
window.stopTickTockSound = stopTickTockSound;
window.playCorrectSound = playCorrectSound;
window.playIncorrectSound = playIncorrectSound;
window.playRedButtonSound = playRedButtonSound;
