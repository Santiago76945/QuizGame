// goPremium.js

// Obtener el idioma seleccionado de localStorage
let selectedLanguage = localStorage.getItem('selectedLanguage') || 'es'; // Valor por defecto en español

// Textos en ambos idiomas
const premiumTexts = {
    es: {
        premiumMessage: '¡Adquiere la versión sin publicidad y disfruta de una experiencia sin interrupciones!',
        acquireButton: 'Adquirir versión premium',
        backButton: 'Volver al menú principal',
    },
    en: {
        premiumMessage: 'Get the ad-free version and enjoy an uninterrupted experience!',
        acquireButton: 'Acquire Premium Version',
        backButton: 'Return to Main Menu',
    }
};

// Función para actualizar los textos en la página
function updatePremiumTexts() {
    document.querySelector('.premium-message').textContent = premiumTexts[selectedLanguage].premiumMessage;
    document.querySelector('.acquire-button').textContent = premiumTexts[selectedLanguage].acquireButton;
    document.querySelector('.back-button').textContent = premiumTexts[selectedLanguage].backButton;
}

// Llamar a la función para actualizar los textos al cargar la página
updatePremiumTexts();
