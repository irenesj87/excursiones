import React, { useState, useCallback } from "react";
import { Col, Button, Offcanvas, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FiFilter } from "react-icons/fi";
import Filters from "../Filters";
import ExcursionsList from "../ExcursionsList";
import styles from "./ExcursionsPage.module.css";

/** @typedef {import('../../types').RootState} RootState */

/**
 * Componente para la página de excursiones que muestra los filtros y la lista de excursiones.
 * @typedef {import('../../types').Excursion} Excursion
 * @typedef {{data: Excursion[], isLoading: boolean, error: (Error & { secondaryMessage?: string }) | null}} ExcursionsState
 * @param {{excursionsState: ExcursionsState}} props - Las propiedades del componente, que incluyen el estado de las excursiones.
 * @returns {React.ReactElement} - El componente de la página de excursiones.
 */
const ExcursionsPage = ({ excursionsState }) => {
	/**
	 * Estado para controlar la visibilidad del menú de filtros en breakpoints pequeños.
	 * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
	 */
	const [showFilters, setShowFilters] = useState(false);
	/**
	 * Cierra el menú de filtros. Memoizada con `useCallback`.
	 * @type {() => void}
	 */
	const handleCloseFilters = useCallback(() => setShowFilters(false), []);
	/**
	 * Muestra el menú de filtros. Memoizada con `useCallback`.
	 * @type {() => void}
	 */
	const handleShowFilters = useCallback(() => setShowFilters(true), []);

	/**
	 * Calcula el número total de filtros activos (área, dificultad, tiempo) desde el estado de Redux.
	 * @type {number}
	 */
	const activeFilterCount = useSelector(
		/**
		 * @param {RootState} state - El estado global de la aplicación Redux.
		 * @returns {number} El número total de filtros activos.
		 */
		(state) =>
			state.filterReducer.area.length +
			state.filterReducer.difficulty.length +
			state.filterReducer.time.length
	);

	// Texto para el contador de filtros.
	const filterCountText =
		activeFilterCount === 1 ? "seleccionado" : "seleccionados";

	/** @type {string} Texto dinámico para el `aria-label` del botón de filtros, mejorando la accesibilidad. */
	const ariaFilterLabel = `Mostrar filtros. ${activeFilterCount} ${
		activeFilterCount === 1 ? "filtro aplicado" : "filtros aplicados"
	}.`;

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
				<div
					className={`d-grid d-md-none sticky-top py-2 px-3 ${styles.mobileFiltersBar}`}
				>
					<Button
						variant="outline-secondary"
						onClick={handleShowFilters}
						className={`w-100 ${styles.filtersToggleButton}`}
						aria-controls="mobile-filters-offcanvas"
						aria-label={ariaFilterLabel}
					>
						{/* Ocultamos el contenido visual a los lectores de pantalla para evitar redundancia,
						ya que el aria-label ya proporciona toda la información necesaria. */}
						<FiFilter className="me-2" aria-hidden="true" />
						<span aria-hidden="true">
							Mostrar Filtros
							{activeFilterCount > 0 && (
								<Badge pill bg={null} className={`${styles.filterBadge} ms-2`}>
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
					id="mobile-filters-offcanvas"
					aria-labelledby="mobile-filters-title"
				>
					<Offcanvas.Header closeButton>
						<Offcanvas.Title id="mobile-filters-title">Filtros</Offcanvas.Title>
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
