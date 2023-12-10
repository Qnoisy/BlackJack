enum Suit {
	CLUBS = "clubs",//трефы
	DIAMONDS = "diamonds",//бубны
	HEARTS = "hearts",//червы
	SPEADES = "speades"//пики
}
enum Rank {
	TWO = "two",
	THREE = "three",
	FOUR = "four",
	FIVE = "five",
	SIX = "six",
	SEVEN = "seven",
	EIGHT = "eight",
	NINE = "nine",
	TEN = "ten",
	JACK = "jack",
	LADY = "lady",
	KING = "king",
	ACE = "ace"
}
class Card {
	constructor(private _rank: Rank, private _suit: Suit) {
	}
	get rank(): Rank {
		return this._rank;
	}
	get suit(): Suit {
		return this._suit;
	}
}
class Deck {
	private cards: Card[] = [];
	constructor() {
		const suits: Suit[] = [
			Suit.CLUBS, Suit.DIAMONDS,
			Suit.HEARTS, Suit.SPEADES
		];
		const ranks: Rank[] = [
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
	getCard = (): Card => {
		const card = this.cards.pop();
		return card === undefined ? new Card(Rank.ACE, Suit.CLUBS) : card;
	}
	showAllCards(): void {
		this.cards.forEach(card => {
			console.log(card.rank + " " + card.suit);
		})
	}
	shuffleDeck(): void {
		this.cards.sort(() => Math.random() - 0.5);
	}
}

class Player {
	private hand: Card[] = [];
	public TakeCard(deck: Deck): boolean {
		this.hand.push(deck.getCard());
		return true;
	}
	public HoldCard(): boolean {
		return false;
	}
	public showHand(): void {
		console.log(this.hand);
	}
	public getHand(): Card[] {
		return this.hand;
	}
}

class Dealer extends Player {
	private deck: Deck;
	constructor() {
		super();
		this.deck = new Deck();
	}
	public getDeck(): Deck {
		return this.deck;
	}
}

class Game {
	private dealer: Dealer;
	private hasAceCard;
	private startGame: boolean;
	private playerPoints: number = 0;
	private dealerPoints: number = 0;
	constructor(cardsDealer: HTMLElement) {
		this.startGame = false;
		this.hasAceCard = false;
		this.dealer = new Dealer();
		this.dealer.TakeCard(this.dealer.getDeck());
		this.renderCard(cardsDealer, this.dealer);
		this.backCard(cardsDealer);
		this.dealer.getDeck().showAllCards();
		this.dealer.showHand();
	}

	public GameTake(player: Player) {
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
	public GameHold() {
		this.hasAceCard = false;
		this.clearEvents();
		return this.engineDealer()
	}

	private engineDealer(): void {
		const interwal = setInterval(() => {
			if (!this.cheakPointsDealer()) {
				clearInterval(interwal);
				this.startGame = false;
				this.renderWinner();
			}
			this.renderCard(cardsDealer, this.dealer);
		}, 1000)
		this.dealer.showHand();
	}

	private cheakPointsPlayer(player: Player): boolean {
		this.playerPoints = this.getPoints(player);
		this.renderPointsPlayer();
		return (this.playerPoints >= 21) ? false : true;
	}
	private cheakPointsDealer(): boolean {
		this.dealerPoints = this.getPoints(this.dealer);
		this.renderPointsDealer();
		return (this.dealerPoints >= 17) ? this.dealer.HoldCard() : this.dealer.TakeCard(this.dealer.getDeck())
	}

	private getPoints(player: Player | Dealer): number {
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
		if (points < 12 && this.hasAceCard) points += 10;
		return points;
	}

	public renderCard(cardPlayer: HTMLElement, player: Dealer | Player): void {
		cardPlayer.innerHTML = '';
		player.getHand().map(card => {
			const newCard = document.createElement("li");
			const span = document.createElement('span');
			switch (card.suit) {
				case Suit.HEARTS:
					newCard.classList.add("card", "card__red");
					span.append(`${card.rank}♥`)
					break;
				case Suit.DIAMONDS:
					newCard.classList.add("card", "card__red");
					span.append(`${card.rank}♦`)
					break;
				case Suit.CLUBS:
					newCard.classList.add("card", "card__black");
					span.append(`${card.rank}♣`)
					break;
				case Suit.SPEADES:
					newCard.classList.add("card", "card__black");
					span.append(`${card.rank}♠`)
					break;
			}
			newCard.append(span);
			cardPlayer.append(newCard);
		});
	}

	private backCard(cardsDealer: HTMLElement): void {
		const div = document.createElement("li");
		div.classList.add("card", "card__back", "scale-in-hor-center");
		cardsDealer.append(div);
	}

	private renderWinner(): void {
		if (this.dealerPoints > 21) this.dealerPoints = 0;
		if (this.playerPoints > 21) this.playerPoints = 0;
		(this.dealerPoints > this.playerPoints) ? win.innerText = "Winner: Dealer" : (this.dealerPoints < this.playerPoints) ? win.innerText = "Winner: Player" : win.innerText = "Winner: Draw";
	}

	private renderPointsDealer = (): void => { dealerPointsSpan.innerText = `Dealer: ${this.dealerPoints}`; }
	private renderPointsPlayer = (): void => { playerPointsSpan.innerText = `Player: ${this.playerPoints}`; }

	private clearEvents(): void {
		take.removeEventListener("click", Take);
		hold.removeEventListener("click", Hold);
	}
}

const take = document.getElementById("take") as HTMLElement;
const hold = document.getElementById("hold") as HTMLElement;
const dealerPointsSpan = document.getElementById("dealerpoints") as HTMLElement;
const playerPointsSpan = document.getElementById("playerpoints") as HTMLElement;
const cardsDealer = document.getElementById("cardsDealer") as HTMLElement;
const cardsPlayer = document.getElementById("cardsPlayer") as HTMLElement;
const win = document.getElementById("whoWin") as HTMLElement;

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