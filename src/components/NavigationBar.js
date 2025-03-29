import React, { useEffect } from "react";
import { Row, Col, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import Login from "./Login";
import LandingPageUserProfile from "./LandingPageUserProfile";
import { toggleMode, setMode } from "../slicers/themeSlice";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/NavigationBar.module.css";
import "../css/Themes.css";

function NavigationBar(props) {
	const prefersDarkMode =
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches;

	const mode = useSelector((state) => state.themeReducer.mode);
	const dispatch = useDispatch();

	// Variable that says if some user is logged in or not
	const { login: isLoggedIn, user } = useSelector(
		(state) => state.loginReducer
	);

	// Items that are displayed in the nav bar when no user is logged
	const NoLoggedItems = (
		<Container className={styles.noLoggedItems}>
			<Row>
				<Col xs="6">
					<Nav.Item>
						<Nav.Link className="ml-auto" as={Link} to="register">
							Regístrate
						</Nav.Link>
					</Nav.Item>
				</Col>
				<Col xs="6">
					<Nav.Item>
						<Login />
					</Nav.Item>
				</Col>
			</Row>
		</Container>
	);

	// Items that are displayed in the nav bar when an user is logged
	const LoggedItems = (
		<Container className={styles.noLoggedItems}>
			<Nav.Item>
				<LandingPageUserProfile name={user && user.name} />
			</Nav.Item>
		</Container>
	);

	// Code for the dark mode
	useEffect(() => {
		//Removes classes 'light' and 'dark' to ensure there is no conflict
		document.body.classList.remove("light", "dark");
		//Add the class 'mode' to the <body> element
		document.body.classList.add(mode);
	}, [mode]);

	// Functions for the localStorage
	useEffect(() => {
		const savedMode = localStorage.getItem("themeMode"); // Gets the mode from the localStorage
		if (prefersDarkMode) {
			dispatch(setMode("dark"));
		} else if (!prefersDarkMode) {
			dispatch(setMode("light"));
		} else if (savedMode) {
			dispatch(setMode(savedMode)); // Updates the mode with the user preferences
		}
	}, [dispatch, prefersDarkMode]);

	useEffect(() => {
		localStorage.setItem("themeMode", mode); // It updates the mode variable in localStorage
	}, [mode]); // This useEffect will re-run everytime the mode variable changes

	const toggleTheme = () => {
		dispatch(toggleMode()); // Dispatch the toggleMode action for the button
	};

	// Conditional rendering for the icon
	const icon = mode === "light" ? "🌙" : "🌞";

	return (
		<Row className={styles.nav}>
			<Row>
				<Col xs="6" md="2" xl="2">
					<Button
						className="toggleButton"
						variant="light"
						id="toggleButton"
						onClick={toggleTheme}
					>
						{icon}
					</Button>
				</Col>
			</Row>
			<Logo />
			<Col xs="12" md="8">
				<Nav className="justify-content-end">
					<Container>
						<Row>
							<Col xs="12" md="12" xl="8">
								<SearchBar setExcursions={props.setExcursions} />
							</Col>
							<Col xs="12" md="12" xl="4">
								{!isLoggedIn && NoLoggedItems}
								{isLoggedIn && LoggedItems}
							</Col>
						</Row>
					</Container>
				</Nav>
			</Col>
		</Row>
	);
}

export default NavigationBar;
