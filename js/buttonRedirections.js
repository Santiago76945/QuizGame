// buttonRedirections.js

// Función para redirigir a la página de adquirir versión premium
function acquirePremium() {
    window.location.href = '/pages/goPremium.html';
}

// Función para redirigir a la página sobre nosotros
function aboutUs() {
    window.location.href = '/pages/aboutUs.html';
}

// Función para abrir el cliente de correo para contactar
function contactUs() {
    const email = 'ThiagoKing@proton.me';
    const subject = 'Consulta sobre TK Games';
    const body = 'Hola, me gustaría saber más sobre...'; // Opcional: personaliza el cuerpo del mensaje
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Añadir event listeners a los botones correspondientes
document.querySelector('.premium-button').addEventListener('click', acquirePremium);
document.querySelector('.about-button').addEventListener('click', aboutUs);
document.querySelector('.contact-button').addEventListener('click', contactUs);
