// // dynamicBackground.js

// const createBokehBackground = () => {
//     const canvas = document.createElement('canvas');
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     canvas.style.position = 'fixed';
//     canvas.style.top = '0';
//     canvas.style.left = '0';
//     canvas.style.zIndex = '0'; // Detrás del contenido
//     document.body.appendChild(canvas);

//     const ctx = canvas.getContext('2d');
//     const bokehCircles = [];
//     const numCircles = 20; // Reducido el número de círculos

//     // Crear círculos de bokeh inicialmente
//     for (let i = 0; i < numCircles; i++) {
//         bokehCircles.push(createCircle());
//     }

//     function createCircle() {
//         // Generar colores más saturados
//         const r = Math.floor(Math.random() * 106 + 150);  // Rojo entre 150 y 255
//         const g = Math.floor(Math.random() * 106 + 150);  // Verde entre 150 y 255
//         const b = Math.floor(Math.random() * 106 + 150);  // Azul entre 150 y 255
        
//         return {
//             x: Math.random() * canvas.width,
//             y: Math.random() * canvas.height,
//             radius: (Math.random() * 40 + 10),  // Tamaño de los circulos
//             alpha: Math.random() * 0.01 + 0.1, // Transparencia entre 0.1% y 1%
//             dx: (Math.random() - 0.5) * 0.17,  // Movimiento en x a un tercio de la velocidad original
//             dy: (Math.random() - 0.5) * 0.17,  // Movimiento en y a un tercio de la velocidad original
//             color: `${r}, ${g}, ${b}`  // Color más saturado
//         };
//     }
    
//     // Función para dibujar un círculo de bokeh
//     function drawCircle(circle) {
//         ctx.beginPath();
//         ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
//         ctx.fillStyle = `rgba(${circle.color}, ${circle.alpha})`;
//         ctx.shadowColor = `rgba(${circle.color}, ${circle.alpha})`;
//         ctx.shadowBlur = 15;
//         ctx.fill();
//     }

//     // Animación del bokeh
//     const animate = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         bokehCircles.forEach(circle => {
//             circle.x += circle.dx;
//             circle.y += circle.dy;

//             // Rebote en los bordes
//             if (circle.x < 0 || circle.x > canvas.width) circle.dx *= -1;
//             if (circle.y < 0 || circle.y > canvas.height) circle.dy *= -1;

//             drawCircle(circle);
//         });

//         requestAnimationFrame(animate);
//     };

//     animate();

//     // Redimensionar el canvas cuando la ventana cambia de tamaño
//     window.onresize = () => {
//         canvas.width = window.innerWidth;
//         canvas.height = window.innerHeight;
//     };
// };

// window.addEventListener('load', createBokehBackground);


