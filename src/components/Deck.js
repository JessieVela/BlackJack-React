import React, { Component, Fragment } from "react";
import { Button, Col } from "react-bootstrap";
import Card from "./Card";
import { Row } from "react-bootstrap";

const suit = ["H", "C", "D", "S"];
const numFace = {
  11: "J",
  12: "Q",
  13: "K",
  14: "A"
};

export default class Deck extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playerCards: this.newHand(),
      cardSuit: this.genSuitHand(),
      totalScore: 0,
      hiddenCard: 0,
      timerStart: false
    };

    this.timer = null;
  }

  componentDidMount() {
    // Get initial hand total when rendered.
    this.getTotal();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidUpdate(prevProps, prevState) {

    if (prevState.playerCards !== this.state.playerCards) {
      this.getTotal();
    }

    // Resets the game to deal a hand for both players
    if (prevProps.newGame !== this.props.newGame && this.props.newGame === true) {
      this.setState({
        playerCards: this.newHand(),
        cardSuit: this.genSuitHand(),
        totalScore: 0,
      }, () => {
        this.getTotal();
      });
    }

    // Starts the dealer AI when player stands
    if (prevProps.playerStand !== this.props.playerStand && this.props.playerStand === true && this.state.totalScore < 21) {
      this.setState({ timerStart: true });
      this.timer = setInterval(() => {
        if (this.state.totalScore < 17)
          this.hit();
        else if (this.state.totalScore > 21) {
          clearInterval(this.timer);
          this.props.dealerBust();
        }
        else {
          clearInterval(this.timer);
          this.props.dealerStand(this.state.totalScore);
        }
      }, 1000);
    }

    if ((prevState.totalScore !== this.state.totalScore) && (this.state.totalScore > 21 && this.props.player === "Player")) {
      this.props.playerBust();
    }
  }

  genNum = () => {
    let number = Math.floor(Math.random() * 13 + 2);
    //Per API to render a 10 set the number equal to 0
    if (number === 10) return 0;
    //If value is greater than 11 return face card value
    if (number >= 11) return numFace[number];

    return number;
  }

  genSuit = () => {
    return suit[Math.floor(Math.random() * 4)];
  }

  genSuitHand = () => {
    let newSuit = [];
    newSuit.push(suit[Math.floor(Math.random() * 4)]);
    newSuit.push(suit[Math.floor(Math.random() * 4)]);
    return newSuit;
  }

  newHand = () => {
    //Generate two numbers and make sure they are not the same
    let cardNums = [];
    cardNums.push(this.genNum());
    cardNums.push(this.genNum());

    while (cardNums[0] === cardNums[1]) {
      cardNums.pop();
      cardNums.push(this.genNum());
    }
    return cardNums;
  }

  hit = () => {
    this.setState(
      {
        playerCards: [...this.state.playerCards, this.genNum()],
        cardSuit: [...this.state.cardSuit, this.genSuit()]
      });
  }

  getTotal = () => {
    const card = [...this.state.playerCards];

    let total = 0;
    let ace = false;
    let hiddenCardValue = 0;

    for (let i = 0; i < card.length; i++) {

      if ((this.props.player === "Dealer") && (i === 1) && (!this.props.playerStand)) {
        if (!Number.isInteger(card[i])) {
          if (card[i] === 'A') {
            if (ace)
              hiddenCardValue = 1;
            ace = true;
          } else
            hiddenCardValue = this.determineFaceValue(card[i]);
        }
        else if (card[i] === 0)
          hiddenCardValue = 10;
        else {
          hiddenCardValue = card[1];
        }
      }

      if (!Number.isInteger(card[i])) {
        if (card[i] === 'A') {
          if (ace)
            total += 1;
          ace = true;
        } else
          total += this.determineFaceValue(card[i]);
      }
      //API Speical case: 10 are turned into 0, so if a 0 is found add 10
      else if (card[i] === 0)
        total += 10;
      else {
        total += card[i];
      }
    }

    //Calculate the Ace last to see if ace should be 11 or 1
    if (total > 10 && ace) {
      total += 1;
    } else if (total <= 10 && ace) {
      total += 11;
    }
    this.setState({ totalScore: total, hiddenCard: hiddenCardValue });
  }

  determineFaceValue(card) {
    switch (card) {
      case "J":
      case "Q":
      case "K":
        return 10;
      default:
        return 0;
    }
  }

  dealerHit = () => {
    this.timer = setInterval(() => {
      this.hit();

      if (this.state.totalScore >= 17) {
        clearInterval(this.timer);
        this.props.dealerStand(this.state.totalScore);
      }
    }, 1000);
  }

  render() {
    let score = 0;
    if (this.props.player === "Dealer" && !this.props.playerStand)
      score = this.state.totalScore - this.state.hiddenCard;
    else
      score = this.state.totalScore;
    return (
      <Fragment>
        <Row>
          <Col>
            <h3>{this.props.player} Total: {score}</h3>
          </Col>
        </Row>
        <Row className="Deck-row">
        <div className="Card-col">
          {this.state.playerCards.map((card, index) => {
            return (
              <Card
                index={`${this.props.player}-${index}`}
                spot={index}
                key={index}
                num={card}
                suit={this.state.cardSuit[index]}
                playerStand={this.props.playerStand} />
            )
          })}
          </div>
        </Row>
        {((this.props.player === "Player" && this.state.totalScore < 22) && !this.props.deal)
          ?
          <Row>
            <Col className="Deck-buttons sm-col-12">
              <Button className="m-2 btn-lg" onClick={this.hit}>Hit</Button>
              <Button className="m-2 btn-lg" onClick={() => { this.props.playerStand(this.state.totalScore) }}>Stand</Button>
              <Button className="m-2 btn-lg" onClick={() => { this.props.playerFold() }}>Fold</Button>
            </Col>
          </Row>
          : null
        }
      </Fragment>
    );
  }
}