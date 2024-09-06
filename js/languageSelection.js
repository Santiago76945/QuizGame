// languageSelection.js

// Constante global para almacenar el idioma seleccionado
let selectedLanguage = localStorage.getItem('selectedLanguage') || 'es'; // Valor por defecto en español
console.log(`Idioma seleccionado al iniciar: ${selectedLanguage}`);

// Textos en ambos idiomas
const texts = {
    es: {
        playButton: 'Jugar',
        settingsButton: 'Ajustes',
        changeNameButton: 'Cambiar nombre de los jugadores',
        premiumButton: 'Adquirir versión premium',
        aboutButton: 'Sobre nosotros',
        contactButton: 'Contáctanos',
        footerText: 'Este juego pertenece a Santiago Haspert, todos los derechos reservados.',
    },
    en: {
        playButton: 'Play',
        settingsButton: 'Settings',
        changeNameButton: 'Change Player Names',
        premiumButton: 'Acquire Premium Version',
        aboutButton: 'About Us',
        contactButton: 'Contact Us',
        footerText: 'This game belongs to Santiago Haspert, all rights reserved.',
    }
};

// Función para cambiar el idioma y actualizar los textos
function setLanguage(language) {
    console.log(`Cambiando idioma a: ${language}`);
    selectedLanguage = language;
    localStorage.setItem('selectedLanguage', language); // Guardar el idioma seleccionado
    if (isIndexPage()) {
        updateTexts();
    }
    console.log(`Idioma actual después del cambio: ${selectedLanguage}`);
}

// Función para actualizar los textos en la página
function updateTexts() {
    console.log(`Actualizando textos en la página a: ${selectedLanguage}`);
    document.querySelector('.play-button').textContent = texts[selectedLanguage].playButton;
    document.querySelector('.change-name-button').textContent = texts[selectedLanguage].changeNameButton;
    document.querySelector('.premium-button').textContent = texts[selectedLanguage].premiumButton;
    document.querySelector('.about-button').textContent = texts[selectedLanguage].aboutButton;
    document.querySelector('.contact-button').textContent = texts[selectedLanguage].contactButton;
    document.querySelector('.footer-text p').textContent = texts[selectedLanguage].footerText;
    console.log(`Textos actualizados para el idioma: ${selectedLanguage}`);
}

// Función para verificar si estamos en index.html
function isIndexPage() {
    const isIndex = window.location.href.includes('index.html') || window.location.pathname === '/';
    console.log(`¿Estamos en index.html?: ${isIndex}`);
    return isIndex;
}

// Añadir event listeners a los botones de idioma
document.getElementById('language-es').addEventListener('click', () => setLanguage('es'));
document.getElementById('language-en').addEventListener('click', () => setLanguage('en'));

// Llamar a updateTexts solo si estamos en index.html
if (isIndexPage()) {
    updateTexts();
}



