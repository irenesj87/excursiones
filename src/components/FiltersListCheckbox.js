import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { selectFilter, unselectFilter } from "../slicers/filterSlice";

function FiltersListCheckbox(props) {
	// Variable that saves if a checkbox is selected or not
	const [selected, setSelected] = useState(false);

	// Variable that we need to be able to use dispatchers
	const filterDispatch = useDispatch();

	// Function that changes the state of a checkbox, checked -> unchecked, unchecked -> checked
	const selectedCheckbox = () => {
		setSelected(!selected);

		if (selected) {
			// If the checkbox is selected, unselect it
			filterDispatch(
				unselectFilter({
					filterName: props.filterName,
					filter: props.filter,
				})
			);
		} else {
			// If it wasn't checked then select it
			filterDispatch(
				selectFilter({
					filterName: props.filterName,
					filter: props.filter,
				})
			);
		}
	};

	return (
		<li key={props.index}>
			<input type="checkbox" id={props.filter} onChange={selectedCheckbox} />{" "}
			{props.filter}
		</li>
	);
}

export default FiltersListCheckbox;
