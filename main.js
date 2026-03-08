const radarContainer = document.getElementById('radar');
const spotlight = document.getElementById('spotlight');
const points = document.querySelectorAll('.radar-point');
const tooltip = document.getElementById('tooltip');
const xCoordDisplay = document.querySelector('.x-coord');
const yCoordDisplay = document.querySelector('.y-coord');
const zCoordDisplay = document.querySelector('.z-coord');

// Mover la "linterna" del radar con el ratón
radarContainer.addEventListener('mousemove', (e) => {
    const rect = radarContainer.getBoundingClientRect();

    // Coordenadas relativas dentro de la caja del radar
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Actualizar variables CSS para el "spotlight"
    radarContainer.style.setProperty('--mouse-x', `${x}px`);
    radarContainer.style.setProperty('--mouse-y', `${y}px`);

    // Lógica de "Radar de Proximidad":
    // Comprobamos la distancia de cada punto al ratón para revelarlos si están cerca de la luz.
    const detectionRadius = 150; // A cuántos píxeles de distancia la luz revela el punto

    points.forEach((point) => {
        // Calcular centro del punto (los datos top/left están en porcentajes, pero clientRect da pixeles relativos a pantalla)
        const pointRect = point.getBoundingClientRect();
        const pointCenterX = pointRect.left + pointRect.width / 2 - rect.left;
        const pointCenterY = pointRect.top + pointRect.height / 2 - rect.top;

        const dx = x - pointCenterX;
        const dy = y - pointCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Si el punto entra en el rayo de luz (linterna) se vuelve parcialmente visible según cercanía
        if (distance < detectionRadius) {
            // Cálculo de opacidad: más cerca = más visible (de 0 a 1)
            // Ajustamos un poco para que el centro sea 1 y los bordes 0:
            let proximityOpacity = 1 - (distance / detectionRadius);
            point.style.opacity = proximityOpacity.toFixed(2);

            // Añadir un tono verde visual base cuando se detecta
            point.style.backgroundColor = `rgba(0, 255, 136, ${proximityOpacity})`;

            // Actualizar datos técnicos en pantalla para dar efecto película
            xCoordDisplay.textContent = ((x / rect.width) * 1000).toFixed(2);
            yCoordDisplay.textContent = `${Math.floor(pointCenterX)}, ${Math.floor(pointCenterY)}`;
            zCoordDisplay.textContent = (distance / 4).toFixed(3);
        } else {
            // Fuera del radar
            point.style.opacity = '0';
        }
    });

});

// Limpiar la luz si el ratón sale del radar
radarContainer.addEventListener('mouseleave', () => {
    radarContainer.style.setProperty('--mouse-x', `-1000px`);
    radarContainer.style.setProperty('--mouse-y', `-1000px`);

    points.forEach(point => point.style.opacity = '0');

    xCoordDisplay.textContent = '--.--';
    yCoordDisplay.textContent = '---, ---';
    zCoordDisplay.textContent = '--.---';
});


// Tooltip Information
points.forEach((point) => {
    point.addEventListener('mouseenter', (e) => {
        const info = e.target.getAttribute('data-info');
        tooltip.textContent = info;
        tooltip.style.opacity = '1';

        const rect = e.target.getBoundingClientRect();
        const containerRect = radarContainer.getBoundingClientRect();

        const left = rect.left - containerRect.left;
        const top = rect.top - containerRect.top;

        tooltip.style.left = `${left + 20}px`;
        tooltip.style.top = `${top - 10}px`;
    });

    point.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
    });
});
