import { useState, useEffect, useCallback } from "react";
import { useSelector, shallowEqual } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";

/** @typedef {import('types.js').RootState} RootState */

// Componente que maneja la barra de búsqueda
function SearchBar({ setExcursions, onFetchStart, onFetchEnd, id }) {
	// Estado para el texto de búsqueda inmediato del input.
	const [search, setSearch] = useState("");
	// Estado para el texto de búsqueda "debounced" (retrasado) que se usará en la API.
	const [debouncedSearch, setDebouncedSearch] = useState(search);
	// Selector de Redux que obtiene los filtros de área, dificultad y tiempo del estado `filterReducer`.
	const { area, difficulty, time } = useSelector(
		/** @param {RootState} state */
		(state) => state.filterReducer,
		shallowEqual
	);
	// Función que maneja el cambio en el input de búsqueda, actualizando el estado `search`.
	const introKeyPressed = (event) => {
		let currentSearch = event.target.value;
		setSearch(currentSearch);
	};

	// Efecto para aplicar el "debounce" al término de búsqueda.
	// Solo actualiza `debouncedSearch` cuando el usuario deja de teclear por 500ms.
	useEffect(() => {
		const timerId = setTimeout(() => {
			setDebouncedSearch(search);
		}, 500); // Un debounce de 500ms es una buena práctica.

		return () => clearTimeout(timerId);
	}, [search]);

	/**
	 * Función memoizada con useCallback para realizar la petición de búsqueda de excursiones.
	 * useCallback evita que esta función se recree en cada renderizado, optimizando el rendimiento.
	 * Ahora solo se volverá a crear si alguna de sus dependencias (debouncedSearch, area, etc.) cambia.
	 */
	const fetchData = useCallback(async () => {
		// Llama a la función onFetchStart si se proporcionó, para indicar que la carga de excursiones ha comenzado.
		onFetchStart?.();
		try {
			// Construye los parámetros de la URL de forma segura.
			// URLSearchParams se encarga de codificar los valores correctamente.
			const params = new URLSearchParams();

			// Añade el término de búsqueda si existe.
			if (debouncedSearch) {
				params.append("q", debouncedSearch);
			}
			// Añade cada filtro seleccionado. Para los arrays, se añade una entrada por cada valor.
			// Esto genera una URL como: &area=Picos%20de%20Europa&area=Pirineos
			area.forEach((value) => params.append("area", value));
			difficulty.forEach((value) => params.append("difficulty", value));
			time.forEach((value) => params.append("time", value));

			const url = `http://localhost:3001/excursions?${params.toString()}`;
			const response = await fetch(url);
			// Si la respuesta del servidor no es exitosa (ej. error 404 o 500), lanza un error.
			if (!response.ok) {
				throw new Error(`Error HTTP ${response.status} al buscar excursiones.`);
			}
			// Convierte la respuesta a JSON.
			const data = await response.json();
			// Actualiza el estado de las excursiones en el componente padre.
			setExcursions(data);
			// Llama a onFetchEnd con null para indicar que la carga terminó sin errores.
			onFetchEnd?.(null);
		} catch (error) {
			// Si ocurre un error durante la petición, lo muestra en la consola.
			console.error("Fetch error in SearchBar: ", error);
			// Opcionalmente, vacía la lista de excursiones en caso de error.
			setExcursions([]);
			// Llama a onFetchEnd con el objeto de error para que el componente padre pueda manejarlo.
			onFetchEnd?.(error);
		}
	}, [debouncedSearch, area, difficulty, time, setExcursions, onFetchStart, onFetchEnd]);

	// Este efecto se ejecuta cada vez que el término de búsqueda "debounced" o los filtros cambian.
	// De esta forma, los filtros se aplican instantáneamente, mientras que la búsqueda por texto espera.
	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<input
			id={id}
			className="form-control"
			type="search"
			placeholder="Busca excursiones..."
			onChange={introKeyPressed}
			aria-label="Buscar excursiones por texto"
		/>
	);
}

export default SearchBar;
