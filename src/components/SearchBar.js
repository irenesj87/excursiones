import { useState, useEffect, useCallback } from "react";
import { useSelector, shallowEqual } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";

/** @typedef {import('types.js').RootState} RootState */

// Componente que maneja la barra de búsqueda
function SearchBar({ setExcursions, onFetchStart, onFetchEnd, id }) {
	// Estado que almacena el texto de búsqueda introducido por el usuario.
	const [search, setSearch] = useState("");
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

	/**
	 * Función memoizada con useCallback para realizar la petición de búsqueda de excursiones.
	 * useCallback evita que esta función se recree en cada renderizado, optimizando el rendimiento.
	 * Solo se volverá a crear si alguna de sus dependencias (search, area, etc.) cambia.
	 */
	const fetchData = useCallback(async () => {
		// Llama a la función onFetchStart si se proporcionó, para indicar que la carga de excursiones ha comenzado.
		onFetchStart?.();
		try {
			// Construye la URL para la API con los parámetros de búsqueda y filtros actuales.
			const url = `http://localhost:3001/excursions?q=${search}&area=${area}&difficulty=${difficulty}&time=${time}`;
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
	}, [search, area, difficulty, time, setExcursions, onFetchStart, onFetchEnd]);

	/**
	 * useEffect que implementa la técnica de "debounce" para la búsqueda. Esto evita que se realice una petición a la API con
	 * cada tecla que el usuario presiona.
	 */
	useEffect(() => {
		// Establece un temporizador que ejecutará fetchData después de 1000ms (1 segundo).
		const timerId = setTimeout(() => {
			fetchData();
		}, 1000);
		// Función de limpieza: se ejecuta antes de que el efecto se vuelva a ejecutar o cuando el componente se desmonta.
		// Cancela el temporizador anterior para evitar que se ejecuten búsquedas innecesarias si el usuario sigue escribiendo.
		return () => clearTimeout(timerId);
	}, [fetchData]); // El efecto depende de la función fetchData memoizada. Se volverá a ejecutar solo si fetchData cambia.

	return (
		<input
			id={id}
			className="form-control"
			type="search"
			placeholder="Busca excursiones..."
			onChange={introKeyPressed}
		/>
	);
}

export default SearchBar;
