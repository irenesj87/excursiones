import React, { useState, useEffect, useMemo, memo } from "react";
import { Row, Col, Alert, Pagination, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/PaginatedListDisplay.module.css";

/**
 * Componente genérico para mostrar listas con estados de carga, error y paginación.
 * @param {object} props - Propiedades del componente.
 * @param {Array<Object>} props.data - El array de elementos a mostrar.
 * @param {boolean} props.isLoading - Indica si los datos están cargando.
 * @param {string | null} props.error - Mensaje de error si ha ocurrido uno.
 * @param {(item: Object) => React.ReactNode} props.renderItem - Función que renderiza un elemento individual de la lista.
 * @param {number} props.itemsPerPage - Número de elementos a mostrar por página.
 * @param {string} [props.noItemsMessage="No hay elementos para mostrar."] - Mensaje a mostrar cuando no hay elementos.
 * @param {string} [props.loadingMessage="Cargando..."] - Mensaje a mostrar durante la carga.
 * @param {string} [props.errorMessage="Ha ocurrido un error al cargar los datos."] - Mensaje por defecto para errores.
 * @param {(item: Object) => string | number} props.itemKeyExtractor - Función para extraer una clave única de cada elemento.
 * @param {string} [props.cardClassName=""] - Clases CSS adicionales para la Card contenedora.
 * @param {string} [props.cardHeader=""] - Título del encabezado de la Card.
 * @param {Object} [props.colProps={}] - Propiedades adicionales para el componente Col que envuelve cada item.
 */
function PaginatedListDisplayComponent({
	data,
	isLoading,
	error,
	renderItem,
	itemsPerPage,
	noItemsMessage = "No hay elementos para mostrar.",
	errorMessage = "Ha ocurrido un error al cargar los datos.",
	itemKeyExtractor,
	cardClassName = "",
	cardHeader = "",
	colProps = {},
}) {
	const [currentPage, setCurrentPage] = useState(1);

	// Resetear la página actual a 1 si los datos cambian (ej. se filtra la lista)
	useEffect(() => {
		setCurrentPage(1);
	}, [data]);

	const totalPages = useMemo(() => {
		return Math.ceil(data.length / itemsPerPage);
	}, [data, itemsPerPage]);

	const currentItemsToDisplay = useMemo(() => {
		const indexOfLastItem = currentPage * itemsPerPage;
		const indexOfFirstItem = indexOfLastItem - itemsPerPage;
		return data.slice(indexOfFirstItem, indexOfLastItem);
	}, [data, currentPage, itemsPerPage]);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	// Determinar el número de columnas para Row basado en itemsPerPage (heurística simple)
	const mdCols = itemsPerPage > 1 ? 2 : 1;

	return (
		<Card
			className={`${styles.listCard} ${cardClassName} h-100 d-flex flex-column`}
		>
			{cardHeader && (
				<Card.Header className={styles.cardHeader}>{cardHeader}</Card.Header>
			)}
			<Card.Body
				className={`${styles.cardBody} d-flex flex-column flex-grow-1`}
			>
				<div className="flex-grow-1 d-flex flex-column">
					{isLoading && null}

					{error && !isLoading && (
						<div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
							<Alert variant="danger">{error || errorMessage}</Alert>
						</div>
					)}

					{!isLoading && !error && (
						<div className="d-flex flex-column flex-grow-1">
							{data.length > 0 ? (
								<Row xs={1} md={mdCols} className="g-3">
									{currentItemsToDisplay.map((item) => (
										<Col key={itemKeyExtractor(item)} {...colProps}>
											{renderItem(item)}
										</Col>
									))}
								</Row>
							) : (
								<div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
									<p className={styles.noItemsMessage}>{noItemsMessage}</p>
								</div>
							)}
						</div>
					)}
				</div>

				{!isLoading && !error && data.length > itemsPerPage && (
					<div className="d-flex justify-content-center mt-4 pt-3 border-top">
						<Pagination>
							<Pagination.Prev
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								aria-label="Ir a la página anterior"
							/>
							{Array.from(Array(totalPages).keys()).map((number) => (
								<Pagination.Item
									key={number + 1}
									active={number + 1 === currentPage}
									onClick={() => handlePageChange(number + 1)}
									aria-label={`Ir a la página ${number + 1}`}
								>
									{number + 1}
								</Pagination.Item>
							))}
							<Pagination.Next
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								aria-label="Ir a la siguiente página"
							/>
						</Pagination>
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

const PaginatedListDisplay = memo(PaginatedListDisplayComponent);
export default PaginatedListDisplay;
