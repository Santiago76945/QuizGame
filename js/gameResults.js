document.addEventListener('DOMContentLoaded', () => {
    const player1Results = JSON.parse(localStorage.getItem('player1Results')) || [];
    const player2Results = JSON.parse(localStorage.getItem('player2Results')) || [];
    const winnerMessage = localStorage.getItem('winnerMessage') || '';

    const resultItemsContainer = document.getElementById('result-items');
    const winnerMessageElement = document.getElementById('winner-message');

    player1Results.forEach((result, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <p>Ronda ${index + 1}</p>
            <p>Jugador 1: ${result.answer} (${result.isCorrect ? 'Correcto' : 'Incorrecto'})</p>
            <p>Jugador 2: ${player2Results[index].answer} (${player2Results[index].isCorrect ? 'Correcto' : 'Incorrecto'})</p>
        `;
        resultItemsContainer.appendChild(resultItem);
    });

    winnerMessageElement.textContent = winnerMessage;
});
