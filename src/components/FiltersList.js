import React, { useState, useEffect } from "react";
import FiltersListCheckbox from "./FiltersListCheckbox";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/FiltersList.module.css";

function FiltersList(props) {
	// This useState saves the filters info that is stored in the test server
	const [arrayFilters, setArrayFilters] = useState([]);

	// This useEffect brings the filters from the database with the fetch
	useEffect(() => {
		// Variable that has the url that is needed for the fetch
		const url = `http://localhost:3001/filters?type=${props.filterName}`;

		// Variable that saves the options that the fetch needs
		const options = {
			method: "GET",
			mode: "cors",
			headers: { "Content-Type": "application/json" },
		};

		fetch(url, options)
			.then((resp) => resp.json())
			.then(function (data) {
				setArrayFilters(data);
			})
			.catch(function (error) {
				console.log(error);
			});
	}, [props]);

	return (
		<ul className={styles.listInfo}>
			{arrayFilters.map((i, index) => (
				<FiltersListCheckbox
					key={index}
					filterName={props.filterName}
					filter={i}
				/>
			))}
		</ul>
	);
}

export default FiltersList;
