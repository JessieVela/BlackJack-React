import React from "react";
import "./Card.css";
import { Image } from "react-bootstrap";
import backCard from "../assets/playingCard_back.png"

export default function Card(props) {
  const imageURL = `https://deckofcardsapi.com/static/img/${props.num}${props.suit}.png`;

  if (props.index === "Dealer-1" && !props.playerStand)
    return <Image id={props.index} className="Card-image m-2" src={backCard} />;
  else
    return <Image id={props.index} className="Card-image m-2" src={imageURL} />;
}
