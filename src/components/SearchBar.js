import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";

function SearchBar(props) {
	// Variable that saves the search that the user writes in the search bar
	const [search, setSearch] = useState("");
	// Variable that saves the filters stored in the test server
	const { area, difficulty, time } = useSelector(
		(state) => state.filterReducer
	);
	// Function that saves the information from the search bar input and updates its state
	const introKeyPressed = (event) => {
		let currentSearch = event.target.value;
		setSearch(currentSearch);
	};
	// We need this variable in order to avoid a warning in the navigator
	const { setExcursions } = props;

	// This useEffect helps with the searching of an excursion
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Variable that has the url that is needed for the fetch
				const url = `http://localhost:3001/excursions?q=${search}&area=${area}&difficulty=${difficulty}&time=${time}`;
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error("HTTP error " + response.status);
				}
				const data = await response.json();
				setExcursions(data);
			} catch (error) {
				console.log("Fetch error: ", error);
			}
		};

		fetchData();
	}, [search, area, difficulty, time, setExcursions]);

	return (
		<>
			<input
				id="searchBar"
				className="form-control"
				type="search"
				placeholder="Búsqueda"
				onChange={introKeyPressed}
			/>
		</>
	);
}

export default SearchBar;
