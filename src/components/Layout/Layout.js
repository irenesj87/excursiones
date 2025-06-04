import { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
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
	const loginDispatch = useDispatch();
	/* Array de excursiones que se necesita en cada momento, ya sea para mostrar todas las excursiones, las de los filtros o 
	la búsqueda */
	const [excursionArray, setExcursionArray] = useState([]);
	// Estado para saber si la comprobación inicial de autenticación ha terminado
	const [isLoadingExcursions, setIsLoadingExcursions] = useState(true);
	const [fetchExcursionsError, setFetchExcursionsError] = useState(null);
	// Estado para saber si la comprobación inicial de autenticación ha terminado
	const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);

	/* useEffect que controla el token en sessionStorage. El token se guarda en sessionStorage para que el usuario pueda 
	 quedarse logueado */
	useEffect(() => {
		/* Esta función guarda el token actual y loguea al usuario de nuevo en caso de que se refresque la página. 
		Con esto el usuario no perderá su sesión */
		const verifyAuthStatus = async () => {
			setIsAuthCheckComplete(false); // Iniciar la comprobación
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
				} finally {
					setIsAuthCheckComplete(true); // Marcar como completa independientemente del resultado
				}
			} else {
				setIsAuthCheckComplete(true); // Marcar como completa si no hay token
			}
		};
		verifyAuthStatus();
	}, [loginDispatch]);

	// Callbacks para SearchBar y carga inicial de excursiones
	const handleExcursionsFetchStart = useCallback(() => {
		setIsLoadingExcursions(true);
		setFetchExcursionsError(null);
	}, []);

	const handleExcursionsFetchEnd = useCallback((error) => {
		if (error) {
			setFetchExcursionsError(error); // Asume que 'error' es un objeto de error o un mensaje
		}
		setIsLoadingExcursions(false);
	}, []);

	// El componente Excursions ahora recibirá isLoading y error para manejar su propia UI.
	const excursionsContent = (
		<Excursions
			excursionData={excursionArray}
			isLoading={isLoadingExcursions}
			error={fetchExcursionsError}
		/>
	);

	return (
		<div className={styles.layout}>
			<NavigationBar
				setExcursions={setExcursionArray}
				onExcursionsFetchStart={handleExcursionsFetchStart}
				onExcursionsFetchEnd={handleExcursionsFetchEnd}
				isAuthCheckComplete={isAuthCheckComplete}
			/>
			<Container className={styles.mainContentWrapper} fluid>
				<main className={styles.mainContent}>
					<Row className="flex-grow-1 d-flex justify-content-center">
						<Routes>
							{/* Define la ruta por defecto */}
							<Route
								path="/"
								element={
									<>
										<Col xs={12} md={4} lg={3} xl={2}>
											<Filters />
										</Col>
										<Col
											className={`d-flex flex-column ${styles.contentMinHeight}`}
										>
											{excursionsContent}
										</Col>
									</>
								}
							/>
							{/* Define las rutas para los componentes Register, LoginPage y UserPage */}
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
			</Container>
			<Footer />
		</div>
	);
};

export default Layout;
