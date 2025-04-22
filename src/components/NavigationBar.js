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
	// Variable que guarda si el usuario prefiere el modo oscuro, tanto en su sistema operativo como en su navegador
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
		// .classList: Es una propiedad de HTML que da acceso a las clases aplicadas a un elemento (en este caso body)
		/* Lo que hace esta línea es asegurarse de que la etiqueta <body> no tiene las clases 'light' y 'dark' aplicadas
		 antes que el código añada la correcta basada en 'mode' */
		document.body.classList.remove("light", "dark");
		// Añade la clase 'mode' a <body>
		document.body.classList.add(mode);
	}, [mode]);

	// Funciones para el localStorage
	useEffect(() => {
		const savedMode = localStorage.getItem("themeMode");
		if (prefersDarkMode) {
			// Si el usuario quiere el modo oscuro
			dispatch(setMode("dark"));
		} else if (!prefersDarkMode) {
			// Si el usuario prefiere el modo claro
			dispatch(setMode("light"));
		} else if (savedMode) {
			// Actualiza el modo según las preferencias del usuario
			dispatch(setMode(savedMode));
		}
	}, [dispatch, prefersDarkMode]);

	useEffect(() => {
		localStorage.setItem("themeMode", mode); // Actualiza la variable 'mode' en localStorage
	}, [mode]); // Este useEffect se ejecutará cada vez que la variable 'mode' cambie

	const toggleTheme = () => {
		dispatch(toggleMode());
	};

	// Renderizado condicional para el icono
	const icon = mode === "light" ? <RiMoonClearFill /> : <RiSunFill />;

	// Items que están en la barra de navegación cuando el usuario no está logueado
	const NoLoggedItems = (
		<>
			<Nav.Link
				className="me-2"
				as={Link}
				to="/registerPage"
				onClick={handleCloseOffcanvas}
			>
				Regístrate
			</Nav.Link>
			<Nav.Link as={Link} to="/loginPage" onClick={handleCloseOffcanvas}>
				Inicia sesión
			</Nav.Link>
		</>
	);

	// Items que están en la barra de navegación cuando el usuario está logueado
	const LoggedItems = (
		<LandingPageUserProfile
			name={user?.name}
			onClickCloseCollapsible={handleCloseOffcanvas}
		/>
	);

	return (
		<Navbar expand="lg" className="customNavbar" variant={mode} sticky="top">
			<Container fluid>
				{/* Agrupados con d-flex */}
				<div className="d-flex flex-wrap align-items-center">
					<Navbar.Brand as={Link} to="/" onClick={handleCloseOffcanvas}>
						<Logo />
					</Navbar.Brand>
				</div>
				<div className="d-none d-md-flex justify-content-center flex-grow-1 px-md-3 px-lg-5 order-md-2 order-lg-2 me-md-3">
					<div style={{ maxWidth: "900px", width: "100%" }}>
						<SearchBar
							setExcursions={props.setExcursions}
							id="searchBar-md-lg"
						/>
					</div>
				</div>
				{/* ms-auto: Cuando se utiliza dentro de un flex-container le dice al navegador que calcule el margen 
				a la izquierda de ese elemento. Así que lo que hace, es poner ese elemento y lo que le siga lo más a la derecha
				que pueda dentro de ese container. ms-md-0 dice que deje de hacerlo a partir de breakpoints medianos */}
				{/* order-lg-3: para posicionarlo correctamente en breakpoints grandes */}
				<div className="d-flex align-items-center ms-auto ms-md-0 order-md-3 order-lg-3">
					<Button
						className={`${styles.themeToggleBtn} me-2`}
						variant="outline-secondary"
						id="toggleButton"
						onClick={toggleTheme}
					>
						{icon}
					</Button>
					{/* Inline items para breakpoints grandes */}
					{/* No visible en breakpoints pequeños (d-none), visible en grandes (d-lg-flex) */}
					{/* Posicionado antes del toggle para mantener el orden en breakpoints grandes */}
					<Nav className="d-none d-lg-flex flex-row align-items-center">
						{isLoggedIn ? LoggedItems : NoLoggedItems}
					</Nav>
					{/* Toggle Offcanvas (Hamburguesa) */}
					<Navbar.Toggle
						aria-controls="offcanvasNavbar"
						onClick={handleShowOffcanvas}
						className="d-lg-none"
					/>
				</div>
				{/* Barra de búsqueda (En breakpoints pequeños ocupa toda la anchura) */}
				{/* order-last: Asegura que esté al final del contenedor */}
				<div className="d-md-none w-100 mt-2 order-last">
					<SearchBar setExcursions={props.setExcursions} id="searchBar-sm" />
				</div>
				{/* --- Final de contenedor de la derecha --- */}

				{/* --- Componente Offcanvas --- */}
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
