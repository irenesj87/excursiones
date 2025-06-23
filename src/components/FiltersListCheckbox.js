import { useState } from "react";
import { useDispatch } from "react-redux";
import { selectFilter, unselectFilter } from "../slicers/filterSlice";

// Componente que controla la selección y deselección de los checkbox
function FiltersListCheckbox({ filterName, filter }) {
	// Variable para saber si un checkbox está seleccionado o no
	const [selected, setSelected] = useState(false);
	const filterDispatch = useDispatch();

	// Función que cambia el estado del checkbox
	const selectedCheckbox = () => {
		setSelected(!selected);

		if (selected) {
			// Si el checkbox está seleccionado, lo deselecciona
			filterDispatch(
				unselectFilter({
					filterName: filterName,
					filter: filter,
				})
			);
		} else {
			// Si no está seleccionado, lo selecciona
			filterDispatch(
				selectFilter({
					filterName: filterName,
					filter: filter,
				})
			);
		}
	};

	return (
		<li>
			<label htmlFor={filter}>
				<input type="checkbox" id={filter} onChange={selectedCheckbox} />{" "}
				{filter}
			</label>
		</li>
	);
}

export default FiltersListCheckbox;
