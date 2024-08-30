document.addEventListener('DOMContentLoaded', () => {
    const gameSelect = document.getElementById('game-select');
    const startButton = document.getElementById('start-button');
    const gameSetup = document.getElementById('game-setup');
    const gameArea = document.getElementById('game-area');
    const deckBack = document.getElementById('deck-back');
    const currentCard = document.getElementById('current-card');
    const nextCardButton = document.getElementById('next-card');
    const playCardButton = document.getElementById('play-card');
    const shuffleDeckButton = document.getElementById('shuffle-deck');
    const playArea = document.getElementById('play-area');

    let deck = [];
    let discardPile = [];
    let playedCards = [];

    // Populate game select options
    function populateGameSelect() {
        // This would typically be done by reading the directory structure
        // For this example, we'll hardcode two options
        const options = ['Base Game',];
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.toLowerCase();
            opt.textContent = option.replace('_', ' ');
            gameSelect.appendChild(opt);
        });
    }

    // Initialize deck
    function initializeDeck() {
        // This would typically load images from the directory
        // For this example, we'll simulate 10 cards
        deck = Array.from({length: 104}, (_, i) => `in_the_wild (${i + 1}).png`);
        shuffleDeck();
    }

    // Shuffle deck
    function shuffleDeck() {
        const allCards = [...deck, ...discardPile];
        for (let i = allCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
        }
        deck = allCards;
        discardPile = [];
        currentCard.style.display = 'none';
        deckBack.style.display = 'block';
    }

    // Draw next card
    function drawNextCard() {
        if (deck.length === 0) {
            if (discardPile.length === 0) {
                alert('No more cards to draw!');
                return;
            }
            shuffleDeck();
        }
        const card = deck.pop();
        discardPile.push(card);
        currentCard.src = `assets/cards/in_the_wild/${card}`;
        currentCard.style.display = 'block';
        deckBack.style.display = deck.length > 0 ? 'block' : 'none';
    }

    // Play current card
    function playCard() {
        if (discardPile.length === 0) {
            alert('No card to play!');
            return;
        }
        const card = discardPile.pop();
        playedCards.push(card);
        const cardElement = document.createElement('div');
        cardElement.className = 'played-card';
        cardElement.innerHTML = `
            <img src="assets/cards/in_the_wild/${card}" alt="Played Card">
            <button class="discard-button">Discard</button>
        `;
        cardElement.querySelector('.discard-button').addEventListener('click', () => discardPlayedCard(cardElement, card));
        playArea.appendChild(cardElement);
        currentCard.style.display = 'none';
    }

    // Discard played card
    function discardPlayedCard(element, card) {
        playArea.removeChild(element);
        discardPile.push(card);
        playedCards = playedCards.filter(c => c !== card);
    }

    // Event listeners
    startButton.addEventListener('click', () => {
        if (gameSelect.value) {
            gameSetup.style.display = 'none';
            gameArea.style.display = 'block';
            initializeDeck();
        } else {
            alert('Please select a game first!');
        }
    });

    nextCardButton.addEventListener('click', drawNextCard);
    playCardButton.addEventListener('click', playCard);
    shuffleDeckButton.addEventListener('click', shuffleDeck);

    // Initialize
    populateGameSelect();
});