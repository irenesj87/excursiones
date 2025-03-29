import React from "react";
<<<<<<< HEAD
import { SplitButton, Dropdown, Container, Row, Col } from "react-bootstrap";
=======
import {
	Button,
	SplitButton,
	Dropdown,
	Container,
	Row,
	Col,
} from "react-bootstrap";
>>>>>>> 5525838f8f767505d321a791e1b4940e8dfe9b30
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/LandingPageUserProfile.module.css";
import { logout } from "../slicers/loginSlice";

function LandingPageUserProfile(props) {
	// Variable that we need to be able to use dispatchers
	const logoutDispatch = useDispatch();

	// This useSelector variable has the token that it is saved in the store
	const { token } = useSelector((state) => state.loginReducer);

	// Variable that has the url that is needed for the fetch
	const url = "http://localhost:3001/login";

	// Variable that saves the options that the fetch needs
	const options = {
		method: "DELETE",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	};

	// Function for logging out
	const logOut = () => {
		fetch(url, options)
			.then((resp) => resp.json())
			.then(function (data) {
				// The user logs out...
				logoutDispatch(logout());
				// ...and his/her token is deleted
				delete sessionStorage["token"];
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	return (
		<Container>
			<Row>
				<Col xs="12" md="7" xl="12">
					<SplitButton
						className={styles.userProfile}
						variant="success"
						title={<div>Hola, {props.name}</div>}
					>
<<<<<<< HEAD
						<Dropdown.Item
							className={styles.dropdownText}
							as={Link}
							to="UserPage"
						>
							Tu perfil
						</Dropdown.Item>
						<Dropdown.Divider />
						<Dropdown.Item
							className={styles.dropdownText}
							as={Link}
							to="/"
							onClick={logOut}
						>
							Cerrar sesión
						</Dropdown.Item>
=======
						<Dropdown.ItemText className={styles.dropdownText}>
							<Link
								to="UserPage"
								className={styles.userProfile + " " + styles.black}
							>
								Tu perfil
							</Link>
						</Dropdown.ItemText>
						<Dropdown.Divider />
						<Dropdown.ItemText className={styles.dropdownText}>
							<Button
								className={styles.logoutBtn}
								variant="secondary"
								onClick={logOut}
							>
								Cerrar sesión
							</Button>
						</Dropdown.ItemText>
>>>>>>> 5525838f8f767505d321a791e1b4940e8dfe9b30
					</SplitButton>
				</Col>
			</Row>
		</Container>
	);
}

export default LandingPageUserProfile;
