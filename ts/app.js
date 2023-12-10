"use strict";
var Suit;
(function (Suit) {
    Suit["CLUBS"] = "clubs";
    Suit["DIAMONDS"] = "diamonds";
    Suit["HEARTS"] = "hearts";
    Suit["SPEADES"] = "speades"; //пики
})(Suit || (Suit = {}));
var Rank;
(function (Rank) {
    Rank["TWO"] = "two";
    Rank["THREE"] = "three";
    Rank["FOUR"] = "four";
    Rank["FIVE"] = "five";
    Rank["SIX"] = "six";
    Rank["SEVEN"] = "seven";
    Rank["EIGHT"] = "eight";
    Rank["NINE"] = "nine";
    Rank["TEN"] = "ten";
    Rank["JACK"] = "jack";
    Rank["LADY"] = "lady";
    Rank["KING"] = "king";
    Rank["ACE"] = "ace";
})(Rank || (Rank = {}));
class Card {
    constructor(_rank, _suit) {
        this._rank = _rank;
        this._suit = _suit;
    }
    get rank() {
        return this._rank;
    }
    get suit() {
        return this._suit;
    }
}
class Deck {
    constructor() {
        this.cards = [];
        this.getCard = () => {
            const card = this.cards.pop();
            return card === undefined ? new Card(Rank.ACE, Suit.CLUBS) : card;
        };
        const suits = [
            Suit.CLUBS, Suit.DIAMONDS,
            Suit.HEARTS, Suit.SPEADES
        ];
        const ranks = [
            Rank.TWO, Rank.THREE, Rank.FOUR, Rank.FIVE,
            Rank.SIX, Rank.SEVEN, Rank.EIGHT, Rank.NINE,
            Rank.TEN, Rank.JACK, Rank.LADY, Rank.KING, Rank.ACE
        ];
        for (const suit of suits) {
            for (const rank of ranks) {
                this.cards.push(new Card(rank, suit));
            }
        }
        this.shuffleDeck();
    }
    showAllCards() {
        this.cards.forEach(card => {
            console.log(card.rank + " " + card.suit);
        });
    }
    shuffleDeck() {
        this.cards.sort(() => Math.random() - 0.5);
    }
}
class Player {
    constructor() {
        this.hand = [];
    }
    TakeCard(deck) {
        this.hand.push(deck.getCard());
        return true;
    }
    HoldCard() {
        return false;
    }
    showHand() {
        console.log(this.hand);
    }
    getHand() {
        return this.hand;
    }
}
class Dealer extends Player {
    constructor() {
        super();
        this.deck = new Deck();
    }
    getDeck() {
        return this.deck;
    }
}
class Game {
    constructor(cardsDealer) {
        this.playerPoints = 0;
        this.dealerPoints = 0;
        this.renderPointsDealer = () => { dealerPointsSpan.innerText = `Dealer: ${this.dealerPoints}`; };
        this.renderPointsPlayer = () => { playerPointsSpan.innerText = `Player: ${this.playerPoints}`; };
        this.startGame = false;
        this.hasAceCard = false;
        this.dealer = new Dealer();
        this.dealer.TakeCard(this.dealer.getDeck());
        this.renderCard(cardsDealer, this.dealer);
        this.backCard(cardsDealer);
        this.dealer.getDeck().showAllCards();
        this.dealer.showHand();
    }
    GameTake(player) {
        if (this.startGame) {
            this.clearEvents();
        }
        player.TakeCard(this.dealer.getDeck());
        this.renderCard(cardsPlayer, player);
        if (!this.cheakPointsPlayer(player)) {
            this.hasAceCard = false;
            this.clearEvents();
            this.engineDealer();
        }
    }
    GameHold() {
        this.hasAceCard = false;
        this.clearEvents();
        return this.engineDealer();
    }
    engineDealer() {
        const interwal = setInterval(() => {
            if (!this.cheakPointsDealer()) {
                clearInterval(interwal);
                this.startGame = false;
                this.renderWinner();
            }
            this.renderCard(cardsDealer, this.dealer);
        }, 1000);
        this.dealer.showHand();
    }
    cheakPointsPlayer(player) {
        this.playerPoints = this.getPoints(player);
        this.renderPointsPlayer();
        return (this.playerPoints >= 21) ? false : true;
    }
    cheakPointsDealer() {
        this.dealerPoints = this.getPoints(this.dealer);
        this.renderPointsDealer();
        return (this.dealerPoints >= 17) ? this.dealer.HoldCard() : this.dealer.TakeCard(this.dealer.getDeck());
    }
    getPoints(player) {
        let points = 0;
        player.getHand().forEach((card) => {
            switch (card.rank) {
                case Rank.TWO:
                    points += 2;
                    break;
                case Rank.THREE:
                    points += 3;
                    break;
                case Rank.FOUR:
                    points += 4;
                    break;
                case Rank.FIVE:
                    points += 5;
                    break;
                case Rank.SIX:
                    points += 6;
                    break;
                case Rank.SEVEN:
                    points += 7;
                    break;
                case Rank.EIGHT:
                    points += 8;
                    break;
                case Rank.NINE:
                    points += 9;
                    break;
                case Rank.TEN:
                case Rank.JACK:
                case Rank.LADY:
                case Rank.KING:
                    points += 10;
                    break;
                case Rank.ACE:
                    this.hasAceCard = true;
                    points += 1;
                    break;
            }
        });
        if (points < 12 && this.hasAceCard)
            points += 10;
        return points;
    }
    renderCard(cardPlayer, player) {
        cardPlayer.innerHTML = '';
        player.getHand().map(card => {
            const newCard = document.createElement("li");
            const span = document.createElement('span');
            switch (card.suit) {
                case Suit.HEARTS:
                    newCard.classList.add("card", "card__red");
                    span.append(`${card.rank}♥`);
                    break;
                case Suit.DIAMONDS:
                    newCard.classList.add("card", "card__red");
                    span.append(`${card.rank}♦`);
                    break;
                case Suit.CLUBS:
                    newCard.classList.add("card", "card__black");
                    span.append(`${card.rank}♣`);
                    break;
                case Suit.SPEADES:
                    newCard.classList.add("card", "card__black");
                    span.append(`${card.rank}♠`);
                    break;
            }
            newCard.append(span);
            cardPlayer.append(newCard);
        });
    }
    backCard(cardsDealer) {
        const div = document.createElement("li");
        div.classList.add("card", "card__back", "scale-in-hor-center");
        cardsDealer.append(div);
    }
    renderWinner() {
        if (this.dealerPoints > 21)
            this.dealerPoints = 0;
        if (this.playerPoints > 21)
            this.playerPoints = 0;
        (this.dealerPoints > this.playerPoints) ? win.innerText = "Winner: Dealer" : (this.dealerPoints < this.playerPoints) ? win.innerText = "Winner: Player" : win.innerText = "Winner: Draw";
    }
    clearEvents() {
        take.removeEventListener("click", Take);
        hold.removeEventListener("click", Hold);
    }
}
const take = document.getElementById("take");
const hold = document.getElementById("hold");
const dealerPointsSpan = document.getElementById("dealerpoints");
const playerPointsSpan = document.getElementById("playerpoints");
const cardsDealer = document.getElementById("cardsDealer");
const cardsPlayer = document.getElementById("cardsPlayer");
const win = document.getElementById("whoWin");
const game = new Game(cardsDealer);
const player = new Player();
function Take() {
    game.GameTake(player);
}
function Hold() {
    game.GameHold();
}
take.addEventListener("click", Take);
hold.addEventListener("click", Hold);
