import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { login, logout } from "../../slicers/loginSlice";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "../NavigationBar";
import RegisterPage from "../RegisterPage";
import LoginPage from "../LoginPage";
import Filters from "../Filters";
import Excursions from "../Excursions";
import UserPage from "../UserPage";
import Footer from "../Footer";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../../css/Layout.module.css";

// Este es el Layout. Aquí va la estructura de la página
const Layout = () => {
	// Variable que necesitamos para utilizar dispatchers
	const loginDispatch = useDispatch();

	/* Array de excursiones que se necesita en cada momento, ya sea para mostrar todas las excursiones, 
	las de los filtros o la búsqueda */
	const [excursionArray, setExcursionArray] = useState([]);
	// Estados para manejar la carga de las excursiones
	const [isLoadingExcursions, setIsLoadingExcursions] = useState(true); // Inicia en true para la carga inicial
	const [fetchExcursionsError, setFetchExcursionsError] = useState(null);

	/* useEffect que controla el token en sessionStorage. El token se guarda en sessionStorage para que el usuario pueda 
	 quedarse logueado */
	useEffect(() => {
		/* Esta función guarda el token actual y loguea al usuario de nuevo en caso de que se refresque la página. 
		Con esto el usuario no perderá su sesión */
		const loadToken = async () => {
			// Coge el token de la sessionStorage del navegador
			const sessionToken = sessionStorage["token"];
			// Variable que tiene la url para hacer el fetch
			const url = `http://localhost:3001/token/${sessionToken}`;
			// Variable que guarda las opciones que se necesitan para el fetch
			const options = {
				method: "GET",
				mode: "cors",
				headers: { "Content-Type": "application/json" },
			};

			// Si hay token
			if (sessionToken) {
				try {
					// Esperamos a la respuesta del servidor
					const response = await fetch(url, options);
					if (response.status === 404) {
						throw new Error("Token not found or invalid");
					}
					// Pasa la respuesta en JSON del servidor a un objeto JavaScript
					const data = await response.json();
					// Actualiza el estado de la Redux store poniendo al usuario como logueado
					loginDispatch(
						login({
							user: data.user,
							token: data.token,
						})
					);
					// Si hay un error
				} catch (error) {
					console.error("Token validation error:", error);
					// Se desloguea al usuario...
					loginDispatch(logout());
					// ...y se elimina el token de la sessionStorage
					sessionStorage.removeItem("token");
				}
			}
		};

		loadToken();
	}, [loginDispatch]);

	// Callbacks para SearchBar
	const handleExcursionsFetchStart = useCallback(() => {
		setIsLoadingExcursions(true);
		setFetchExcursionsError(null);
	}, []);

	const handleExcursionsFetchEnd = useCallback((error) => {
		if (error) {
			setFetchExcursionsError(error.message || "Error al cargar excursiones.");
			// setExcursionArray([]); // SearchBar ya limpia los datos en caso de error
		}
		setIsLoadingExcursions(false);
	}, []);

	return (
		<div className={styles.layout}>
			<NavigationBar
				setExcursions={setExcursionArray}
				onExcursionsFetchStart={handleExcursionsFetchStart}
				onExcursionsFetchEnd={handleExcursionsFetchEnd}
			/>
			<Container className={styles.mainContentWrapper} fluid>
				{/* 4. `styles.mainContent` debe tener `flex-grow: 1` desde Layout.module.css */}
				<main className={styles.mainContent}>
					{/* La Row interna no necesita propiedades especiales para el sticky footer,
				    pero sí para el layout de su propio contenido. */}
					{/* Hacemos la Row un contenedor flex para que sus Cols se estiren verticalmente */}
					<Row className="flex-grow-1 d-flex">
						{/* Esta Row ahora crecerá para llenar la altura de mainContent */}
						{/* Intentamos que la Row ocupe la altura de mainContent para el centrado del spinner */}
						<Routes>
							{/* Define la ruta por defecto */}
							<Route
								path="/"
								element={
									<>
										<Col
											xs={12}
											md={4}
											lg={3}
											xl={2}
										>
											<Filters />
										</Col>
										<Col
											xs={12}
											md={8} 
											lg={9}
											xl={8}
											// Hacemos que la Col sea un contenedor flex para centrar su contenido (spinner/alerta)
											className="d-flex flex-column"
										>
											{isLoadingExcursions ? (
												// Usamos la clase del módulo CSS para centrar y expandir el spinner.
												<div className={styles.centeredContent}>
													<Spinner animation="border" role="status">
														<span className="visually-hidden">
															Cargando excursiones...
														</span>
													</Spinner>
													<p className="mt-2">Cargando excursiones...</p> {/* Bootstrap class for margin */}
												</div>
											) : fetchExcursionsError ? (
												// Usamos la clase del módulo CSS para centrar y expandir la alerta.
												<div className={styles.centeredContent}>
													<Alert variant="danger">
														{/* El componente Alert envuelve el mensaje */}
														{fetchExcursionsError}
													</Alert>
												</div>
											) : (
												// Excursions se renderizará aquí. Si excursionArray está vacío,
												// Excursions.js mostrará su propio mensaje de "no encontrado".
												<Excursions excursionData={excursionArray} />
											)}
										</Col>
									</>
								}
							/>
							{/* Define las rutas para los componentes Register, LoginPage y UserPage */}
							{/* Estas páginas deben ocupar todo el ancho de la Row */}
							<Route
								path="registerPage"
								element={
									<Col xs={12}>
										<RegisterPage />
									</Col>
								}
							/>
							<Route
								path="loginPage"
								element={
									<Col xs={12}>
										<LoginPage />
									</Col>
								}
							/>
							<Route
								path="userPage"
								element={
									<Col xs={12}>
										<UserPage />
									</Col>
								}
							/>
						</Routes>
					</Row>
				</main>
				{/* 6. El Footer es un hijo directo del contenedor flex (styles.layout) y se posicionará al final. */}
			</Container>
			<Footer />
		</div>
	);
};

export default Layout;
