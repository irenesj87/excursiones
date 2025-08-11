import { memo } from "react";
import { useSelector } from "react-redux";
import { SkeletonTheme } from "react-loading-skeleton";
import FiltersListCheckbox from "./FiltersListCheckbox";
import FilterPillSkeleton from "./FilterPillSkeleton";
import FilterError from "./FilterError";
import { useFilters } from "../hooks/useFilters";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/FiltersList.module.css";

/** @typedef {import("../types").RootState} RootState */

/**
 * Componente que muestra una lista de filtros para una categoría específica (ej. área, dificultad, tiempo).
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.filterName - El nombre de la categoría de filtro (ej. "area").
 * @return {React.ReactElement} El componente de la lista de filtros.
 */
function FiltersListComponent({ filterName }) {
	// Usamos el hook personalizado para obtener los datos y el estado de carga/error.
	const { data: arrayFilters, isLoading, error } = useFilters(filterName);

	const mode = useSelector(
		/** @param {RootState} state */
		(state) => state.themeReducer.mode
	);

	// Define los colores del esqueleto según el tema.
	const baseColor = mode === "dark" ? "#202020" : "#e0e0e0";
	const highlightColor = mode === "dark" ? "#444" : "#f5f5f5";

	// Muestra los esqueletos siempre que isLoading sea true.
	if (isLoading) {
		return (
			<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
				{/* Anunciamos el estado de carga a los lectores de pantalla de forma no intrusiva */}
				<div role="status" aria-live="polite" className="visually-hidden">
					Cargando filtros de {filterName}...
				</div>
				<ul className={styles.filtersGrid} aria-hidden="true">
					{/* Mostramos 4 esqueletos para simular mejor el contenido real y evitar saltos de layout */}
					{[...Array(4)].map((_, index) => (
						<li
							// eslint-disable-next-line react/no-array-index-key
							key={`skeleton-pill-${index}`}
							className={styles.filterItem}
						>
							<FilterPillSkeleton />
						</li>
					))}
				</ul>
			</SkeletonTheme>
		);
	}
	/**
	 * Muestra un mensaje de error si la carga de filtros falla.
	 */
	if (error) {
		return <FilterError />;
	}

	// Muestra la lista de filtros una vez que la carga ha terminado y no hay errores.
	return (
		<ul className={styles.filtersGrid}>
			{arrayFilters.map((filterValue) => (
				<li key={filterValue} className={styles.filterItem}>
					<FiltersListCheckbox filterName={filterName} filter={filterValue} />
				</li>
			))}
		</ul>
	);
}

const FiltersList = memo(FiltersListComponent);
export default FiltersList;
