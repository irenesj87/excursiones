import { memo } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import FiltersListCheckbox from "../FiltersListCheckbox/FilterListCheckbox";
import FilterPillSkeleton from "./FilterPillSkeleton";
import FilterError from "../FilterError/FilterError";
import { useFilters } from "../../hooks/useFilters";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./FiltersList.module.css";

/** @typedef {import("../../types").RootState} RootState */

/** @typedef {object} FiltersListProps
 * @property {string} filterName - El nombre de la categoría de filtro (ej. "area").
 */

/**
 * Componente que muestra una lista de filtros para una categoría específica (ej. área, dificultad, tiempo).
 * @param {FiltersListProps} props - Las propiedades del componente.
 * @return {React.ReactElement} El componente de la lista de filtros.
 */
function FiltersListComponent({ filterName }) {
	// Usamos el hook personalizado para obtener los datos y el estado de carga/error.
	const { data: arrayFilters, isLoading, error } = useFilters(filterName);
	// Usamos el hook personalizado para obtener los colores del esqueleto según el tema.
	const skeletonThemeProps = useSkeletonTheme();

	// Muestra los esqueletos siempre que isLoading sea true.
	if (isLoading) {
		return (
			<SkeletonTheme {...skeletonThemeProps}>
				{/* Anunciamos el estado de carga a los lectores de pantalla de forma semántica */}
				<output aria-live="polite" className="visually-hidden">
					Cargando filtros de {filterName}...
				</output>
				<ul className={styles.filtersGrid} aria-hidden="true">
					{/* Mostramos 4 esqueletos para simular mejor el contenido real y evitar saltos de layout */}
					{[...Array(4)].map((_, index) => (
						<li
							// eslint-disable-next-line react/no-array-index-key
							key={`skeleton-pill-${index}`}
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
		return <FilterError error={error} />;
	}

	// Muestra la lista de filtros una vez que la carga ha terminado y no hay errores.
	return (
		<ul className={styles.filtersGrid}>
			{arrayFilters.map((filterValue) => (
				<li key={filterValue}>
					<FiltersListCheckbox filterName={filterName} filter={filterValue} />
				</li>
			))}
		</ul>
	);
}

const FiltersList = memo(FiltersListComponent);

export default FiltersList;
