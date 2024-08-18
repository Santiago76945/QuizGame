//soundEffects.js

// Carga de sonidos
const tickTockSound = new Audio('/sounds/tickTockSound.mp3');
const correctSound = new Audio('/sounds/correct.mp3');
const incorrectSound = new Audio('/sounds/incorrect.mp3');
const redButtonSound = new Audio('/sounds/redButton.mp3');

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

// Exportar las funciones para ser usadas en otros archivos
export {
    playTickTockSound,
    stopTickTockSound,
    playCorrectSound,
    playIncorrectSound,
    playRedButtonSound
};
