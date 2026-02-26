const container = document.getElementById('game-container');
let players = [];
let currentPlayerIndex = 0;
let guesses = [];
let secretNumber = 0;

document.getElementById('startBtn').addEventListener('click', () => {
  const num = parseInt(document.getElementById('numPlayers').value);
  if (isNaN(num) || num < 2) {
    alert("Veuillez entrer un nombre valide de joueurs (min 2).");
    return;
  }

  // Initialisation des joueurs
  players = [];
  for (let i = 1; i <= num; i++) {
    players.push("Joueur " + i);
  }

  // Démarrage du premier tour
  startNewRound();
});

function startNewRound() {
  guesses = [];
  currentPlayerIndex = 0;
  secretNumber = Math.floor(Math.random() * 10);

  container.innerHTML = '';
  showNextPlayer();
}

function showNextPlayer() {
  container.innerHTML = `
    <h2>${players[currentPlayerIndex]}, entre ton chiffre (0-9)</h2>
    <input type="number" id="playerGuess" min="0" max="9">
    <br>
    <button id="submitBtn">Valider</button>
    <div id="message"></div>
  `;

  document.getElementById('submitBtn').addEventListener('click', () => {
    const guessInput = document.getElementById('playerGuess');
    let guess = parseInt(guessInput.value);
    if (isNaN(guess) || guess < 0 || guess > 9) {
      alert("Entrez un chiffre entre 0 et 9.");
      return;
    }

    guesses.push(guess);
    currentPlayerIndex++;

    if (currentPlayerIndex < players.length) {
      showNextPlayer();
    } else {
      evaluateRound();
    }
  });
}

function evaluateRound() {
  // Calcul des distances
  let distances = guesses.map(g => Math.abs(secretNumber - g));
  let maxDistance = Math.max(...distances);
  
  // Vérifier l'unicité
  let indicesMax = distances.reduce((arr, d, i) => {
    if (d === maxDistance) arr.push(i);
    return arr;
  }, []);

  if (indicesMax.length > 1) {
    // Égalité : manche nulle
    container.innerHTML = `
      <h2>Manche NULLE ! 😅</h2>
      <p>Chiffre secret : ${secretNumber}</p>
      <p>Égalité pour la distance maximale, la manche est rejouée.</p>
    `;
    setTimeout(startNewRound, 2000);
    return;
  }

  // Il y a un gagnant unique
  let winnerIndex = indicesMax[0];
  const winnerName = players[winnerIndex];

  // Retirer le gagnant
  players.splice(winnerIndex, 1);

  // Afficher les résultats
  container.innerHTML = `
    <h2>Résultat du tour</h2>
    <p>Chiffre secret : ${secretNumber}</p>
    <p>Gagnant du tour : ${winnerName}</p>
  `;

  // Vérifier si un perdant final reste
  if (players.length === 1) {
    setTimeout(() => {
      container.innerHTML = `
        <h2>💀 PERDANT FINAL</h2>
        <p>${players[0]}</p>
        <p>Nombre secret du dernier tour : ${secretNumber}</p>
      `;
    }, 2000);
  } else {
    // Recommencer un nouveau tour après 7 secondes
    setTimeout(startNewRound, 7000);
  }
}