// gameResults.js

import { player1Name, player2Name } from './playersInfo.js';

// Objeto con los textos en diferentes idiomas
const resultTexts = {
    es: {
        backButton: '← Menú Principal',
        resultsTitle: 'Resultados Finales',
        round: 'Ronda',
        correct: 'Correcto',
        incorrect: 'Incorrecto',
        points: 'puntos',
        congratulations: '¡Felicitaciones',
        unanswered: 'No respondido',
    },
    en: {
        backButton: '← Main Menu',
        resultsTitle: 'Final Results',
        round: 'Round',
        correct: 'Correct',
        incorrect: 'Incorrect',
        points: 'points',
        congratulations: 'Congratulations',
        unanswered: 'Unanswered',
    }
};

// Obtener el idioma seleccionado
const selectedLanguage = localStorage.getItem('selectedLanguage') || 'es';

document.addEventListener('DOMContentLoaded', () => {
    const player1Results = JSON.parse(localStorage.getItem('player1Results')) || [];
    const player2Results = JSON.parse(localStorage.getItem('player2Results')) || [];
    const player1Score = localStorage.getItem('player1Score') || 0;
    const player2Score = localStorage.getItem('player2Score') || 0;
    const winnerMessage = localStorage.getItem('winnerMessage') || '';

    const resultItemsContainer = document.getElementById('result-items');
    const winnerMessageElement = document.getElementById('winner-message');
    const resultsTitleElement = document.querySelector('.results-title');
    const backButtonElement = document.querySelector('.back-button');

    // Actualizar el título y el botón de regreso según el idioma
    resultsTitleElement.textContent = resultTexts[selectedLanguage].resultsTitle;
    backButtonElement.textContent = resultTexts[selectedLanguage].backButton;

    // Determinar el número total de rondas
    const totalRounds = Math.max(player1Results.length, player2Results.length);

    // Crear los elementos de resultado pero no mostrarlos aún
    for (let i = 0; i < totalRounds; i++) {
        const player1Result = player1Results[i] || { answer: resultTexts[selectedLanguage].unanswered, isCorrect: false };
        const player2Result = player2Results[i] || { answer: resultTexts[selectedLanguage].unanswered, isCorrect: false };

        const resultItem = document.createElement('div');
        resultItem.className = 'result-item hidden'; // Agregar clase 'hidden' inicialmente
        resultItem.innerHTML = `
            <p class="round-number">${resultTexts[selectedLanguage].round} ${i + 1}</p>
            <p class="player-result"><strong>${player1Name}:</strong> ${player1Result.answer} (${player1Result.isCorrect ? resultTexts[selectedLanguage].correct : resultTexts[selectedLanguage].incorrect})</p>
            <p class="player-result"><strong>${player2Name}:</strong> ${player2Result.answer} (${player2Result.isCorrect ? resultTexts[selectedLanguage].correct : resultTexts[selectedLanguage].incorrect})</p>
        `;

        // Aplicar retraso incremental para la animación
        resultItem.style.animationDelay = `${i * 0.2}s`;

        resultItemsContainer.appendChild(resultItem);
    }

    // Mostrar el ganador y los puntos en grande pero inicialmente ocultos
    winnerMessageElement.classList.add('hidden');
    winnerMessageElement.innerHTML = `
        <h2 class="winner-title">${winnerMessage}</h2>
        <p class="score"><strong>${player1Name}:</strong> ${player1Score} ${resultTexts[selectedLanguage].points}</p>
        <p class="score"><strong>${player2Name}:</strong> ${player2Score} ${resultTexts[selectedLanguage].points}</p>
        <p class="congrats-message">${resultTexts[selectedLanguage].congratulations} ${winnerMessage.includes(player1Name) ? player1Name : player2Name}!</p>
    `;

    // Esperar a que el jugador haga clic en cualquier botón
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            // Iniciar la animación eliminando la clase 'hidden'
            document.querySelectorAll('.result-item').forEach(item => {
                item.classList.remove('hidden');
            });
            winnerMessageElement.classList.remove('hidden');
        });
    });
});
