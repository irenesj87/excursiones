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
	// Destructure all relevant props for clarity and use in dependency array
	const { setExcursions, onFetchStart, onFetchEnd, id } = props;

	// This useEffect handles debouncing the search input
	useEffect(() => {
		const fetchData = async () => {
			// Only call onFetchStart if it's a genuine new fetch operation,
			// not just the initial load where search might be empty.
			// Or, let the parent (Layout.js) handle initial loading state separately.
			// For now, we assume onFetchStart is okay to call.
			onFetchStart?.();
			try {
				// Variable that has the url that is needed for the fetch
				const url = `http://localhost:3001/excursions?q=${search}&area=${area}&difficulty=${difficulty}&time=${time}`;
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(
						`Error HTTP ${response.status} al buscar excursiones.`
					);
				}
				const data = await response.json();
				setExcursions(data);
				onFetchEnd?.(null); // Signal fetching ended successfully
			} catch (error) {
				console.error("Fetch error in SearchBar: ", error);
				setExcursions([]); // Optionally clear excursions on error or let parent decide
				onFetchEnd?.(error); // Signal fetching ended with an error
			}
		};

		// Set a timer to delay the fetch operation
		const timerId = setTimeout(() => {
			fetchData();
		}, 1000);

		// Cleanup function to clear the timer if dependencies change before it fires
		return () => clearTimeout(timerId);
	}, [search, area, difficulty, time, setExcursions, onFetchStart, onFetchEnd]);

	return (
		<>
			<input
				id={id}
				className="form-control"
				type="search"
				placeholder="Busca excursiones..."
				onChange={introKeyPressed}
			/>
		</>
	);
}

export default SearchBar;
