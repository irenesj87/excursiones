import { useDispatch, useSelector } from "react-redux";
import { toggleFilter } from "../slicers/filterSlice"; // Asumimos una acción 'toggleFilter' para simplicidad
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/FiltersListCheckbox.module.css";

/** @typedef {import("../types").RootState} RootState */

/**
 * Componente que renderiza una única opción de filtro como una "píldora" interactiva.
 * @param {{filterName: string, filter: string}} props
 * @returns {React.ReactElement}
 */
function FiltersListCheckbox({ filterName, filter }) {
	const dispatch = useDispatch();

	// Obtenemos los filtros seleccionados para esta categoría (ej. 'area') desde Redux
	const selectedFilters = useSelector(
		/** @param {RootState} state */
		(state) => state.filterReducer[filterName]
	);

	// El filtro está seleccionado si su valor está incluido en el array del estado de Redux
	const isChecked = selectedFilters.includes(filter);

	const handleToggle = () => {
		// Despachamos una única acción para añadir o quitar el filtro
		dispatch(toggleFilter({ filterType: filterName, value: filter }));
	};

	// Creamos un ID único para la accesibilidad del input y el label
	const id = `filter-${filterName}-${filter.replace(/\s+/g, "-")}`;

	return (
		<>
			<input
				type="checkbox"
				id={id}
				className={styles.hiddenCheckbox}
				checked={isChecked}
				onChange={handleToggle}
			/>
			<label htmlFor={id} className={styles.filterLabel}>
				{filter}
			</label>
		</>
	);
}

export default FiltersListCheckbox;
