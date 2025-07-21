import { memo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { toggleFilter } from "../slicers/filterSlice";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/FiltersListCheckbox.module.css";

/** @typedef {import("../types").RootState} RootState */

/**
 * Componente que renderiza una única opción de filtro como una "píldora" interactiva.
 * @param {{filterName: string, filter: string}} props
 * @returns {React.ReactElement}
 */
function FiltersListCheckboxComponent({ filterName, filter }) {
	const dispatch = useDispatch();

	// Obtenemos los filtros seleccionados para esta categoría (ej. 'area') desde Redux
	const selectedFilters = useSelector(
		/** @param {RootState} state */
		(state) => state.filterReducer[filterName], shallowEqual
	);

	// El filtro está seleccionado si su valor está incluido en el array del estado de Redux
	const isChecked = selectedFilters.includes(filter);

	/**
	 * Maneja el evento de cambio del checkbox.
	 * Despacha la acción `toggleFilter` para añadir o quitar el filtro del estado de Redux.
	 * @returns {void}
	 */
	const handleToggle = () => {
		// Despachamos una única acción para añadir o quitar el filtro
		dispatch(toggleFilter({ filterType: filterName, value: filter }));
	};

	/**
	 * Genera un ID único para el checkbox y su etiqueta asociada, asegurando la accesibilidad.
	 * Reemplaza los espacios en el valor del filtro con guiones para crear un ID válido.
	 */
	const id = `filter-${filterName}-${filter.replace(/\s+/g, "-")}`;

	return (
		<button
			type="button"
			role="checkbox"
			aria-checked={isChecked}
			onClick={handleToggle}
			id={id}
			className={`${styles.filterPill} ${isChecked ? styles.checked : ""}`}
		>
			{filter}
		</button>
	);
}

const FiltersListCheckbox = memo(FiltersListCheckboxComponent);

export default FiltersListCheckbox;
