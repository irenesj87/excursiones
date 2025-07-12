import { useState, useEffect } from "react";
import FiltersListCheckbox from "components/FiltersListCheckbox";
import FilterPillSkeleton from "components/FilterPillSkeleton";
import FilterError from "components/FilterError";
import DelayedFallback from "components/DelayedFallback";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/FiltersList.module.css";

function FiltersList({ filterName }) {
	// Estado que almacena la lista de filtros obtenidos del servidor.
	const [arrayFilters, setArrayFilters] = useState([]);
	const [isLoading, setIsLoading] = useState(true); // Inicia como true para la carga inicial.
	const [error, setError] = useState(null);

	// useEffect que saca los filtros del servidor según el tipo de filtro (area, difficulty, time)
	useEffect(() => {
		const fetchData = async () => {
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
				setIsLoading(false);
			}
		};

		fetchData();
	}, [filterName]);

	// Muestra los esqueletos siempre que isLoading sea true.
	if (isLoading) {
		return (
			<DelayedFallback delay={0.0000000001}>
				<ul className={styles.filtersGrid}>
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
			</DelayedFallback>
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

export default FiltersList;
