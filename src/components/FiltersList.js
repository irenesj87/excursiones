import { useState, useEffect, memo } from "react";
import { useSelector } from "react-redux";
import { SkeletonTheme } from "react-loading-skeleton";
import FiltersListCheckbox from "./FiltersListCheckbox";
import FilterPillSkeleton from "./FilterPillSkeleton";
import FilterError from "./FilterError";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/FiltersList.module.css";

/** @typedef {import("../types").RootState} RootState */

/**
 * Componente que muestra una lista de filtros para una categoría específica (ej. área, dificultad, tiempo).
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.filterName - El nombre de la categoría de filtro (ej. "area").
 */
function FiltersListComponent({ filterName }) {
	// Estado que almacena la lista de filtros obtenidos del servidor.
	const [arrayFilters, setArrayFilters] = useState([]);
	const [isLoading, setIsLoading] = useState(true); // Inicia como true para la carga inicial.
	const [error, setError] = useState(null);

	const mode = useSelector(
		/** @param {RootState} state */
		(state) => state.themeReducer.mode
	);

	// Define los colores del esqueleto según el tema.
	const baseColor = mode === "dark" ? "#202020" : "#e0e0e0";
	const highlightColor = mode === "dark" ? "#444" : "#f5f5f5";

	/**
	 * Efecto que se encarga de obtener los datos de los filtros desde el servidor.
	 */
	useEffect(() => {
		const fetchData = async () => {
			// Guardamos el tiempo de inicio para asegurar una duración mínima de la animación de carga.
			const startTime = Date.now();

			setIsLoading(true);
			setError(null);

			try {
				const url = `http://localhost:3001/filters?type=${filterName}`;
				/** @type {RequestInit} */
				const options = {
					method: "GET",
					mode: "cors",
					headers: { "Content-Type": "application/json" },
				};

				const response = await fetch(url, options);
				if (!response.ok) {
					throw new Error(`Error HTTP ${response.status}`);
				}
				const data = await response.json();
				setArrayFilters(data);
			} catch (err) {
				console.error(`Error al cargar los filtros para "${filterName}":`, err);
				setError(err);
			} finally {
				const elapsedTime = Date.now() - startTime;
				const minimumLoadingTime = 300; // 300ms de retardo mínimo
				const remainingTime = minimumLoadingTime - elapsedTime;

				// Esperamos el tiempo restante para asegurar que el esqueleto se vea al menos 300ms.
				setTimeout(() => {
					setIsLoading(false);
				}, Math.max(0, remainingTime));
			}
		};

		fetchData();
	}, [filterName]);

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
