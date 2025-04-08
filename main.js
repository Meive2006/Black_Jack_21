let deck = [];
let playerHand = [];
let dealerHand = [];
let playerPoints = 0;
let dealerPoints = 0;

const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];


const playerCardsDiv = document.getElementById('player-cards');
const dealerCardsDiv = document.getElementById('dealer-cards');
const playerPointsSpan = document.getElementById('player-points');
const dealerPointsSpan = document.getElementById('dealer-points');
const gameResult = document.getElementById('game-result');

const hitButton = document.getElementById('hit');
const standButton = document.getElementById('stand');
const newGameButton = document.getElementById('new-game');

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
    deck = shuffle(deck);
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function getCardValue(card) {
    if (card.value === 'A') return 11;
    if (['K', 'Q', 'J'].includes(card.value)) return 10;
    return parseInt(card.value);
}

function calculatePoints(hand) {
    let points = hand.reduce((sum, card) => sum + getCardValue(card), 0);
    let aceCount = hand.filter(card => card.value === 'A').length;

    while (points > 21 && aceCount > 0) {
        points -= 10;
        aceCount--;
    }

    return points;
}

function displayCards(revealDealer = false) {
    playerCardsDiv.innerHTML = playerHand.map(card => `${card.value}${card.suit}`).join(' ');

    if (!revealDealer) {
        dealerCardsDiv.innerHTML = `${dealerHand[0].value}${dealerHand[0].suit} 🂠`;
        dealerPointsSpan.textContent = '?';
    } else {
        dealerCardsDiv.innerHTML = dealerHand.map(card => `${card.value}${card.suit}`).join(' ');
        dealerPointsSpan.textContent = dealerPoints;
    }

    playerPointsSpan.textContent = playerPoints;
}

function updateGameResult(result) {
    gameResult.textContent = result;
}

function startNewGame() {
    playerHand = [];
    dealerHand = [];
    createDeck();

    playerHand.push(deck.pop(), deck.pop());
    dealerHand.push(deck.pop(), deck.pop());

    playerPoints = calculatePoints(playerHand);
    dealerPoints = calculatePoints(dealerHand);

    displayCards();
    updateGameResult('');
}

function hit() {
    playerHand.push(deck.pop());
    playerPoints = calculatePoints(playerHand);
    displayCards();

    if (playerPoints > 21) {
        displayCards(true);
        updateGameResult('Você perdeu! Sua pontuação excedeu 21.');
        disableButtons();
    }
}

function stand() {
    while (dealerPoints < 17) {
        dealerHand.push(deck.pop());
        dealerPoints = calculatePoints(dealerHand); 
    }
  
    displayCards(true);
  
    if (dealerPoints > 21) {
        updateGameResult('O dealer perdeu! Ele excedeu 21.');
    } else if (playerPoints > dealerPoints) {
        updateGameResult('Você venceu!');
    } else if (playerPoints < dealerPoints) {
        updateGameResult('Você perdeu! O dealer venceu.');
    } else {
        updateGameResult('Empate!');
    }
    disableButtons();
}

function disableButtons() {
    hitButton.disabled = true;
    standButton.disabled = true;
}

hitButton.addEventListener('click', hit);
standButton.addEventListener('click', stand);
newGameButton.addEventListener('click', () => {
    startNewGame();
    hitButton.disabled = false;
    standButton.disabled = false;
});

startNewGame();
