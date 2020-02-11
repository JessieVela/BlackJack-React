import React, { } from "react";
import "./App.scss";
import Game from "./components/Game";
import { Container, Row, Col } from "react-bootstrap";

function App() {

	return (
		<div className="App">
			<Container>
				<Row>
					<Col className="App-header">
						<h1>Blackjack</h1>
					</Col>
				</Row>
				<Game />
			</Container>
		</div>
	);
}

export default App;
