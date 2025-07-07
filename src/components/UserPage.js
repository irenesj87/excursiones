import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
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
function UserPage() {
	// useSelector que dice si el usuario está logueado o no. Además, da la información del usuario
	const { login: isLoggedIn, user } = useSelector(
		/** @param {RootState} state */
		(state) => state.loginReducer
	);
	// Estado para guardar la información de las excursiones del usuario
	const [userExcursions, setUserExcursions] = useState([]);
	// Estado para el estado de carga de las excursiones
	const [isLoading, setIsLoading] = useState(false);
	// Estado para el estado de error
	const [error, setError] = useState(null);

	/**
	 * Efecto que se encarga de obtener los datos de las excursiones a las que el usuario se ha apuntado.
	 * Se ejecuta cuando cambia el estado de login o el objeto de usuario.
	 * Realiza una petición a un endpoint específico que devuelve solo las excursiones del usuario,
	 * mejorando la eficiencia al no tener que descargar y filtrar todas las excursiones en el cliente.
	 * Maneja los estados de carga y error.
	 */
	useEffect(() => {
		const fetchData = async () => {
			// Solo hacemos la petición si el usuario está logueado, tiene un email y excursiones asociadas.
			if (isLoggedIn && user?.mail && user.excursions?.length > 0) {
				setIsLoading(true);
				setError(null);
				const token = sessionStorage.getItem("token");
				const url = `http://localhost:3001/users/${user.mail}/excursions`;
				try {
					const response = await fetch(url, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
					if (!response.ok) {
						if (response.status === 401 || response.status === 403) {
							throw new Error(
								"No tienes autorización para ver estas excursiones."
							);
						}
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					const data = await response.json();
					// El servidor ya devuelve solo las excursiones del usuario, no es necesario filtrar.
					setUserExcursions(data);
				} catch (err) {
					console.error("Error fetching user excursions:", err);
					setError(err.message || "Error al cargar tus excursiones.");
					setUserExcursions([]); // Limpiar en caso de error
				} finally {
					setIsLoading(false);
				}
			} else {
				// Si el usuario no está logueado o no tiene excursiones, la lista se muestra vacía.
				setUserExcursions([]);
				setIsLoading(false); // Asegurarse de que no quede cargando
				setError(null);
			}
		};
		fetchData();
	}, [isLoggedIn, user]);

	return (
		/**
		 * Contenedor principal de la página de usuario.
		 */
		<Row className="justify-content-center pt-2">
			<Col xs={11} md={11} lg={11} xl={8} className="contentPane">
				<Row className="mb-3">
					<Col>
						<h2 className={styles.title}>Tu perfil</h2>
					</Col>
				</Row>
				<Row className="mb-3">
					<Col lg={6} xl={4} className="mb-4 mb-lg-0">
						<UserInfoForm />
					</Col>
					<Col lg={6} xl={8}>
						<PaginatedListDisplay
							data={userExcursions}
							isLoading={isLoading}
							error={error}
							itemsPerPage={2} // Puedes hacer esto una constante o una prop si lo necesitas dinámico
							renderItem={(excursion) => (
								<ExcursionCard
									{...excursion}
									isLoggedIn={true}
									isJoined={true}
								/>
							)}
							itemKeyExtractor={(excursion) => excursion.id}
							noItemsMessage="Aún no te has apuntado a ninguna excursión."
							loadingMessage="Cargando tus excursiones..."
							errorMessage="Error al cargar tus excursiones."
							cardHeader="Excursiones a las que te has apuntado"
							cardClassName={styles.excursionsCard} // Aplica estilos específicos de UserPage
							colProps={{ xs: 12 }} // Asegura que cada tarjeta ocupe el ancho en breakpoints pequeños
						/>
					</Col>
				</Row>
			</Col>
		</Row>
	);
}
export default UserPage;
