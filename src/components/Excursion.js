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
				// Authorization: It is the HTTP header standard name to send authentication credentials to the server
				/* Bearer: A string that represents the very common authentication schema in the OAuth 2.0 (RFC 6750) standard. 
				It indicates that the type of credential being attached is a 'bearer token'. This means that whoever'bears' this token 
				is considered authorized to access the resources or perform the actions associated with that token, 
				without needing additional proof such as cryptographic signatures on each request (although the token itself is usually 
				signed or encrypted to ensure its integrity and authenticity). 
				The space after Bearer is part of the standard format. The structure is Authorization: <scheme> <credential>.
				The Authorization: Bearer <token> header is used to demonstrate that you are already authenticated when you perform 
				actions after having logged in. In contrast, the login process (in LoginForm.js, which calls userLogin in helpers.js) 
				is precisely the moment when you obtain that token for the first time. */
				Authorization: "Bearer " + window.sessionStorage["token"],
			},
			// body: It is a standard property within the fetch options. It defines the content to send in the body of the HTTP request.
			/* The id is sent to know what is the specific excursion that the user is going to go.
			   So, this line is preparing the data that will be send to the server when the user clicks in "Apuntarse" */
			body: JSON.stringify({ id: props.id }),
		};

		try {
			// Variable that saves the response of the fetch. Waits for the server response
			const response = await fetch(url, options);
			// If there is an error
			if (response.status === 401) {
				throw new Error("No estás autorizado/a para hacer esta operación");
			} else {
				// This turns the JSON response to a JavaScript object
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
				className="mt-4 w-100"
				variant="success"
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
			<h5 className="mt-4 text-uppercase text-success w-100">
				<strong>Apuntado/a</strong>
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
			<Row className="justify-content-center">
				<Col xs="12" md="5" lg="4" xl="2" className="text-center">
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
