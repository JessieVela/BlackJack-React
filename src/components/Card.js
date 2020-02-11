import React from "react";
import { Image } from "react-bootstrap";
import backCard from "../assets/playingCard_back.png"

export default function Card(props) {
  const imageURL = `https://deckofcardsapi.com/static/img/${props.num}${props.suit}.png`;

  const style = {
    position: "relative",
    float: "left",
    left: `${props.spot * -5}rem`,
    flexWrap: "nowrap",
    marginLeft: "5%"
  };

if (props.index === "Dealer-1" && !props.playerStand) {
  // Gives the dealers second card a unique id to change image to back of card
  return (
    <Image style={style} id={props.index} className="Card-image" src={backCard} />
  );
} else {
  return (
    <Image style={style} id={props.index} className="Card-image" src={imageURL} />
  );
}
}
