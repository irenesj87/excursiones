import React, { useState, useCallback } from "react";
import { Col, Button, Offcanvas, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FiFilter } from "react-icons/fi";
import Filters from "../Filters"; // Asumiendo que Filters está en su propia carpeta
import ExcursionsList from "../ExcursionsList/ExcursionsList"; // Renombramos la importación
import layoutStyles from "../Layout/Layout.module.css";

/** @typedef {import('../../types').RootState} RootState */

/**
 * Componente para la página de excursiones que muestra los filtros y la lista de excursiones.
 * @typedef {import('../../types').Excursion} Excursion
 * @typedef {{data: Excursion[], isLoading: boolean, error: (Error & { secondaryMessage?: string }) | null}} ExcursionsState
 * @param {{excursionsState: ExcursionsState}} props
 * @returns {React.ReactElement}
 */
const ExcursionsPage = ({ excursionsState }) => {
	// Estado y manejadores para el Offcanvas de filtros en móvil
	const [showFilters, setShowFilters] = useState(false);
	const handleCloseFilters = useCallback(() => setShowFilters(false), []);
	const handleShowFilters = useCallback(() => setShowFilters(true), []);

	// Se obtienen los filtros activos del estado global de Redux.
	const activeFilterCount = useSelector(
		/** @param {RootState} state */
		(state) =>
			state.filterReducer.area.length +
			state.filterReducer.difficulty.length +
			state.filterReducer.time.length
	);

	// Texto para el contador de filtros.
	const filterCountText =
		activeFilterCount === 1 ? "seleccionado" : "seleccionados";

	// La lista de excursiones.
	const excursionsList = (
		<ExcursionsList
			excursionData={excursionsState.data}
			isLoading={excursionsState.isLoading}
			error={excursionsState.error}
		/>
	);

	return (
		<>
			{/* Columna de filtros visible a partir de 'md' en adelante */}
			<Col
				as="aside"
				md={4}
				lg={3}
				xl={2}
				className="d-none d-md-block ps-md-0 pe-md-0"
			>
				<Filters />
			</Col>
			{/* Contenido principal */}
			<Col
				xs={12}
				md={8}
				lg={9}
				xl={10}
				className="d-flex flex-column position-relative"
			>
				{/* Botón para mostrar filtros (visible hasta 'md') */}
				<div className="d-grid d-md-none mt-3 mb-1">
					<Button
						variant="outline-secondary"
						onClick={handleShowFilters}
						className={layoutStyles.filtersToggleButton}
					>
						<FiFilter className="me-2" />
						<span>
							Mostrar Filtros
							{activeFilterCount > 0 && (
								<Badge
									pill
									bg={null}
									className={`${layoutStyles.filterBadge} ms-2`}
								>
									{activeFilterCount} {filterCountText}
								</Badge>
							)}
						</span>
					</Button>
				</div>
				{excursionsList}
				{/* Menú Offcanvas para los filtros en breakpoints hasta 'md'. */}
				<Offcanvas
					show={showFilters}
					onHide={handleCloseFilters}
					placement="start"
					className="d-md-none"
				>
					<Offcanvas.Header closeButton>
						<Offcanvas.Title>Filtros</Offcanvas.Title>
					</Offcanvas.Header>
					<Offcanvas.Body className="d-flex flex-column">
						<Filters showTitle={false} />
					</Offcanvas.Body>
				</Offcanvas>
			</Col>
		</>
	);
};

export default ExcursionsPage;
