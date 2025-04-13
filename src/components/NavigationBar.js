import React, { useState, useEffect } from "react";
import { Nav, Navbar, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import Login from "./Login";
import LandingPageUserProfile from "./LandingPageUserProfile";
import { toggleMode, setMode } from "../slicers/themeSlice";
import { RiMoonClearFill, RiSunFill } from "react-icons/ri";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/NavigationBar.module.css";
import "../css/Themes.css";

function NavigationBar(props) {
	// useState for the collapsible menu
	const [navExpanded, setNavExpanded] = useState(false);
	// Function to close the collapsible menu
	const handleNavCollapse = () => setNavExpanded(false);

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
		<>
			<Nav.Link className="me-3" as={Link} to="/register" onClick={handleNavCollapse}>
				Regístrate
			</Nav.Link>
			<Login onClickCloseCollapsibleLogin={handleNavCollapse} />
		</>
	);

	// Items that are displayed in the nav bar when an user is logged
	const LoggedItems = <LandingPageUserProfile name={user && user.name} onClickCloseCollapsible={handleNavCollapse} />;

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
		if (prefersDarkMode) { // If the user wants dark mode
			dispatch(setMode("dark"));
		} else if (!prefersDarkMode) { // If the user wants light mode
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
	const icon = mode === "light" ? <RiMoonClearFill /> : <RiSunFill />;

	return (
		<Navbar
			collapseOnSelect
			expand="lg"
			className="customNavbar"
			variant={mode}
			sticky="top"
			expanded={navExpanded}
			onToggle={setNavExpanded}
		>
			<Container fluid>
				{/* Grouped with d-flex to be together */}
				<div className="d-flex align-items-center">
					<Button
						className={styles.themeToggleBtn}
						variant="outline-secondary"
						size="lg"
						id="toggleButton"
						onClick={toggleTheme}
					>
						{icon}
					</Button>
					<Navbar.Brand as={Link} to="/" onClick={handleNavCollapse}>
						<Logo />
					</Navbar.Brand>
				</div>

				{/* Hamburguer button (appears in xs, sm and md breakpoints) */}
				<Navbar.Toggle aria-controls="basic-navbar-nav" />

				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="w-100">
						{/* me-auto empuja hacia la izquierda, ms-auto empuja hacia la derecha */}
						{/* d-flex y justify-content-center to center the search bar */}
						<div className="d-flex justify-content-center flex-grow-1 my-3 my-lg-0 px-lg-5">
							<div style={{ maxWidth: "900px", width: "100%" }}>
								<SearchBar setExcursions={props.setExcursions} />
							</div>
						</div>
						<Nav className="ms-auto d-flex flex-row align-items-center">
							{!isLoggedIn ? NoLoggedItems : LoggedItems}
						</Nav>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default NavigationBar;
