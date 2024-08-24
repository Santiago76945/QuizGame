// dynamicBackground.js

const createBokehBackground = () => {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '0'; // Detrás del contenido
    canvas.style.pointerEvents = 'none'; // Evitar interferencia con clics
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const bokehCircles = [];
    const numCircles = 20; // Reducido el número de círculos

    // Definir los tonos de amarillo, dorado y naranja suave
    const colors = [
        '255, 223, 0',   // Amarillo brillante
        '255, 165, 0',   // Naranja suave
        '255, 215, 0'    // Dorado
    ];

    // Función para verificar si dos círculos se superponen
    function circlesOverlap(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (circle1.radius + circle2.radius);
    }

    // Crear círculos de bokeh inicialmente
    for (let i = 0; i < numCircles; i++) {
        let newCircle;
        let overlapping;

        do {
            newCircle = createCircle();
            overlapping = bokehCircles.some(circle => circlesOverlap(newCircle, circle));
        } while (overlapping);

        bokehCircles.push(newCircle);
    }

    function createCircle() {
        const color = colors[Math.floor(Math.random() * colors.length)]; // Seleccionar un color aleatorio de la lista
        
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: (Math.random() * 150 + 50),  // Tamaño de los círculos
            alpha: Math.random() * 0.15 + 0.001, // Transparencia entre 26% y 40%
            dx: (Math.random() - 0.5) * 0.17,  // Movimiento en x a un tercio de la velocidad original
            dy: (Math.random() - 0.5) * 0.17,  // Movimiento en y a un tercio de la velocidad original
            color: color  // Usar color aleatorio de la lista
        };
    }
    
    // Función para dibujar un círculo de bokeh
    function drawCircle(circle) {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(${circle.color}, ${circle.alpha})`;
        ctx.shadowColor = `rgba(${circle.color}, ${circle.alpha})`;
        ctx.shadowBlur = 15;
        ctx.fill();
    }

    // Animación del bokeh
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        bokehCircles.forEach(circle => {
            circle.x += circle.dx;
            circle.y += circle.dy;

            // Rebote en los bordes
            if (circle.x < 0 || circle.x > canvas.width) circle.dx *= -1;
            if (circle.y < 0 || circle.y > canvas.height) circle.dy *= -1;

            drawCircle(circle);
        });

        requestAnimationFrame(animate);
    };

    animate();

    // Redimensionar el canvas cuando la ventana cambia de tamaño
    window.onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
};

window.addEventListener('load', createBokehBackground);
