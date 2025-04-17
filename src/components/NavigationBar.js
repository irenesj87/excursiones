import React, { useState, useEffect } from "react";
import { Nav, Navbar, Container, Button, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import LandingPageUserProfile from "./LandingPageUserProfile";
import { toggleMode, setMode } from "../slicers/themeSlice";
import { RiMoonClearFill, RiSunFill } from "react-icons/ri";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/NavigationBar.module.css";
import "../css/Themes.css";

function NavigationBar(props) {
	// Estado de la visibilidad del Offcanvas
	const [showOffcanvas, setShowOffcanvas] = useState(false);
	// Función para cerrar el Offcanvas
	const handleCloseOffcanvas = () => setShowOffcanvas(false);
	// Función para abrir el Offcanvas
	const handleShowOffcanvas = () => setShowOffcanvas(true);

	const prefersDarkMode =
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches;

	const mode = useSelector((state) => state.themeReducer.mode);
	const dispatch = useDispatch();

	// Variable que dice si hay un usuario logueado o no
	const { login: isLoggedIn, user } = useSelector(
		(state) => state.loginReducer
	);

	// Código para el modo oscuro
	useEffect(() => {
		//Removes classes 'light' and 'dark' to ensure there is no conflict
		document.body.classList.remove("light", "dark");
		//Add the class 'mode' to the <body> element
		document.body.classList.add(mode);
	}, [mode]);

	// Funciones para el localStorage
	useEffect(() => {
		const savedMode = localStorage.getItem("themeMode"); // Gets the mode from the localStorage
		if (prefersDarkMode) {
			// If the user wants dark mode
			dispatch(setMode("dark"));
		} else if (!prefersDarkMode) {
			// If the user wants light mode
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

	// Items that are displayed in the nav bar when no user is logged
	const NoLoggedItems = (
		<>
			<Nav.Link
				className="me-3"
				as={Link}
				to="/register"
				onClick={handleCloseOffcanvas}
			>
				Regístrate
			</Nav.Link>
			<Nav.Link
				className="ms-lg-2"
				as={Link}
				to="/loginPage"
				onClick={handleCloseOffcanvas}
			>
				Inicia sesión
			</Nav.Link>
		</>
	);

	// Items that are displayed in the nav bar when an user is logged
	const LoggedItems = (
		<LandingPageUserProfile
			name={user?.name}
			onClickCloseCollapsible={handleCloseOffcanvas}
		/>
	);

	return (
		<Navbar expand="lg" className="customNavbar" variant={mode} sticky="top">
			<Container fluid>
				{/* Grouped with d-flex to be together */}
				<div className="d-flex flex-wrap align-items-center">
					<Navbar.Brand as={Link} to="/" onClick={handleCloseOffcanvas}>
						<Logo />
					</Navbar.Brand>
				</div>

				{/* Search Bar - Centered on large screens */}
				<div className="d-none d-md-flex justify-content-center flex-grow-1 px-md-3 px-lg-5 order-md-2 order-lg-2 me-md-3">
					<div style={{ maxWidth: "900px", width: "100%" }}>
						<SearchBar
							setExcursions={props.setExcursions}
							id="searchBar-md-lg"
						/>
					</div>
				</div>

				{/* --- Right side container --- */}
				{/* Use ms-auto to push this whole group to the right */}
				{/* Use order-lg-3 to place it correctly on large screens */}
				<div className="d-flex align-items-center ms-auto ms-md-0 order-md-3 order-lg-3">
					{/* Theme Toggle Button - Always visible */}
					<Button
						className={`${styles.themeToggleBtn} me-2`} // Spacing between theme and toggle/nav items
						variant="outline-secondary"
						id="toggleButton"
						onClick={toggleTheme}
					>
						{icon}
					</Button>

					{/* Inline Nav items for large screens (lg and up) */}
					{/* Hidden on small screens (d-none), shown on large (d-lg-flex) */}
					{/* Placed before the toggle for visual order on large screens */}
					<Nav className="d-none d-lg-flex flex-row align-items-center">
						{isLoggedIn ? LoggedItems : NoLoggedItems}
					</Nav>

					{/* Offcanvas Toggle (Hamburger) */}
					{/* Visible only on smaller screens (default Bootstrap behavior) */}
					{/* Needs ms-lg-2 if LoggedItems are present to add space */}
					<Navbar.Toggle
						aria-controls="offcanvasNavbar"
						onClick={handleShowOffcanvas}
						className="d-lg-none"
					/>
				</div>
				{/* Search Bar (Small Screens Only - Full Width Below) */}
				{/* order-last ensures it's visually last in the flex container */}
				{/* w-100 makes it full width */}
				{/* mt-2 adds margin top */}
				<div className="d-md-none w-100 mt-2 order-last">
					<SearchBar setExcursions={props.setExcursions} id="searchBar-sm" />
				</div>
				{/* --- End Right side container --- */}

				{/* --- Offcanvas Component --- */}
				<Offcanvas
					show={showOffcanvas}
					onHide={handleCloseOffcanvas}
					placement="end"
					id="offcanvasNavbar"
					scroll={true}
					backdrop={true}
				>
					<Offcanvas.Header closeButton>
						<Offcanvas.Title>Menú</Offcanvas.Title>
					</Offcanvas.Header>
					<Offcanvas.Body>
						{/* Navigation links */}
						<Nav className="d-flex flex-column">
							{isLoggedIn ? LoggedItems : NoLoggedItems}
						</Nav>
					</Offcanvas.Body>
				</Offcanvas>
			</Container>
		</Navbar>
	);
}

export default NavigationBar;
