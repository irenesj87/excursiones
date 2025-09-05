import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFilter } from "../../slices/filterSlice";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./FiltersListCheckbox.module.css";

/** @typedef {import("../../types").RootState} RootState */

/**
 * Componente que renderiza una única opción de filtro como una "píldora" interactiva.
 * @param {object} props
 * @param {string} props.filterName - El nombre de la categoría de filtro (ej. "area").
 * @param {string} props.filter - El valor específico del filtro (ej. "Picos de Europa").
 * @returns {React.ReactElement}
 */
function FiltersListCheckboxComponent({ filterName, filter }) {
	const dispatch = useDispatch();

	// Obtenemos los filtros seleccionados para esta categoría (ej. 'area') desde Redux
	const selectedFilters = useSelector(
		/** @param {RootState} state */
		(state) => state.filterReducer[filterName]
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
		// Usamos un fragmento para agrupar el input y la etiqueta sin añadir un div extra al DOM.
		<>
			<input
				type="checkbox"
				id={id}
				name={filterName}
				value={filter}
				checked={isChecked}
				onChange={handleToggle}
				className={styles.visuallyHidden}
			/>
			<label
				htmlFor={id}
				className={`${styles.filterPill} ${isChecked ? styles.checked : ""}`}
			>
				{filter}
			</label>
		</>
	);
}

const FiltersListCheckbox = memo(FiltersListCheckboxComponent);

export default FiltersListCheckbox;
