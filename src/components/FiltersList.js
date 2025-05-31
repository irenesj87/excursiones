import { useState, useEffect } from "react";
import FiltersListCheckbox from "./FiltersListCheckbox";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/FiltersList.module.css";

function FiltersList({filterName}) {
	// useState que controla el array de filtros
	const [arrayFilters, setArrayFilters] = useState([]);

	// useEffect que saca los filtros del servidor según el tipo de filtro (area, difficulty, time)
	useEffect(() => {
		const fetchData = async () => {
			try {
				const url = `http://localhost:3001/filters?type=${filterName}`;
				const options = {
					method: "GET",
					mode: "cors",
					headers: { "Content-Type": "application/json" },
				};

				const response = await fetch(url, options);
				if (!response.ok) {
					throw new Error("HTTP error " + response.status);
				}
				const data = await response.json();
				setArrayFilters(data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchData();

	}, [filterName]);

	return (
		<ul className={styles.listInfo}>
			{arrayFilters.map((i) => (
				<FiltersListCheckbox
					key={i}
					filterName={filterName}
					filter={i}
				/>
			))}
		</ul>
	);
}

FiltersList.propTypes = {
	filterName: PropTypes.string.isRequired,
};

export default FiltersList;
