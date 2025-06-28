import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import UserInfoForm from "./UserInfoForm";
import ExcursionCard from "./ExcursionCard";
import PaginatedListDisplay from "./PaginatedListDisplay";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/UserPage.module.css";

/**
 * Componente que representa la página de perfil del usuario. Muestra la información personal del usuario y las excursiones
 * a las que se ha apuntado.
 */
function UserPage() {
	// useSelector que dice si el usuario está logueado o no. Además, da la información del usuario
	const { login: isLoggedIn, user } = useSelector(
		(state) => state.loginReducer
	);
	// Estado para guardar la información de las excursiones del usuario
	const [userExcursions, setUserExcursions] = useState([]);
	// Estado para el estado de carga de las excursiones
	const [isLoading, setIsLoading] = useState(false);
	// Estado para el estado de error
	const [error, setError] = useState(null);
	const excursionsUrl = `http://localhost:3001/excursions`;

	/**
	 * Efecto que se encarga de obtener los datos de las excursiones del usuario.
	 * Se ejecuta cuando cambia el estado de login, el objeto de usuario o la URL de las excursiones.
	 * Realiza una petición al servidor para obtener todas las excursiones y luego filtra
	 * aquellas a las que el usuario se ha apuntado.
	 * Maneja los estados de carga y error, y resetea la paginación a la primera página
	 * cuando los datos cambian.
	 */
	useEffect(() => {
		const fetchData = async () => {
			/**
			 * Usamos el encadenamiento opcional (?.) para comprobar de forma segura si 'user.excursions' existe y tiene
			 * elementos, lo que simplifica la condición.
			 */
			if (isLoggedIn && user?.excursions?.length > 0) {
				setIsLoading(true);
				setError(null);
				try {
					const response = await fetch(excursionsUrl);
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					const data = await response.json();
					// Filtrar las excursiones para mostrar solo aquellas a las que el usuario está apuntado
					const filteredExcursions = data.filter((excursion) =>
						user.excursions.includes(excursion.id)
					);
					setUserExcursions(filteredExcursions);
				} catch (err) {
					console.error("Error fetching user excursions:", err);
					setError(err.message || "Error al cargar tus excursiones.");
					setUserExcursions([]); // Limpiar en caso de error
				} finally {
					setIsLoading(false);
				}
			} else {
				setUserExcursions([]); // Si no hay excursiones o no está logueado, lista vacía
				setIsLoading(false); // Asegurarse de que no quede cargando
				setError(null);
			}
		};
		fetchData();
	}, [isLoggedIn, user, excursionsUrl]);

	return (
		/**
		 * Contenedor principal de la página de usuario.
		 */
		<div className=" d-flex flex-column flex-grow-1">
			<Row className="justify-content-center flex-grow-1 pt-4">
				<Col xs={11} md={11} lg={11} xl={6} className="d-flex flex-column">
					<Row className="mb-4">
						<Col>
							<h2 className={styles.title}>Tu perfil</h2>
						</Col>
					</Row>
					<Row className="mb-2">
						<Col>
							<UserInfoForm />
						</Col>
					</Row>
					{/* Este Row se expandirá para empujar el footer hacia abajo */}
					<Row className="mb-4 flex-grow-1">
						<Col className="d-flex flex-column">
							<PaginatedListDisplay
								data={userExcursions}
								isLoading={isLoading}
								error={error}
								itemsPerPage={2} // Puedes hacer esto una constante o una prop si lo necesitas dinámico
								renderItem={(excursion) => (
									<ExcursionCard
										name={excursion.name}
										area={excursion.area}
										description={excursion.description}
										difficulty={excursion.difficulty}
										time={excursion.time}
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
		</div>
	);
}
export default UserPage;
