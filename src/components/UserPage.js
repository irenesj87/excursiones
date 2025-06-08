import { useState, useEffect } from "react";
import {
	Col,
	Row,
	Container,
	Card,
	Spinner,
	Alert,
	Pagination,
} from "react-bootstrap"; // Importar Pagination
import { useSelector } from "react-redux";
import ExcursionCard from "./ExcursionCard";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/UserPage.module.css";
import UserInfoForm from "./UserInfoForm";

function UserPage() {
	// Constante para el número de excursiones por página
	const ITEMS_PER_PAGE = 2;

	// This useSelector gives us the info if an user is logged or not
	const { login: isLoggedIn, user } = useSelector(
		(state) => state.loginReducer
	);
	// State for saving the user's excursions info
	const [userExcursions, setUserExcursions] = useState([]);
	// State for loading status
	const [isLoading, setIsLoading] = useState(false);
	// State for error status
	const [error, setError] = useState(null);
	// State for current page in pagination
	const [currentPage, setCurrentPage] = useState(1);
	const excursionsUrl = `http://localhost:3001/excursions`;

	// Fetch the user's excursions data
	useEffect(() => {
		const fetchData = async () => {
			// Asegurarse de que user y user.excursions existen
			if (isLoggedIn && user && user.excursions && user.excursions.length > 0) {
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
					setCurrentPage(1); // Reset a la primera página cuando los datos cambian
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
				setCurrentPage(1); // Reset a la primera página
				setError(null);
			}
		};
		fetchData();
	}, [isLoggedIn, user, excursionsUrl]);

	return (
		// Make the main container of UserPage a flex column that can grow
		<Container className={`${styles.container} d-flex flex-column flex-grow-1`}>
			<Row className="mb-4 justify-content-center">
				<Col>
					<h2 className={styles.title}>Tu perfil</h2>
				</Col>
			</Row>
			<Row className="mb-4 justify-content-center">
				<Col xs="12" md="12" lg="9" xl="10">
					<UserInfoForm />
				</Col>
			</Row>
			{/* This Row should grow to take available vertical space */}
			<Row className="mb-4 justify-content-center flex-grow-1">
				{/* The Col should also be a flex column to allow its child (Card) to grow */}
				<Col xs="12" md="12" lg="9" xl="10" className="d-flex flex-column">
					{/* The Card should be a flex column and grow */}
					<Card
						className={`${styles.excursionsCard} d-flex flex-column flex-grow-1`}
					>
						<Card.Header className={styles.cardHeader}>
							Excursiones a las que te has apuntado
						</Card.Header>
						<Card.Body
							className={`${styles.cardBody} d-flex flex-column flex-grow-1`}
						>
							{/* Contenedor para la lista o los mensajes, para que ocupe el espacio disponible antes de la paginación */}
							<div className="flex-grow-1">
								{isLoading && (
									// Este div se expandirá para llenar el espacio y centrará su contenido.
									<div className="text-center d-flex flex-column justify-content-center align-items-center h-100">
										<Spinner animation="border" role="status">
											<span className="visually-hidden">
												Cargando excursiones...
											</span>
										</Spinner>
										<p>Cargando tus excursiones...</p>
									</div>
								)}
								{error && !isLoading && (
									<div className="d-flex flex-column justify-content-center align-items-center h-100">
										<Alert variant="danger">{error}</Alert>
									</div>
								)}
								{!isLoading && !error && (
									<>
										{userExcursions.length > 0 ? (
											(() => {
												// Lógica de paginación
												const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
												const indexOfFirstItem =
													indexOfLastItem - ITEMS_PER_PAGE;
												const currentItemsToDisplay = userExcursions.slice(
													indexOfFirstItem,
													indexOfLastItem
												);

												// Ajusta el número de columnas en md según ITEMS_PER_PAGE
												// Si ITEMS_PER_PAGE es 1, usa 1 columna. Si es 2, usa 2 columnas. Si es 3, usa 3 columnas (o 2 si el espacio es limitado).
												// Para este ejemplo, si ITEMS_PER_PAGE es 2, md={2}. Si es 1, md={1}.
												const mdCols = ITEMS_PER_PAGE > 1 ? 2 : 1;

												return (
													<Row xs={1} md={mdCols} className="g-3">
														{currentItemsToDisplay.map((excursion) => (
															<Col key={excursion.id}>
																<ExcursionCard
																	name={excursion.name}
																	area={excursion.area}
																	description={excursion.description}
																	difficulty={excursion.difficulty}
																	time={excursion.time}
																	isLoggedIn={true}
																	isJoined={true}
																/>
															</Col>
														))}
													</Row>
												);
											})()
										) : (
											<div className="d-flex flex-column justify-content-center align-items-center h-100">
												<p
													className={`${styles.noExcursionsJoined} no-excursions-text`}
												>
													Aún no te has apuntado a ninguna excursión.
												</p>
											</div>
										)}
									</>
								)}
							</div>

							{/* Controles de Paginación: Se muestran solo si no está cargando, no hay error y hay más ítems que los que caben en una página */}
							{!isLoading &&
								!error &&
								userExcursions.length > ITEMS_PER_PAGE && (
									<div className="d-flex justify-content-center mt-4 pt-3 border-top">
										{" "}
										{/* mt-auto para empujar al fondo, o mt-4 para espacio fijo */}
										<Pagination>
											<Pagination.Prev
												onClick={() =>
													setCurrentPage((prev) => Math.max(prev - 1, 1))
												}
												disabled={currentPage === 1}
											/>
											{[
												...Array(
													Math.ceil(userExcursions.length / ITEMS_PER_PAGE)
												).keys(),
											].map((number) => (
												<Pagination.Item
													key={number + 1}
													active={number + 1 === currentPage}
													onClick={() => setCurrentPage(number + 1)}
												>
													{number + 1}
												</Pagination.Item>
											))}
											<Pagination.Next
												onClick={() =>
													setCurrentPage((prev) =>
														Math.min(
															prev + 1,
															Math.ceil(userExcursions.length / ITEMS_PER_PAGE)
														)
													)
												}
												disabled={
													currentPage ===
													Math.ceil(userExcursions.length / ITEMS_PER_PAGE)
												}
											/>
										</Pagination>
									</div>
								)}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
export default UserPage;
