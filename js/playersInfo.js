// Variables globales para almacenar los nombres de los jugadores
let player1Name = "Player 1";
let player2Name = "Player 2";

// Función para cambiar los nombres de los jugadores
function changePlayerNames() {
    // Textos para el prompt según el idioma seleccionado
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

    // Obtener los textos según el idioma seleccionado
    const prompts = texts[selectedLanguage] || texts.es; // Usa español por defecto si no se encuentra el idioma

    // Mostrar un pop-up para que el usuario ingrese los nombres
    const newPlayer1Name = prompt(prompts.player1Prompt, player1Name);
    const newPlayer2Name = prompt(prompts.player2Prompt, player2Name);

    // Si los nombres no están vacíos, actualizarlos
    if (newPlayer1Name) {
        player1Name = newPlayer1Name;
    }
    if (newPlayer2Name) {
        player2Name = newPlayer2Name;
    }

    // Mostrar los nuevos nombres en la consola (o hacer cualquier otra cosa con ellos)
    console.log(`Jugador 1: ${player1Name}`);
    console.log(`Jugador 2: ${player2Name}`);
}


