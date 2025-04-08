import React, { useEffect } from "react";
import {
	Row,
	Col,
	Nav,
	Container,
	Button,
	Navbar
} from "react-bootstrap";
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
		<>
			<Nav.Link className="ml-auto" as={Link} to="register">
				Regístrate
			</Nav.Link>
			<Login />
		</>
	);

	// Items that are displayed in the nav bar when an user is logged
	const LoggedItems = <LandingPageUserProfile name={user && user.name} />;

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
		<Navbar expand="lg" className={styles.customNavbar} sticky="top">
			<Container fluid>
				{/* --- Elementos Siempre Visibles (Izquierda) --- */}
				{/* Agrupados con d-flex para que estén juntos */}
				<div className="d-flex align-items-center">
					<Button
						className={styles.themeToggleBtn} // Tu clase CSS
						variant="outline-secondary"
						size="lg"
						id="toggleButton"
						onClick={toggleTheme}
					>
						{icon}
					</Button>
					<Navbar.Brand
						as={Link}
						to="/"
						className={`${styles.navbarBrandCustom} ms-2`}
					>
						{" "}
						{/* ms-2 da espacio del botón */}
						<Logo />
					</Navbar.Brand>
				</div>

				{/* --- Botón Hamburguesa (Automático por `expand`) --- */}
				<Navbar.Toggle aria-controls="navbar-content-row" />

				{/* --- Contenido Colapsable --- */}
				<Navbar.Collapse id="navbar-content-row">
                <Row className="w-100 align-items-center mx-0">

                    {/* Columna Espaciadora Izquierda (VISIBLE SOLO EN LG Y MAYORES) */}
                    {/* Empuja las otras columnas hacia la derecha */}
                    <Col lg={2} className="d-none d-lg-block"></Col> {/* lg={1} o lg={2} */}

                    {/* Columna Central: SearchBar */}
                    {/* Reducimos su 'lg' para compensar la columna espaciadora */}
                    <Col xs={12} lg={6} className="my-3 my-lg-0"> {/* Ahora lg={6} (1+6+5 = 12) */}
                        <SearchBar setExcursions={props.setExcursions} />
                    </Col>

                    {/* Columna Derecha: User Actions */}
                    {/* Mantenemos lg={5} o ajustamos si es necesario */}
                    <Col xs={12} lg={4} className="my-3 my-lg-0">
                        <div className="d-flex justify-content-center justify-content-lg-end align-items-center w-100">
                            {!isLoggedIn ? NoLoggedItems : LoggedItems}
                        </div>
                    </Col>
                </Row>
            </Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default NavigationBar;
