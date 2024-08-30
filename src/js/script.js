document.addEventListener('DOMContentLoaded', () => {
    const gameSelect = document.getElementById('game-select');
    const startButton = document.getElementById('start-button');
    const gameSetup = document.getElementById('game-setup');
    const gameArea = document.getElementById('game-area');
    const deckBack = document.getElementById('deck-back');
    const currentCard = document.getElementById('current-card');
    const nextCardButton = document.getElementById('next-card');
    const previousCardButton = document.getElementById('previous-card');
    const playCardButton = document.getElementById('play-card');
    const shuffleDeckButton = document.getElementById('shuffle-deck');
    const playArea = document.getElementById('play-area');
    const citiesArea = document.getElementById('cities-area');
    const backToMenuButton = document.getElementById('back-to-menu');
    const helpButton = document.getElementById('help-button');

    helpButton.addEventListener('click', () => {
        window.open('src/html/help.html', '_blank', 'width=400,height=400');
    });

    let deck = [];
    let discardPile = [];
    let playedCards = [];
    let currentGameOption = '';

    const gameOptions = {
        'base_game': { name: 'Base Game', cityCards: 16 },
        'sands_of_al-kalim': { name: 'Sands of Al-Kalim', cityCards: 18 },
        'frozen_waste': { name: 'Frozen Waste', cityCards: 16 }
    };

    // Populate game select options
    function populateGameSelect() {
        Object.values(gameOptions).forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.name.toLowerCase().replace(/ /g, '_');
            opt.textContent = option.name;
            gameSelect.appendChild(opt);
        });
    }

    // Initialize deck
    function initializeDeck() {
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
        displayCurrentCard();
        deckBack.style.display = deck.length > 0 ? 'block' : 'none';
    }

    // Show previous card
    function showPreviousCard() {
        if (discardPile.length > 1) {
            const currentCard = discardPile.pop();
            deck.push(currentCard);
            displayCurrentCard();
        } else {
            alert('No previous card to show!');
        }
    }

    // Display current card
    function displayCurrentCard() {
        if (discardPile.length > 0) {
            const topCard = discardPile[discardPile.length - 1];
            currentCard.src = `assets/cards/in_the_wild/${topCard}`;
            currentCard.style.display = 'block';
        } else {
            currentCard.style.display = 'none';
        }
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
        displayCurrentCard();
    }

    // Discard played card
    function discardPlayedCard(element, card) {
        playArea.removeChild(element);
        discardPile.push(card);
        playedCards = playedCards.filter(c => c !== card);
        displayCurrentCard();
    }

    // Load cities of adventures
    function loadCitiesOfAdventures() {
        const cityCardsCount = gameOptions[currentGameOption].cityCards;
        const citiesCards = Array.from({length: cityCardsCount}, (_, i) => `city_card (${i + 1}).png`);
        citiesArea.innerHTML = '';
        citiesCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'city-card';
            cardElement.innerHTML = `<img src="assets/cards/cities_of_adventures/${currentGameOption}/${card}" alt="City Card">`;
            citiesArea.appendChild(cardElement);
        });
    }

    // Event listeners
    startButton.addEventListener('click', () => {
        if (gameSelect.value) {
            currentGameOption = gameSelect.value;
            gameSetup.style.display = 'none';
            gameArea.style.display = 'block';
            initializeDeck();
            loadCitiesOfAdventures();
        } else {
            alert('Please select a game first!');
        }
    });

    nextCardButton.addEventListener('click', drawNextCard);
    previousCardButton.addEventListener('click', showPreviousCard);
    playCardButton.addEventListener('click', playCard);
    shuffleDeckButton.addEventListener('click', () => {
        shuffleDeck();
        displayCurrentCard();
    });
    backToMenuButton.addEventListener('click', () => {
        const confirmed = confirm("Are you sure you want to go back to the main menu? Your current progress will be lost.");
        if (confirmed) {
            gameArea.style.display = 'none';
            gameSetup.style.display = 'block';
            deck = [];
            discardPile = [];
            playedCards = [];
            playArea.innerHTML = '';
            citiesArea.innerHTML = '';
            currentCard.style.display = 'none';
            deckBack.style.display = 'block';
        }
    });
    

    // Initialize
    populateGameSelect();
});