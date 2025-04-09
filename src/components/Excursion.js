import React from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../slicers/loginSlice";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Excursion.module.css";

function Excursion(props) {
	// This useSelector says if a user is logged in or not and it gives us the user info too
	const { login: isLoggedIn, user } = useSelector(
		(state) => state.loginReducer
	);

	// Variable that we need to be able to use dispatchers
	const loginDispatch = useDispatch();

	// Variable that saves the mail of the current user
	const auxUserMail = user && user.mail;

	// Variable that has the url that is needed for the fetch
	const url = `http://localhost:3001/users/${auxUserMail}/excursions/${props.id}`;

	// This function sign ups a logged user in the excursion he/she wants
	const joinExcursion = async () => {
		// Variable that saves the options that the fetch needs
		const options = {
			method: "PUT",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + window.sessionStorage["token"],
			},
			body: JSON.stringify({ id: props.id }),
		};

		try {
			const response = await fetch(url, options);
			if (response.status === 401) {
				throw new Error("No estás autorizado/a para hacer esta operación");
			} else {
				const data = await response.json();
				loginDispatch(
					updateUser({
						user: data,
					})
				);
			}
		} catch (error) {
			console.log(error);
		}
	};

	// Variable that has the button that appears when the user isn´t still signed up in that excursion in concrete
	const BtnJoiningNojoined = (
		<>
			<Button
				className="w-100 mt-4"
				type="button"
				onClick={joinExcursion}
			>
				Apuntarse
			</Button>
		</>
	);

	// Variable that has the button that appears when the user is signed up in that excursion in concrete
	const BtnAlreadyJoined = (
		<>
			<h5 className="mt-4 text-uppercase text-success">
				<strong>Te has apuntado</strong>
			</h5>
		</>
	);

	return (
		<Container className={styles.excursion}>
			<Row>
				<Col>
					<div className={styles.title}>{props.name}</div>
				</Col>
			</Row>
			<Row>
				<Col>
					<div className={styles.bold}>Zona:</div> {props.area}
				</Col>
			</Row>
			<Row>
				<Col>
					<div className={styles.bold}>Dificultad:</div> {props.difficulty}
				</Col>
			</Row>
			<Row>
				<Col>
					<div className={styles.bold}>Tiempo estimado:</div> {props.time}
				</Col>
			</Row>
			<Row>
				<Col>
					<div className={styles.bold}>Descripción:</div> {props.description}
				</Col>
			</Row>
			<Row>
				<Col xs="12" md="3">
					{isLoggedIn &&
						user &&
						!user.excursions.includes(props.id) &&
						BtnJoiningNojoined}
					{isLoggedIn &&
						user &&
						user.excursions.includes(props.id) &&
						BtnAlreadyJoined}
				</Col>
			</Row>
		</Container>
	);
}

export default Excursion;
