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

  players = [];
  for (let i = 1; i <= num; i++) {
    players.push("Joueur " + i);
  }

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
    <input type="number" id="playerGuess" min="0" max="9" autofocus>
    <br>
    <button id="submitBtn">Valider</button>
    <div id="message"></div>
  `;

  const guessInput = document.getElementById('playerGuess');
  guessInput.focus();

  document.getElementById('submitBtn').addEventListener('click', () => {
    let guess = parseInt(guessInput.value);
    if (isNaN(guess) || guess < 0 || guess > 9) {
      alert("Entrez un chiffre entre 0 et 9.");
      return;
    }

    guesses.push(guess); // On enregistre le choix mais on ne l'affiche pas
    currentPlayerIndex++;

    if (currentPlayerIndex < players.length) {
      showNextPlayer();
    } else {
      evaluateRound();
    }
  });
}

function evaluateRound() {
  let distances = guesses.map(g => Math.abs(secretNumber - g));
  let maxDistance = Math.max(...distances);
  let indicesMax = distances.reduce((arr, d, i) => {
    if (d === maxDistance) arr.push(i);
    return arr;
  }, []);

  if (indicesMax.length > 1) {
    // Manche nulle
    container.innerHTML = `
      <h2>⚠️ Manche NULLE !</h2>
      <p>Chiffre secret : ${secretNumber}</p>
      <p>Égalité pour la distance maximale, la manche est rejouée...</p>
    `;
    setTimeout(startNewRound, 2000);
    return;
  }

  let winnerIndex = indicesMax[0];
  const winnerName = players[winnerIndex];
  players.splice(winnerIndex, 1);

  container.innerHTML = `
    <h2>Résultat du tour</h2>
    <p>Chiffre secret : ${secretNumber}</p>
    <p>Gagnant du tour : ${winnerName}</p>
  `;

  if (players.length === 1) {
    setTimeout(() => {
      container.innerHTML = `
        <h2>💀 PERDANT FINAL</h2>
        <p>${players[0]}</p>
        <p>Nombre secret du dernier tour : ${secretNumber}</p>
      `;
    }, 2000);
  } else {
    setTimeout(startNewRound, 2000);
  }
}
