import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
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

// Este es Layout. Aquí va la estructura de la página
const Layout = () => {
	// Variable que necesitamos para utilizar dispatchers
	const loginDispatch = useDispatch();

	/* Array de excursiones que se necesita en cada momento, ya sea para mostrar todas las excursiones, 
	las de los filtros o la búsqueda */
	const [excursionArray, setExcursionArray] = useState([]);

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

	return (
		<Container className={styles.layout} fluid>
			<NavigationBar setExcursions={setExcursionArray} />
			<main>
				<Row>
					<Routes>
						{/* Define la ruta por defecto */}
						<Route
							path="/"
							element={
								<>
									<Filters />
									<Excursions excursionData={excursionArray} />
								</>
							}
						/>
						{/* Define las rutas para los componentes Register, LoginPage y UserPage */}
						<Route path="registerPage" element={<RegisterPage />} />
						<Route path="loginPage" element={<LoginPage />} />
						<Route path="userPage" element={<UserPage />} />
					</Routes>
				</Row>
			</main>
			<Row>
				<Footer />
			</Row>
		</Container>
	);
};

export default Layout;
