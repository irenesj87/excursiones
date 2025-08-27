import { useState, useEffect, memo, useCallback } from "react";
import {
	Nav,
	Navbar,
	Container,
	Button,
	Offcanvas,
	Tooltip,
	OverlayTrigger,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Logo from "../Logo";
import AuthNav from "../AuthNav";
import SearchBar from "../SearchBar";
import { toggleMode } from "../../slicers/themeSlice";
import { FaMoon, FaSun } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./NavigationBar.module.css";
import "../../css/Themes.css";

/** @typedef {import('types.js').RootState} RootState */

/**
 * Componente para la barra de navegación.
 * @param {object} props - Las propiedades del componente.
 * @param {(excursions: any[]) => void} props.onFetchSuccess - Función para actualizar el estado de la lista de excursiones.
 * @param {boolean} props.isAuthCheckComplete - Indica si la comprobación de autenticación ha finalizado.
 * @param {() => void} props.onExcursionsFetchStart - Callback que se ejecuta al iniciar la búsqueda de excursiones.
 * @param {(error: Error | null) => void} props.onExcursionsFetchEnd - Callback que se ejecuta al finalizar la búsqueda de excursiones.
 */
function NavigationBarComponent({
	onFetchSuccess,
	isAuthCheckComplete,
	onExcursionsFetchStart,
	onExcursionsFetchEnd,
}) {
	/**
	 * Estado para el término de búsqueda, compartido entre las dos barras de búsqueda (móvil y escritorio).
	 * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
	 */
	const [searchTerm, setSearchTerm] = useState("");
	/**
	 * Estado para controlar la visibilidad del componente Offcanvas (menú lateral).
	 * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
	 */
	const [showOffcanvas, setShowOffcanvas] = useState(false);
	/** Cierra el menú Offcanvas. */
	const handleCloseOffcanvas = () => setShowOffcanvas(false);
	/** Abre el menú Offcanvas. */
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
	/**
	 * Efecto que se ejecuta cuando el `mode` (tema) cambia.
	 * Aplica la clase CSS correspondiente al elemento `<html>` y guarda la preferencia en `localStorage`.
	 */
	useEffect(() => {
		if (mode === "light" || mode === "dark") {
			// Se selecciona la etiqueta <html>
			const root = document.documentElement;
			// Se asegura de que la etiqueta <html> no tiene las clases 'light' y 'dark' aplicadas antes que el código añada
			// la correcta basada en 'mode'
			root.classList.remove("light", "dark");
			// Añade la clase 'mode' ('light' o 'dark') a <html>
			root.classList.add(mode);
			// Actualiza la variable 'mode' en localStorage
			localStorage.setItem("themeMode", mode);
		}
	}, [mode]);

	/**
	 * Alterna el modo de tema (claro/oscuro).
	 */
	const toggleTheme = () => {
		dispatch(toggleMode());
	};

	/**
	 * Icono para el botón de cambio de tema, varía según el modo actual.
	 */
	const icon =
		mode === "light" ? (
			//Icono de luna para el modo claro, sugiriendo cambio a oscuro.
			<FaMoon className={styles.themeIcon} data-testid="fa-moon-icon" />
		) : (
			//Icono de sol para el modo oscuro, sugiriendo cambio a claro.
			<FaSun className={styles.themeIcon} data-testid="fa-sun-icon" />
		);

	/**
	 * Renderiza el Tooltip para el botón de cambio de tema.
	 * Se memoiza con `useCallback` para evitar que se recree en cada renderizado,
	 * a menos que el `mode` cambie.
	 * @param {object} props - Propiedades inyectadas por OverlayTrigger.
	 * @returns {React.ReactElement}
	 */
	const renderThemeTooltip = useCallback(
		(props) => (
			<Tooltip id="button-tooltip" {...props}>
				{mode === "light" ? "Cambia a modo oscuro" : "Cambia a modo claro"}
			</Tooltip>
		),
		[mode]
	);

	return (
		/**
		 * Componente principal de la barra de navegación.
		 * Utiliza `Navbar` de `react-bootstrap` para crear una barra de navegación responsiva.
		 */
		<Navbar
			expand="lg"
			className={`customNavbar ${styles.navbarContainer}`}
			variant={mode}
			sticky="top"
		>
			<Container fluid>
				{/* Agrupados con d-flex */}
				<div className="d-flex flex-wrap align-items-center">
					{/* Se eliminan las props 'as', 'to' y 'aria-label' para evitar un enlace anidado,
					ya que el componente Logo ya es un enlace. Se mantiene 'onClick' para
					que el menú lateral se cierre al pulsar el logo. */}
					<Navbar.Brand onClick={handleCloseOffcanvas}>
						<Logo />
					</Navbar.Brand>
				</div>
				<div className="d-none d-md-flex justify-content-center flex-grow-1 px-md-3 px-lg-5 order-md-2 order-lg-2 me-md-3">
					<div style={{ maxWidth: "900px", width: "100%" }}>
						<SearchBar
							onFetchSuccess={onFetchSuccess}
							id="searchBar-md-lg"
							onFetchStart={onExcursionsFetchStart}
							onFetchEnd={onExcursionsFetchEnd}
							searchValue={searchTerm}
							onSearchChange={setSearchTerm}
						/>
					</div>
				</div>
				{/* ms-auto: Cuando se utiliza dentro de un flex-container le dice al navegador que calcule el margen 
				a la izquierda de ese elemento. Así que lo que hace, es poner ese elemento y lo que le siga lo más a la 
				derecha que pueda dentro de ese container. ms-md-0 dice que deje de hacerlo a partir de breakpoints medianos.
				y justify-content-end alinea los items hijos al final del contenedor. */}
				{/* order-lg-3: para posicionarlo correctamente en breakpoints grandes */}
				<div className="d-flex align-items-center justify-content-end ms-auto ms-md-0 order-md-3 order-lg-3">
					<OverlayTrigger
						placement="bottom"
						overlay={renderThemeTooltip}
					>
						<Button
							className={`${styles.themeToggleBtn} me-2`}
							id="toggleButton"
							onClick={toggleTheme}
							aria-label={
								mode === "light"
									? "Activa el modo oscuro"
									: "Activa el modo claro"
							}
						>
							{icon}
						</Button>
					</OverlayTrigger>
					{/* Inline items para breakpoints grandes */}
					{/* No visible en breakpoints pequeños (d-none), visible en grandes (d-lg-flex) */}
					{/* Posicionado antes del toggle para mantener el orden en breakpoints grandes */}
					<Nav
						className={`${styles.authNavItems} d-none d-lg-flex flex-row align-items-center`}
					>
						<AuthNav
							isAuthCheckComplete={isAuthCheckComplete}
							isLoggedIn={isLoggedIn}
							onCloseOffcanvas={handleCloseOffcanvas}
						/>
					</Nav>
					{/* Toggle Offcanvas (Hamburguesa) */}
					<Navbar.Toggle
						aria-controls="offcanvasNavbar"
						aria-label="Abrir menú de navegación"
						onClick={handleShowOffcanvas}
						className="d-lg-none"
					/>
				</div>
				{/* Barra de búsqueda (En breakpoints pequeños ocupa toda la anchura) */}
				{/* order-last: Asegura que esté al final del contenedor */}
				<div className="d-md-none w-100 mt-2 order-last">
					<SearchBar
						onFetchSuccess={onFetchSuccess}
						id="searchBar-sm"
						onFetchStart={onExcursionsFetchStart}
						onFetchEnd={onExcursionsFetchEnd}
						searchValue={searchTerm}
						onSearchChange={setSearchTerm}
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
					<Offcanvas.Header closeButton closeLabel="Cerrar menú">
						<Offcanvas.Title>Menú</Offcanvas.Title>
					</Offcanvas.Header>
					<Offcanvas.Body>
						<Nav className="d-flex flex-column">
							<AuthNav
								isAuthCheckComplete={isAuthCheckComplete}
								isLoggedIn={isLoggedIn}
								onCloseOffcanvas={handleCloseOffcanvas}
							/>
						</Nav>
					</Offcanvas.Body>
				</Offcanvas>
			</Container>
		</Navbar>
	);
}

const NavigationBar = memo(NavigationBarComponent);

export default NavigationBar;
