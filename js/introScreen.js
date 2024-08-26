//introScreen.js

document.addEventListener('DOMContentLoaded', function () {
    // Crear el overlay de la pantalla negra
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'black';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.flexDirection = 'column';

    // Verificar si la página es results.html
    const isResultsPage = window.location.pathname.endsWith('/pages/results.html');

    if (isResultsPage) {
        // Crear el mensaje
        const message = document.createElement('p');
        message.textContent = 'La partida ha finalizado, ¿listo para ver los resultados?';
        message.style.color = 'white';
        message.style.fontSize = '24px';
        message.style.textAlign = 'center';
        message.style.margin = '20px';

        // Crear el botón de ver resultados
        const resultsButton = document.createElement('button');
        resultsButton.textContent = 'Ver Resultados';
        resultsButton.style.marginTop = '20px';
        resultsButton.classList.add('intro-screen-button');  // Añadir la clase específica
        resultsButton.style.padding = '10px 20px';
        resultsButton.style.fontSize = '18px';
        resultsButton.style.cursor = 'pointer';
        resultsButton.style.transition = 'opacity 1s ease-in-out';

        // Añadir el mensaje y el botón al overlay
        overlay.appendChild(message);
        overlay.appendChild(resultsButton);

        // Funcionalidad del botón de ver resultados
        resultsButton.addEventListener('click', function () {
            overlay.style.transition = 'opacity 1s ease-in-out';
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 1000); // Tiempo para que la transición ocurra antes de eliminar el overlay
        });

    } else {
        // Crear el logo
        const logo = document.createElement('img');
        logo.src = '/images/TKlogo.png'; // Asegúrate de que la ruta sea correcta
        logo.style.width = '0';
        logo.style.height = '0';
        logo.style.opacity = '0';
        logo.style.borderRadius = '50%';
        logo.style.transition = 'width 2s ease-in-out, height 2s ease-in-out, opacity 2s ease-in-out';

        // Obtener el idioma seleccionado
        const selectedLanguage = localStorage.getItem('selectedLanguage') || 'es';

        // Texto del botón de comenzar en ambos idiomas
        const startButtonText = {
            es: 'Comenzar',
            en: "Let's Play"
        };

        // Crear el botón de comenzar
        const startButton = document.createElement('button');
        startButton.textContent = startButtonText[selectedLanguage];
        startButton.classList.add('intro-screen-button');  // Añadir la clase específica
        startButton.style.marginTop = '20px';
        startButton.style.padding = '10px 20px';
        startButton.style.fontSize = '18px';
        startButton.style.cursor = 'pointer';
        startButton.style.transition = 'opacity 1s ease-in-out';

        // Crear el disclaimer con posición absoluta
        const disclaimer = document.createElement('p');
        disclaimer.classList.add('footer-text'); // Clase para el texto de footer
        disclaimer.style.color = 'white';
        disclaimer.style.fontSize = '16px';
        disclaimer.style.textAlign = 'center';
        disclaimer.style.position = 'absolute';
        disclaimer.style.bottom = '10px';
        disclaimer.style.left = '50%';
        disclaimer.style.transform = 'translateX(-50%)';
        disclaimer.style.padding = '10px';

        // Texto del disclaimer en ambos idiomas
        const disclaimerTexts = {
            es: '© 2024 TriviaRUSH. Todos los derechos reservados. TriviaRUSH es un juego desarrollado por Santiago Haspert y TK Games. Todos los derechos sobre el contenido, diseño, y software de TriviaRUSH están reservados. La reproducción, distribución, exhibición pública, o cualquier otra forma de utilización de este juego o de su contenido sin la autorización expresa de los titulares de los derechos está estrictamente prohibida.',
            en: '© 2024 TriviaRUSH. All rights reserved. TriviaRUSH is a game developed by Santiago Haspert and TK Games. All rights to the content, design, and software of TriviaRUSH are reserved. Reproduction, distribution, public display, or any other form of use of this game or its content without the express authorization of the rights holders is strictly prohibited.'
        };

        // Asignar el texto del disclaimer basado en el idioma seleccionado
        disclaimer.textContent = disclaimerTexts[selectedLanguage];

        // Añadir el logo, el botón, y el disclaimer al overlay
        overlay.appendChild(logo);
        overlay.appendChild(startButton);
        overlay.appendChild(disclaimer);

        // Animación de entrada para el logo
        setTimeout(() => {
            logo.style.width = '150px';
            logo.style.height = '150px';
            logo.style.opacity = '1';
        }, 100); // Pequeño retraso para asegurar que la animación se vea correctamente

        // Funcionalidad del botón de comenzar
        startButton.addEventListener('click', function () {
            overlay.style.transition = 'opacity 1s ease-in-out';
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 1000); // Tiempo para que la transición ocurra antes de eliminar el overlay
        });
    }

    // Añadir el overlay al cuerpo del documento
    document.body.appendChild(overlay);
});


