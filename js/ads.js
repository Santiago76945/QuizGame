// ads.js

// Porcentaje de posibilidad de mostrar ads (50% por defecto)
const showAdsProbability = 50;

// Variable para identificar si el usuario es premium (por defecto es false)
let premiumUser = false;

// Verifica si el usuario es premium, de ser así, no ejecuta los anuncios
if (!premiumUser) {
    // Verifica si se debe mostrar publicidad según el porcentaje configurado
    const shouldShowAds = Math.random() * 100 < showAdsProbability;

    if (shouldShowAds) {
        console.log('Decisión de mostrar publicidad: Sí'); // Log para verificar que se decidió mostrar anuncios
        // Obtener el idioma seleccionado de localStorage
        let selectedLanguage = localStorage.getItem('selectedLanguage') || 'es'; // Valor por defecto en español

        // Traducciones para los botones
        const translations = {
            skipAd: {
                en: 'Skip Ad',
                es: 'Omitir Publicidad'
            },
            disableAds: {
                en: 'Disable Ads',
                es: 'Desactivar Publicidad'
            }
        };

        // Crear el contenedor para el anuncio
        const adContainer = document.createElement('div');
        adContainer.id = 'adContainer';
        adContainer.style.position = 'fixed';
        adContainer.style.top = '0';
        adContainer.style.left = '0';
        adContainer.style.width = '100vw';
        adContainer.style.height = '100vh';
        adContainer.style.backgroundColor = '#000';
        adContainer.style.zIndex = '1000'; // Asegura que esté por encima de otros elementos
        adContainer.style.display = 'flex';
        adContainer.style.flexDirection = 'column';
        adContainer.style.justifyContent = 'flex-end';
        adContainer.style.alignItems = 'center';
        adContainer.style.paddingBottom = '20px'; // Añadir espacio para los botones
        document.body.appendChild(adContainer);

        // Seleccionar un video al azar de la carpeta /ads
        const videoList = ['video1.MP4']; // Ejemplos de videos
        const randomVideo = videoList[Math.floor(Math.random() * videoList.length)];
        console.log(`Video seleccionado: ${randomVideo}`); // Log para verificar el video seleccionado

        // Crear el elemento de video
        const videoElement = document.createElement('video');
        videoElement.src = `/ads/${randomVideo}`;
        videoElement.autoplay = true;
        videoElement.loop = true;
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.objectFit = 'cover'; // Asegura que el video cubra toda la pantalla
        
        // Agregar eventos para depurar reproducción
        videoElement.addEventListener('play', () => console.log('El video ha empezado a reproducirse.'));
        videoElement.addEventListener('ended', () => console.log('El video ha terminado, pero debería reproducirse en bucle.'));
        videoElement.addEventListener('error', (e) => console.error('Error al reproducir el video:', e));
        videoElement.addEventListener('loadeddata', () => console.log('El video se ha cargado correctamente.'));
        videoElement.addEventListener('loop', () => console.log('Looping video.')); // Nota: el evento "loop" no existe, pero puedes verificar manualmente

        adContainer.appendChild(videoElement);

        // Crear un contenedor para los botones
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.bottom = '20px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px'; // Espacio entre botones
        buttonContainer.style.zIndex = '1001'; // Asegura que los botones estén por encima del video
        adContainer.appendChild(buttonContainer);

        // Función para crear un botón con texto en el idioma seleccionado
        function createButton(textKey, onClick) {
            const button = document.createElement('button');
            button.innerText = translations[textKey][selectedLanguage];
            button.style.padding = '10px 20px';
            button.style.fontSize = '16px';
            button.style.backgroundColor = '#fff';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.onclick = onClick;
            return button;
        }

        // Función para añadir botones con un retraso
        setTimeout(() => {
            // Botón para omitir la publicidad
            const skipButton = createButton('skipAd', () => {
                adContainer.remove();
            });
            buttonContainer.appendChild(skipButton);

            // Botón para desactivar los ads redirigiendo a la página de premium
            const disableAdsButton = createButton('disableAds', () => {
                window.location.href = '/pages/goPremium.html';
            });
            buttonContainer.appendChild(disableAdsButton);
        }, 15000); // 15000 milisegundos = 15 segundos

    } else {
        console.log('Decisión de mostrar publicidad: No'); // Log para verificar que no se muestran anuncios
    }
} else {
    console.log('El usuario es premium, no se mostrarán anuncios.'); // Log para usuario premium
}

