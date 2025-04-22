import React, { useState, useEffect } from "react";
import FiltersListCheckbox from "./FiltersListCheckbox";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/FiltersList.module.css";

function FiltersList(props) {
	// useState que guarda la info de los filtros que está en el servidor
	const [arrayFilters, setArrayFilters] = useState([]);

	// useEffect que saca los filtros del servidor
	useEffect(() => {
		const fetchData = async () => {
			try {
				const url = `http://localhost:3001/filters?type=${props.filterName}`;
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
				console.log(`Fetched filters for ${props.filterName}:`, data);
				setArrayFilters(data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchData();

	}, [props.filterName]);

	return (
		<ul className={styles.listInfo}>
			{arrayFilters.map((i) => (
				<FiltersListCheckbox
					key={i}
					filterName={props.filterName}
					filter={i}
				/>
			))}
		</ul>
	);
}

export default FiltersList;
