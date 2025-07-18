import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import UserInfoForm from "./UserInfoForm";
import ExcursionCard from "./ExcursionCard";
import PaginatedListDisplay from "./PaginatedListDisplay";
import UserPageSkeleton from "./UserPageSkeleton";
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
		if (!isAuthCheckComplete) {
			return; // No hacer nada hasta que la autenticación esté verificada.
		}

		// Si el usuario no está logueado o no tiene excursiones, terminamos la carga.
		if (!isLoggedIn || !user?.mail || (user.excursions?.length ?? 0) === 0) {
			setIsLoading(false);
			setUserExcursions([]);
			setError(null);
			return;
		}

		const fetchData = async () => {
			setIsLoading(true);
			setError(null);
			// Guardamos el tiempo de inicio para asegurar una duración mínima de la animación de carga.
			const startTime = Date.now();

			try {
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
				const data = await response.json();
				setUserExcursions(data);
			} catch (err) {
				console.error("Error al obtener excursiones:", err);
				setError(err.message || "Error al cargar tus excursiones.");
				setUserExcursions([]); // Limpiar en caso de error
			} finally {
				// Asegurar un tiempo de carga mínimo para evitar parpadeos
				const elapsedTime = Date.now() - startTime;
				const remainingTime = Math.max(0, 500 - elapsedTime); // 500ms
				setTimeout(() => setIsLoading(false), remainingTime);
			}
		};
		fetchData();
	}, [
		isAuthCheckComplete,
		isLoggedIn,
		user?.mail,
		userExcursionIds,
		user?.excursions.length,
	]);

	// --- Lógica de Renderizado Secuencial ---

	// 1. Si la comprobación de autenticación no ha terminado O si estamos cargando las excursiones,
	// mostramos el esqueleto completo de la página. Esto unifica el estado de carga y previene
	// que se muestre una parte de la página con datos reales y otra con un esqueleto.
	if (!isAuthCheckComplete || isLoading) {
		return <UserPageSkeleton />;
	}

	// 2. Una vez que ha cargado, si el usuario no está logueado, lo redirigimos.
	if (!isLoggedIn) {
		return <Navigate replace to="/" />;
	}

	// 3. Si todas las comprobaciones han pasado, mostramos el contenido final de la página.
	return (
		<Row className="justify-content-center pt-2">
			<Col xs={11} md={11} lg={11} xl={8}>
				<h2 className={`${styles.title} mb-3`}>Tu perfil</h2>
				<Row className="mb-3">
					<Col lg={6} xl={4} className="mb-4 mb-lg-0">
						{/* El formulario de información del usuario ya no necesita su propio estado de carga,
						ya que se gestiona de forma centralizada arriba. */}
						<UserInfoForm />
					</Col>
					<Col lg={6} xl={8}>
						{/* La lista de excursiones ahora se renderiza directamente. El componente
						PaginatedListDisplay gestionará internamente si debe mostrar la lista,
						el mensaje de error o el mensaje de "no hay elementos". */}
						<PaginatedListDisplay
							data={userExcursions}
							isLoading={false} // La carga principal ya se ha manejado.
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
