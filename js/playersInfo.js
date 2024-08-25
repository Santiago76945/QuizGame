//playersInfo.js

// Variables globales para almacenar los nombres de los jugadores
export let player1Name = localStorage.getItem('player1Name') || "Player 1";
export let player2Name = localStorage.getItem('player2Name') || "Player 2";

// Función para cambiar los nombres de los jugadores
export function changePlayerNames() {
    const texts = {
        es: {
            player1Prompt: "Ingrese el nombre para el Jugador 1:",
            player2Prompt: "Ingrese el nombre para el Jugador 2:",
        },
        en: {
            player1Prompt: "Enter the name for Player 1:",
            player2Prompt: "Enter the name for Player 2:",
        }
    };

    const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    const prompts = texts[selectedLanguage] || texts.es;

    const newPlayer1Name = prompt(prompts.player1Prompt, player1Name);
    const newPlayer2Name = prompt(prompts.player2Prompt, player2Name);

    if (newPlayer1Name) {
        player1Name = newPlayer1Name;
        localStorage.setItem('player1Name', player1Name);  // Guardar en localStorage
    }
    if (newPlayer2Name) {
        player2Name = newPlayer2Name;
        localStorage.setItem('player2Name', player2Name);  // Guardar en localStorage
    }

    console.log(`Jugador 1: ${player1Name}`);
    console.log(`Jugador 2: ${player2Name}`);
}

// Función para establecer los nombres de los jugadores en el DOM
export function setPlayerNames() {
    const player1NameElement = document.getElementById('player1-name');
    const player2NameElement = document.getElementById('player2-name');

    // Actualizar los nombres en la interfaz
    player1NameElement.textContent = player1Name;
    player2NameElement.textContent = player2Name;

    console.log('Nombres de jugadores establecidos en el DOM.');
}



