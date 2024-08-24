// languageSelection.js

// Constante global para almacenar el idioma seleccionado
let selectedLanguage = 'es'; // Valor por defecto en español

// Textos en ambos idiomas
const texts = {
    es: {
        playButton: 'Jugar',
        settingsButton: 'Ajustes',
        changeNameButton: 'Cambiar nombre de los jugadores',
        footerText: 'Este juego pertenece a Santiago Haspert, todos los derechos reservados.',
    },
    en: {
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
    document.querySelector('.play-button').textContent = texts[selectedLanguage].playButton;
    document.querySelector('.settings-button').textContent = texts[selectedLanguage].settingsButton;
    document.querySelector('.change-name-button').textContent = texts[selectedLanguage].changeNameButton;
    document.querySelector('.footer-text p').textContent = texts[selectedLanguage].footerText;
}

// Llamar a updateTexts para aplicar el idioma por defecto al cargar la página
updateTexts();
