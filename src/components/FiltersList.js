import { useState, useEffect } from "react";
import FiltersListCheckbox from "components/FiltersListCheckbox";
import FilterPillSkeleton from "components/FilterPillSkeleton";
import FilterError from "components/FilterError";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/FiltersList.module.css";

// Define un tiempo mínimo de visualización para el esqueleto de carga para evitar parpadeos.
const MIN_LOADING_TIME = 500; // 500ms

function FiltersList({ filterName }) {
	// Estado que almacena la lista de filtros obtenidos del servidor.
	const [arrayFilters, setArrayFilters] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	// useEffect que saca los filtros del servidor según el tipo de filtro (area, difficulty, time)
	useEffect(() => {
		const fetchData = async () => {
			const startTime = Date.now(); // Registra el tiempo de inicio
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
				const remainingTime = MIN_LOADING_TIME - elapsedTime;

				if (remainingTime > 0) {
					// Si la carga fue muy rápida, espera el tiempo restante para completar el mínimo.
					setTimeout(() => setIsLoading(false), remainingTime);
				} else {
					// Si la carga tardó más que el mínimo, oculta el esqueleto inmediatamente.
					setIsLoading(false);
				}
			}
		};

		fetchData();
	}, [filterName]);

	if (isLoading) {
		return (
			<ul className={styles.filtersGrid}>
				{/* Mostramos 4 esqueletos para simular mejor el contenido real y evitar saltos de layout */}
				{[...Array(4)].map((_, index) => (
					<li key={`skeleton-pill-${index}`} className={styles.filterItem}>
						<FilterPillSkeleton />
					</li>
				))}
			</ul>
		);
	}

	if (error) {
		return <FilterError />;
	}

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

export default FiltersList;
