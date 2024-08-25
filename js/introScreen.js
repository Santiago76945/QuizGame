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
        resultsButton.classList.add('results-screen-button');
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

        // Crear el botón de comenzar
        const startButton = document.createElement('button');
        startButton.textContent = 'Comenzar';
        startButton.classList.add('intro-screen-button');  // Añadir la clase específica
        startButton.style.marginTop = '20px';
        startButton.style.padding = '10px 20px';
        startButton.style.fontSize = '18px';
        startButton.style.cursor = 'pointer';
        startButton.style.transition = 'opacity 1s ease-in-out';

        // Añadir el logo y el botón al overlay
        overlay.appendChild(logo);
        overlay.appendChild(startButton);


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
