// Obtener el idioma seleccionado de localStorage
let selectedLanguage = localStorage.getItem('selectedLanguage') || 'es'; // Valor por defecto en español

// Textos en ambos idiomas
const aboutTexts = {
    es: {
        title: 'Sobre TK Games',
        message: `TK Games es una división de Thiago King, propiedad de Santiago Haspert Piaggio, enfocada en el desarrollo de videojuegos, especialmente para dispositivos móviles. Nos apasiona crear juegos accesibles y divertidos para todos. Desde nuestros inicios, hemos trabajado con dedicación en cada proyecto, buscando siempre mejorar y aprender. Nuestro primer juego, "Super Lucky's Adventure", está disponible en Google Play Store y marcó nuestro comienzo en el mundo de los videojuegos.

        Con un equipo comprometido, en TK Games seguimos explorando nuevas ideas con el objetivo de hacer juegos que sean disfrutables y accesibles para una amplia audiencia. Siempre estamos felices de escuchar la opinión de nuestra audiencia para mejorar la calidad de nuestros productos y acercarnos a la calidad que esperan de nosotros. Muchas gracias por confiar en nosotros y esperamos que disfrutes de nuestros productos.`
    },
    en: {
        title: 'About TK Games',
        message: `TK Games is a division of Thiago King, owned by Santiago Haspert Piaggio, focused on developing video games, especially for mobile devices. We are passionate about creating accessible and fun games for everyone. Since our beginnings, we have worked with dedication on each project, always striving to improve and learn. Our first game, "Super Lucky's Adventure," is available on Google Play Store and marked our start in the video game world.

        With a dedicated team, TK Games continues to explore new ideas with the aim of making games that are enjoyable and accessible to a broad audience. We are always happy to hear feedback from our audience to improve the quality of our products and meet the quality they expect from us. Thank you for trusting us, and we hope you enjoy our products.`
    }
};

// Función para actualizar los textos en la página
function updateAboutTexts() {
    document.querySelector('.about-title').textContent = aboutTexts[selectedLanguage].title;
    document.querySelector('.about-message').textContent = aboutTexts[selectedLanguage].message;
}

// Llamar a la función para actualizar los textos al cargar la página
updateAboutTexts();
