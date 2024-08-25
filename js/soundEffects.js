// soundEffects.js

// Carga de sonidos
const tickTockSound = new Audio('/sounds/tickTockSound.mp3');
const correctSound = new Audio('/sounds/correct.mp3');
const incorrectSound = new Audio('/sounds/incorrect.mp3');
const redButtonSound = new Audio('/sounds/redButton.mp3');
const backgroundMusic = new Audio('/music/background.mp3');  // Carga de la música de fondo
const mainThemeMusic = new Audio('/music/mainTheme.mp3');  // Música para el menú principal
const resultsMusic = new Audio('/music/results.mp3');  // Música para la página de resultados

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

function playBackgroundMusic(music) {
    music.loop = true;  // Hacer que la música se repita
    music.volume = 0.5;  // Reducir el volumen al 50%
    music.play().catch(error => {
        console.log('Autoplay was prevented:', error);
    });
}

// Verificar la página y establecer la música a reproducir
const currentPage = window.location.pathname;
let selectedMusic;

if (currentPage === '/index.html') {
    selectedMusic = mainThemeMusic;
} else if (currentPage === '/pages/game.html') {
    selectedMusic = backgroundMusic;
} else if (currentPage === '/pages/results.html') {
    selectedMusic = resultsMusic;
}

// Esperar la interacción del usuario para reproducir la música
if (selectedMusic) {
    document.addEventListener('click', function () {
        playBackgroundMusic(selectedMusic);
    }, { once: true });
}

// Exponer funciones globalmente
window.playTickTockSound = playTickTockSound;
window.stopTickTockSound = stopTickTockSound;
window.playCorrectSound = playCorrectSound;
window.playIncorrectSound = playIncorrectSound;
window.playRedButtonSound = playRedButtonSound;
