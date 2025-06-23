import { useState, useEffect } from "react";
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

function NavigationBar({
	setExcursions,
	isAuthCheckComplete,
	onExcursionsFetchStart,
	onExcursionsFetchEnd,
}) {
	// Estado de la visibilidad del Offcanvas
	const [showOffcanvas, setShowOffcanvas] = useState(false);
	// Función para cerrar el Offcanvas
	const handleCloseOffcanvas = () => setShowOffcanvas(false);
	// Función para abrir el Offcanvas
	const handleShowOffcanvas = () => setShowOffcanvas(true);
	// Variable que guarda si el usuario prefiere el modo oscuro, tanto en su sistema operativo como en su navegador
	const mode = useSelector((state) => state.themeReducer.mode);
	const dispatch = useDispatch();
	// Variable que dice si hay un usuario logueado o no
	const { login: isLoggedIn, user } = useSelector(
		(state) => state.loginReducer
	);

	useEffect(() => {
		const savedMode = localStorage.getItem("themeMode");
		// It's often safer to read media query inside the effect if only needed once
		const prefersDark =
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches;

		let initialMode;

		// 1. Check for a valid saved mode in localStorage
		if (savedMode === "light" || savedMode === "dark") {
			initialMode = savedMode;
		} else {
			// 2. If no valid saved mode, use system preference
			initialMode = prefersDark ? "dark" : "light";
		}
		dispatch(setMode(initialMode));

		// Run this effect only once when the component mounts
	}, [dispatch]); // dispatch is stable, so this effectively runs once

	// Efecto para aplicar la clase del tema al HTML y guardar en localStorage
	useEffect(() => {
		if (mode === "light" || mode === "dark") {
			const root = document.documentElement; // Seleccionar la etiqueta <html>
			// Asegurarse de que la etiqueta <html> no tiene las clases 'light' y 'dark' aplicadas
			// antes que el código añada la correcta basada en 'mode'
			root.classList.remove("light", "dark");
			// Añade la clase 'mode' ('light' o 'dark') a <html>
			root.classList.add(mode);
			// Actualiza la variable 'mode' en localStorage
			localStorage.setItem("themeMode", mode);
		}
	}, [mode]); // Este useEffect se ejecutará cada vez que la variable 'mode' cambie

	const toggleTheme = () => {
		dispatch(toggleMode());
	};

	// Renderizado condicional para el icono
	const icon =
		mode === "light" ? (
			<RiMoonClearFill className={styles.themeIcon} />
		) : (
			<RiSunFill className={styles.themeIcon} />
		);

	// Items que están en la barra de navegación cuando el usuario no está logueado
	const NoLoggedItems = (
		<>
			<Nav.Link
				className={`${styles.registerLink} me-3`}
				as={Link}
				to="/registerPage"
				onClick={handleCloseOffcanvas}
			>
				Regístrate
			</Nav.Link>
			<Nav.Link
				className={`${styles.loginLink} me-3`}
				as={Link}
				to="/loginPage"
				onClick={handleCloseOffcanvas}
			>
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

	// Determinar el contenido de navegación de autenticación
	// Esto extrae la lógica del ternario anidado para mayor claridad
	let authNavContent = null; // Por defecto, no mostrar nada si la comprobación de autenticación no está completa
	if (isAuthCheckComplete) {
		if (isLoggedIn) {
			authNavContent = LoggedItems;
		} else {
			authNavContent = NoLoggedItems;
		}
	}

	return (
		<Navbar expand="lg" className={`customNavbar ${styles.navbarContainer}`} variant={mode} sticky="top">
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
							setExcursions={setExcursions}
							id="searchBar-md-lg"
							onFetchStart={onExcursionsFetchStart} // <--- Pasar prop
							onFetchEnd={onExcursionsFetchEnd} // <--- Pasar prop
						/>
					</div>
				</div>
				{/* ms-auto: Cuando se utiliza dentro de un flex-container le dice al navegador que calcule el margen 
				a la izquierda de ese elemento. Así que lo que hace, es poner ese elemento y lo que le siga lo más a la derecha
				que pueda dentro de ese container. ms-md-0 dice que deje de hacerlo a partir de breakpoints medianos. justify-content-end alinea los items hijos al final del contenedor. */}
				{/* order-lg-3: para posicionarlo correctamente en breakpoints grandes */}
				<div className="d-flex align-items-center justify-content-end ms-auto ms-md-0 order-md-3 order-lg-3">
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
					<Nav
						className={`${styles.authNavItems} d-none d-lg-flex flex-row align-items-center`}
					>
						{authNavContent}
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
					<SearchBar
						setExcursions={setExcursions}
						id="searchBar-sm"
						onFetchStart={onExcursionsFetchStart} // <--- Pasar prop
						onFetchEnd={onExcursionsFetchEnd} // <--- Pasar prop
					/>
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
						<Nav className="d-flex flex-column">{authNavContent}</Nav>
					</Offcanvas.Body>
				</Offcanvas>
			</Container>
		</Navbar>
	);
}

export default NavigationBar;
