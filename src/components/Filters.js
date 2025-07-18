import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FiltersList from "./FiltersList";
import { clearAllFilters } from "../slicers/filterSlice";
import { FiMap, FiBarChart,FiClock, FiX } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Filters.module.css";
/** @typedef {import('../types').RootState} RootState */

/**
 * Componente para renderizar los filtros de búsqueda (zona, dificultad, tiempo estimado)
 * @returns {React.ReactElement} El componente para los filtros
 * @param {{showTitle?: boolean}} props - Propiedades del componente. `showTitle` controla si se muestra el título.
 */
function Filters({ showTitle = true }) {
	const dispatch = useDispatch();
	const { area, difficulty, time } = useSelector(
		/** @param {RootState} state */
		(state) => state.filterReducer
	);

	// Comprueba si hay algún filtro activo para habilitar/deshabilitar el botón
	const hasActiveFilters =
		area.length > 0 || difficulty.length > 0 || time.length > 0;

	const handleClearFilters = () => {
		dispatch(clearAllFilters());
	};

	return (
		// El contenedor principal usa flexbox para posicionar el footer abajo.
		// La clase h-100 es crucial para que ocupe toda la altura de su padre (la Col o el Offcanvas.Body)
		<div className={`${styles.filtersContainer} h-100 d-flex flex-column`}>
			{/* Contenedor para el contenido que puede hacer scroll */}
			<div className={styles.scrollableContent}>
				{showTitle && <h2 className={styles.desktopTitle}>Filtros</h2>}
				<section className={styles.filterSection}>
					<h3 className={styles.filterTitle}>
						<FiMap />
						<span>Zona</span>
					</h3>
					<FiltersList filterName="area" />
				</section>
				<section className={styles.filterSection}>
					<h3 className={styles.filterTitle}>
						<FiBarChart />
						<span>Dificultad</span>
					</h3>
					<FiltersList filterName="difficulty" />
				</section>
				<section className={styles.filterSection}>
					<h3 className={styles.filterTitle}>
						<FiClock />
						<span>Tiempo estimado</span>
					</h3>
					<FiltersList filterName="time" />
				</section>
			</div>

			{/* El footer se mantiene en la parte inferior */}
			<footer className={styles.filtersFooter}>
				<Button
					variant={hasActiveFilters ? "danger" : "secondary"}
					onClick={handleClearFilters}
					className="w-100"
					aria-label="Limpiar todos los filtros"
					disabled={!hasActiveFilters}
				>
					<FiX aria-hidden="true" className="me-2" />
					<span>Limpiar Filtros</span>
				</Button>
			</footer>
		</div>
	);
}

export default Filters;
