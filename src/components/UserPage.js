import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import UserInfoForm from "./UserInfoForm";
import ExcursionCard from "./ExcursionCard";
import PaginatedListDisplay from "./PaginatedListDisplay";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/UserPage.module.css";

/** @typedef {import('types.js').RootState} RootState */

/**
 * Componente que representa la página de perfil del usuario. Muestra la información personal del usuario y las excursiones
 * a las que se ha apuntado.
 */
function UserPage({ isAuthCheckComplete }) {
	// useSelector que indica si el usuario está logueado y proporciona la información del usuario.
	const { login: isLoggedIn, user } = useSelector(
		/** @param {RootState} state */
		(state) => state.loginReducer
	);
	// Estado para guardar la información de las excursiones del usuario
	const [userExcursions, setUserExcursions] = useState([]);
	// Estado para el estado de carga de las excursiones. Inicia en true.
	const [isLoading, setIsLoading] = useState(true);
	// Estado para el estado de error
	const [error, setError] = useState(null);

	// Para estabilizar la dependencia del useEffect, creamos una representación estable
	// del array de excursiones. JSON.stringify es una forma sencilla de hacerlo.
	// De esta manera, el efecto solo se volverá a ejecutar si el contenido del array
	// cambia, no solo su referencia en memoria.
	const userExcursionIds = JSON.stringify(user?.excursions);

	/**
	 * Efecto que se encarga de obtener los datos de las excursiones a las que el usuario se ha apuntado.
	 * Se ejecuta cuando cambia el estado de login o el objeto de usuario.
	 * Realiza una petición a un endpoint específico que devuelve solo las excursiones del usuario,
	 * mejorando la eficiencia al no tener que descargar y filtrar todas las excursiones en el cliente.
	 * Maneja los estados de carga y error.
	 */
	useEffect(() => {
		// Solo se procede a buscar datos una vez que la comprobación de autenticación inicial ha finalizado.
		// Esto previene que el efecto se ejecute con un estado de autenticación transitorio (ej. usuario aún no cargado)
		// que podría causar un parpadeo al establecer `isLoading` en `false` prematuramente.
		if (!isAuthCheckComplete) {
			return; // No hacer nada hasta que la autenticación esté verificada.
		}

		const fetchData = async () => {
			// Guardamos el tiempo de inicio para asegurar una duración mínima de la animación de carga.
			const startTime = Date.now();

			// Iniciar el estado de carga para cada nueva petición.
			setIsLoading(true);
			setError(null);

			let excursionsData = [];
			let fetchError = null;

			if (isLoggedIn && user?.mail) {
				try {
					if (user.excursions?.length > 0) {
						const token = sessionStorage.getItem("token");
						const url = `http://localhost:3001/users/${user.mail}/excursions`;
						const response = await fetch(url, {
							headers: {
								Authorization: `Bearer ${token}`,
							},
						});
						if (!response.ok) {
							throw new Error(
								response.status === 401 || response.status === 403
									? "No tienes autorización."
									: `Error HTTP: ${response.status}`
							);
						}
						excursionsData = await response.json();
					}
				} catch (err) {
					console.error("Error al obtener excursiones:", err);
					fetchError = err.message || "Error al cargar tus excursiones.";
				}

				// Aplicar un retraso mínimo antes de actualizar el estado de carga.
				const elapsedTime = Date.now() - startTime;
				const remainingTime = Math.max(0, 300 - elapsedTime);
				await new Promise((resolve) => setTimeout(resolve, remainingTime));

				setUserExcursions(excursionsData);
				setError(fetchError);
			}
			setIsLoading(false);
		};
		fetchData();

		// Cleanup function to handle unmounting
		return () => {
			// Any cleanup if necessary, like aborting fetch requests
		};
	}, [
		isAuthCheckComplete,
		isLoggedIn,
		user?.mail,
		userExcursionIds,
		user?.excursions.length,
	]);

	// Una vez que la autenticación está completa y los datos cargados, podemos redirigir si no está logueado.
	if (!isLoggedIn) {
		return <Navigate replace to="/" />;
	}

	// Si el usuario está logueado
	return (
		<Row className="justify-content-center pt-2">
			<Col xs={11} md={11} lg={11} xl={8}>
				<h2 className={`${styles.title} mb-3`}>Tu perfil</h2>
				<Row className="mb-3">
					<Col lg={6} xl={4} className="mb-4 mb-lg-0">
						<UserInfoForm />
					</Col>
					<Col lg={6} xl={8}>
						{/* Una vez que la carga ha finalizado, mostramos la lista de excursiones o los mensajes de error/vacío. */}
						<PaginatedListDisplay
							data={userExcursions}
							isLoading={isLoading}
							error={error}
							itemsPerPage={4}
							renderItem={(excursion) => (
								<ExcursionCard {...excursion} isLoggedIn isJoined />
							)}
							itemKeyExtractor={(excursion) => excursion.id}
							noItemsMessage="Aún no te has apuntado a ninguna excursión."
							errorMessage="Error al cargar tus excursiones."
							cardHeader="Excursiones a las que te has apuntado"
							cardClassName={styles.excursionsCard}
							colProps={{ xs: 12 }}
						/>
					</Col>
				</Row>
			</Col>
		</Row>
	);
}
export default UserPage;
