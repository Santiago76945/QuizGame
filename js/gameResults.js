//gameResults.js

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
    },
    en: {
        backButton: '← Main Menu',
        resultsTitle: 'Final Results',
        round: 'Round',
        correct: 'Correct',
        incorrect: 'Incorrect',
        points: 'points',
        congratulations: 'Congratulations',
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

    player1Results.forEach((result, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <p>${resultTexts[selectedLanguage].round} ${index + 1}</p>
            <p>${player1Name}: ${result.answer} (${result.isCorrect ? resultTexts[selectedLanguage].correct : resultTexts[selectedLanguage].incorrect})</p>
            <p>${player2Name}: ${player2Results[index]?.answer || 'No respondido'} (${player2Results[index]?.isCorrect ? resultTexts[selectedLanguage].correct : resultTexts[selectedLanguage].incorrect})</p>
        `;
        resultItemsContainer.appendChild(resultItem);
    });

    // Mostrar el ganador y los puntos en grande
    winnerMessageElement.innerHTML = `
        <h2>${winnerMessage}</h2>
        <p>${player1Name}: ${player1Score} ${resultTexts[selectedLanguage].points}</p>
        <p>${player2Name}: ${player2Score} ${resultTexts[selectedLanguage].points}</p>
        <p>${resultTexts[selectedLanguage].congratulations} ${winnerMessage.includes(player1Name) ? player1Name : player2Name}!</p>
    `;
});

