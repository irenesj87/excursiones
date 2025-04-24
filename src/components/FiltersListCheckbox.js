import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { selectFilter, unselectFilter } from "../slicers/filterSlice";

// Componente que controla la selección y deselección de los checkbox
function FiltersListCheckbox(props) {
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
					filterName: props.filterName,
					filter: props.filter,
				})
			);
		} else {
			// Si no está seleccionado, lo selecciona
			filterDispatch(
				selectFilter({
					filterName: props.filterName,
					filter: props.filter,
				})
			);
		}
	};

	return (
		<li>
			<input type="checkbox" id={props.filter} onChange={selectedCheckbox} />{" "}
			{props.filter}
		</li>
	);
}

export default FiltersListCheckbox;
