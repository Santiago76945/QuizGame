// languageSelection.js

// Constante global para almacenar el idioma seleccionado
let selectedLanguage = 'es'; // Valor por defecto en español

// Textos en ambos idiomas
const texts = {
    es: {
        title: 'Trivia Veloz',
        playButton: 'Jugar',
        settingsButton: 'Ajustes',
        changeNameButton: 'Cambiar nombre de los jugadores',
        footerText: 'Este juego pertenece a Santiago Haspert, todos los derechos reservados.',
    },
    en: {
        title: 'Fast Trivia',
        playButton: 'Play',
        settingsButton: 'Settings',
        changeNameButton: 'Change Player Names',
        footerText: 'This game belongs to Santiago Haspert, all rights reserved.',
    }
};

// Función para cambiar el idioma y actualizar los textos
function setLanguage(language) {
    selectedLanguage = language;
    updateTexts();
}

// Función para actualizar los textos en la página
function updateTexts() {
    document.querySelector('.menu-title').textContent = texts[selectedLanguage].title;
    document.querySelector('.menu-button:nth-child(3)').textContent = texts[selectedLanguage].playButton;
    document.querySelector('.menu-button:nth-child(4)').textContent = texts[selectedLanguage].settingsButton;
    document.querySelector('.menu-button:nth-child(5)').textContent = texts[selectedLanguage].changeNameButton;
    document.querySelector('.footer-text p').textContent = texts[selectedLanguage].footerText;
}

// Llamar a updateTexts para aplicar el idioma por defecto al cargar la página
updateTexts();
