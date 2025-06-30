import { useState, useEffect, memo } from "react";
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

/** @typedef {import('types.js').RootState} RootState */

/**
 * Componente de la barra de navegación.
 * @param {object} props - Las propiedades del componente.
 * @param {(excursions: any[]) => void} props.setExcursions - Función para actualizar el estado de la lista de excursiones.
 * @param {boolean} props.isAuthCheckComplete - Indica si la comprobación de autenticación ha finalizado.
 * @param {() => void} props.onExcursionsFetchStart - Callback que se ejecuta al iniciar la búsqueda de excursiones.
 * @param {(error: Error | null) => void} props.onExcursionsFetchEnd - Callback que se ejecuta al finalizar la búsqueda de excursiones.
 */
function NavigationBarComponent({
	setExcursions,
	isAuthCheckComplete,
	onExcursionsFetchStart,
	onExcursionsFetchEnd,
}) {
	// Estado de la visibilidad del Offcanvas (menú lateral).
	const [showOffcanvas, setShowOffcanvas] = useState(false);
	// Cierra el componente Offcanvas.
	const handleCloseOffcanvas = () => setShowOffcanvas(false);
	// Abre el componente Offcanvas.
	const handleShowOffcanvas = () => setShowOffcanvas(true);
	/**
	 * Variable que guarda el modo de tema actual (claro u oscuro) del estado de Redux. Se inicializa con la preferencia del
	 * sistema o un valor guardado en localStorage.
	 */
	const mode = useSelector(
		/** @param {RootState} state */
		(state) => state.themeReducer.mode
	);
	const dispatch = useDispatch();
	// Variable que dice si hay un usuario logueado o no
	const { login: isLoggedIn } = useSelector(
		/** @param {RootState} state */
		(state) => state.loginReducer
	);

	useEffect(() => {
		// Intenta obtener el modo de tema guardado previamente en el almacenamiento local del navegador.
		const savedMode = localStorage.getItem("themeMode");
		// Comprueba si el sistema operativo del usuario prefiere el modo oscuro.
		// window.matchMedia es una API que permite verificar si un documento coincide con una media query.
		// "(prefers-color-scheme: dark)" es la media query que detecta la preferencia de tema oscuro del sistema.
		const prefersDark =
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches;

		// Variable para almacenar el modo inicial que se aplicará.
		let initialMode;
		if (savedMode === "light" || savedMode === "dark") {
			initialMode = savedMode;
		} else if (prefersDark) {
			initialMode = "dark";
		} else {
			initialMode = "light";
		}
		// Despacha la acción para establecer el modo de tema en el estado de Redux.
		dispatch(setMode(initialMode));
	}, [dispatch]);

	// Efecto para aplicar la clase del tema al HTML y guardar en localStorage
	useEffect(() => {
		if (mode === "light" || mode === "dark") {
			const root = document.documentElement; // Seleccionar la etiqueta <html>
			/**
			 * Asegurarse de que la etiqueta <html> no tiene las clases 'light' y 'dark' aplicadas antes que el código añada
			 * la correcta basada en 'mode'
			 */
			root.classList.remove("light", "dark");
			// Añade la clase 'mode' ('light' o 'dark') a <html>
			root.classList.add(mode);
			// Actualiza la variable 'mode' en localStorage
			localStorage.setItem("themeMode", mode);
		}
	}, [mode]); // Este useEffect se ejecutará cada vez que la variable 'mode' cambie

	// Alterna el modo de tema (claro/oscuro) despachando la acción `toggleMode`.
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

	/**
	 * Componente que muestra los enlaces de navegación para usuarios no logueados (Registrarse, Iniciar sesión).
	 */
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

	/**
	 * Componente que muestra los enlaces de navegación para usuarios logueados (Perfil, Cerrar sesión).
	 */
	const LoggedItems = (
		<LandingPageUserProfile
			onClickCloseCollapsible={handleCloseOffcanvas}
		/>
	);

	// Por defecto, no mostrar nada si la comprobación de autenticación no está completa. Sirve para evitar el FOUC
	let authNavContent = null;
	if (isAuthCheckComplete) {
		if (isLoggedIn) {
			authNavContent = LoggedItems; // Si la autenticación está completa y el usuario está logueado
		} else {
			authNavContent = NoLoggedItems; // Si la autenticación está completa y el usuario no está logueado
		}
	}

	return (
		<Navbar
			expand="lg"
			className={`customNavbar ${styles.navbarContainer}`}
			variant={mode}
			sticky="top"
		>
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
							onFetchStart={onExcursionsFetchStart}
							onFetchEnd={onExcursionsFetchEnd}
						/>
					</div>
				</div>
				{/* ms-auto: Cuando se utiliza dentro de un flex-container le dice al navegador que calcule el margen 
				a la izquierda de ese elemento. Así que lo que hace, es poner ese elemento y lo que le siga lo más a la 
				derecha que pueda dentro de ese container. ms-md-0 dice que deje de hacerlo a partir de breakpoints medianos.
				y justify-content-end alinea los items hijos al final del contenedor. */}
				{/* order-lg-3: para posicionarlo correctamente en breakpoints grandes */}
				<div className="d-flex align-items-center justify-content-end ms-auto ms-md-0 order-md-3 order-lg-3">
					<Button
						className={`${styles.themeToggleBtn} me-2`}
						variant="outline-secondary"
						id="toggleButton"
						onClick={toggleTheme}
						aria-label={
							mode === "light" ? "Activar modo oscuro" : "Activar modo claro"
						}
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
						onFetchStart={onExcursionsFetchStart} 
						onFetchEnd={onExcursionsFetchEnd}
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
					className={styles.offcanvasMenu}
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

const NavigationBar = memo(NavigationBarComponent);
export default NavigationBar;
