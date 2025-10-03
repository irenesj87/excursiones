import React, { useState, useLayoutEffect, memo, useRef } from "react";
import { Nav, Navbar, Container, Offcanvas } from "react-bootstrap";
import { useSelector } from "react-redux"; // useSelector se mantiene para isLoggedIn
import Logo from "../Logo";
import SearchBar from "../SearchBar";
import AuthNav from "../AuthNav";
import ThemeToggleButton from "../ThemeToggleButton";
import styles from "./NavigationBar.module.css";
import "../../css/Themes.css";

/** @typedef {import('types.js').RootState} RootState */

/**
 * @typedef {object} NavigationBarProps
 * @property {(excursions: any[]) => void} onFetchSuccess - Función para actualizar el estado de la lista de excursiones.
 * @property {boolean} isAuthCheckComplete - Indica si la comprobación de autenticación ha finalizado.
 * @property {() => void} onExcursionsFetchStart - Callback que se ejecuta al iniciar la búsqueda de excursiones.
 * @property {(error: Error | null) => void} onExcursionsFetchEnd - Callback que se ejecuta al finalizar la búsqueda de excursiones.
 * @property {boolean} isOnExcursionsPage - Indica si la página actual es la de excursiones.
 */

/**
 * Componente para la barra de navegación.
 * @param {NavigationBarProps} props - Las propiedades del componente.
 * @returns {React.ReactElement} - El componente de la barra de navegación.
 */
function NavigationBarComponent({
	onFetchSuccess,
	isAuthCheckComplete,
	onExcursionsFetchStart,
	onExcursionsFetchEnd,
	isOnExcursionsPage,
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
	const [showMenu, setShowMenu] = useState(false);
	/** Cierra el menú lateral (Offcanvas). */
	const navRef = useRef(null);

	// Usamos useLayoutEffect para medir la altura después de que el DOM se haya actualizado,
	// pero antes de que el navegador pinte la pantalla. Esto evita parpadeos.
	useLayoutEffect(() => {
		const navElement = navRef.current;
		if (!navElement) return;

		const updateHeight = () => {
			const height = navElement.offsetHeight;
			document.documentElement.style.setProperty(
				"--navbar-height",
				`${height}px`
			);
		};

		// El ResizeObserver es la forma moderna y eficiente de reaccionar a cambios de tamaño.
		const observer = new ResizeObserver(() => {
			// Usamos requestAnimationFrame para asegurar que la actualización se haga de forma fluida.
			window.requestAnimationFrame(updateHeight);
		});

		updateHeight(); // Medimos la altura inicial
		observer.observe(navElement);

		// Limpiamos el observador cuando el componente se desmonta para evitar fugas de memoria.
		return () => observer.disconnect();
	}, []);
	const handleCloseMenu = () => setShowMenu(false);
	/** Abre el menú lateral (Offcanvas). */
	const handleShowMenu = () => setShowMenu(true);

	/**
	 * Variable que guarda el modo de tema actual (claro u oscuro) del estado de Redux. Se inicializa con la preferencia del
	 * sistema o un valor guardado en localStorage.
	 */
	// Variable que dice si hay un usuario logueado o no
	const { login: isLoggedIn } = useSelector(
		/** @param {RootState} state - Selector de Redux */
		(state) => state.loginReducer
	);

	return (
		/**
		 * Componente principal de la barra de navegación.
		 * Utiliza `Navbar` de `react-bootstrap` para crear una barra de navegación responsiva.
		 */
		<Navbar
			ref={navRef}
			expand="lg" // prettier-ignore
			className={`${styles.customNavbar} ${
				isOnExcursionsPage ? styles.onExcursionsPage : ""
			}`}
			sticky="top"
		>
			<Container fluid>
				{/* Agrupados con d-flex */}
				<div className="d-flex flex-wrap align-items-center">
					{/* Se eliminan las props 'as', 'to' y 'aria-label' para evitar un enlace anidado,
					ya que el componente Logo ya es un enlace. Se mantiene 'onClick' para
					que el menú lateral se cierre al pulsar el logo. */}
					<Navbar.Brand onClick={handleCloseMenu}>
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
				derecha que pueda dentro de ese container. */}
				{/* order-lg-3: para posicionarlo correctamente en breakpoints grandes */}
				<div className="d-flex align-items-center ms-auto ms-md-0 order-md-3 order-lg-3 me-2">
					{/* Inline items para breakpoints grandes */}
					{/* No visible en breakpoints pequeños (d-none), visible en grandes (d-lg-flex) */}
					<Nav
						className={`${styles.authNavItems} d-none d-lg-flex flex-row align-items-center`}
					>
						<AuthNav
							isAuthCheckComplete={isAuthCheckComplete}
							isLoggedIn={isLoggedIn}
							onCloseMenu={handleCloseMenu}
						/>
					</Nav>
					<ThemeToggleButton className="d-none d-lg-flex" />
					{/* Toggle Offcanvas (Hamburguesa) */}
					<Navbar.Toggle
						aria-controls="offcanvasNavbar" // prettier-ignore
						label="Abrir menú de navegación" // prettier-ignore
						onClick={handleShowMenu} // prettier-ignore
						className={`d-lg-none ${styles.navbarToggler}`}
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
					show={showMenu}
					onHide={handleCloseMenu}
					placement="end"
					id="offcanvasNavbar"
					scroll={true}
					className={styles.offcanvasMenu}
					backdrop={true}
					aria-label="Menú"
				>
					<Offcanvas.Header closeButton closeLabel="Cerrar menú">
						<Offcanvas.Title>Menú</Offcanvas.Title>
					</Offcanvas.Header>
					<Offcanvas.Body>
						<Nav className="d-flex flex-column pt-2">
							<ThemeToggleButton className="w-100 mb-2" showText={true} />
							<AuthNav
								isAuthCheckComplete={isAuthCheckComplete}
								isLoggedIn={isLoggedIn}
								onCloseMenu={handleCloseMenu}
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
