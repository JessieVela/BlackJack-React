import React, { Component, Fragment } from 'react'
import { Container, Row, Col, Button } from "react-bootstrap";
import Deck from "./Deck";


export default class Game extends Component {

  static defaultProps = {
    hidden: "invisible",
  }

  constructor(props) {
    super(props);

    this.state = {
      newGame: false,
      playerStand: false,
      dealerStand: false,
      playerScore: 0,
      dealerScore: 0,
      playerBust: false,
      dealerBust: false,
      status: null,
      deal: false
    };
  }

  playerBust = () => {
    this.setState({ playerBust: true, newGame: false, deal: true, status: "Player Bust! Dealer Wins" });
  }

  dealerBust = () => {
    this.setState({ dealerBust: true, newGame: false, deal: true, status: "Dealer Bust! You Win." });
  }

  newGame = () => {
    this.setState({
      newGame: true,
      playerStand: false,
      dealerStand: false,
      playerScore: 0,
      dealerScore: 0,
      playerBust: false,
      dealerBust: false,
      status: null,
      deal: false
    }, () => {
      this.setState({ newGame: false });
    });
  }

  playerFold = () => {
    this.newGame();
  }

  playerStand = (playerScore) => {
    this.setState({ playerStand: true, playerScore: playerScore });
  }

  dealerStand = (dealerScore) => {
    this.setState({ dealerStand: true, dealerScore: dealerScore, deal: true }, () => {
      this.setState({ status: this.determinWinner() });
    });
  }

  determinWinner() {
    let winner = null;
    if (this.state.playerScore === this.state.dealerScore)
      winner = "Push"
    else if (this.state.playerScore > this.state.dealerScore)
      winner = "Player Wins!"
    else
      winner = "Dealer Wins!"

    return winner;
  }

  render() {
    return (
      <Fragment>
        <Deck
          player={"Dealer"}
          playerStand={this.state.playerStand}
          dealerStand={this.dealerStand}
          dealerBust={this.dealerBust}
          newGame={this.state.newGame}
        />
        <Row>
          <Col>
            <p className="dealer-stand">Dealer Stands at 17</p>
          </Col>
        </Row>
        <Row className="justify-content-center">
            <h3 className={this.state.status ? "alert-success" : "invisible"}>{this.state.status}&nbsp;</h3>
        </Row>
        <Deck
          player={"Player"}
          playerBust={this.playerBust}
          newGame={this.state.newGame}
          playerStand={this.playerStand}
          dealerBust={this.dealerBust}
          deal={this.state.deal}
          playerFold={this.playerFold}
        />

        {this.state.playerBust || this.state.dealerBust || this.state.deal
          ? <Button className="btn-lg" onClick={this.newGame}>Deal</Button>
          : null}
      </Fragment>
    );
  }
}
