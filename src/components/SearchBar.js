import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { FiSearch, FiX } from "react-icons/fi";
import cn from "classnames";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/SearchBar.module.css";

/** @typedef {import('types.js').RootState} RootState */

/**
 * Componente que maneja la barra de búsqueda y la aplicación de filtros para las excursiones.
 * @param {object} props - Las propiedades del componente.
 * @param {(excursions: any[]) => void} props.setExcursions - Función para actualizar el estado de la lista de excursiones en el componente padre.
 * @param {() => void} props.onFetchStart - Callback que se ejecuta al iniciar la búsqueda de excursiones.
 * @param {(error: Error | null) => void} props.onFetchEnd - Callback que se ejecuta al finalizar la búsqueda de excursiones.
 * @param {string} props.id - ID único para el input de búsqueda, útil para accesibilidad y múltiples instancias.
 */
function SearchBar({ setExcursions, onFetchStart, onFetchEnd, id }) {
	// Estado para el texto de búsqueda inmediato del input.
	const [search, setSearch] = useState("");
	// Estado para el texto de búsqueda "debounced" (retrasado) que se usará en la API.
	const [debouncedSearch, setDebouncedSearch] = useState(search);
	// Ref para el input de búsqueda para poder enfocarlo programáticamente.
	const searchInputRef = useRef(null);
	// Selector de Redux que obtiene los filtros de área, dificultad y tiempo del estado `filterReducer`.
	const { area, difficulty, time } = useSelector(
		/** @param {RootState} state */
		(state) => state.filterReducer,
		shallowEqual
	);
	/**
	 * Maneja el evento `onChange` del input de búsqueda, actualizando el estado `search`.
	 * @param {React.ChangeEvent<HTMLInputElement>} event - El evento de cambio del input.
	 */
	// Función que maneja el cambio en el input de búsqueda, actualizando el estado `search`.
	const introKeyPressed = (event) => {
		setSearch(event.target.value);
	};

	/**
	 * Limpia el contenido del input de búsqueda y da el foco al mismo.
	 */
	const handleClearSearch = () => {
		setSearch("");
		// Damos el foco al input para mejorar la experiencia de usuario.
		searchInputRef.current?.focus();
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
	}, [
		debouncedSearch,
		area,
		difficulty,
		time,
		setExcursions,
		onFetchStart,
		onFetchEnd,
	]);

	// Este efecto se ejecuta cada vez que el término de búsqueda "debounced" o los filtros cambian.
	// De esta forma, los filtros se aplican instantáneamente, mientras que la búsqueda por texto espera.
	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<form
			role="search"
			className={styles.searchContainer}
			// Prevenimos el envío del formulario por defecto, ya que la búsqueda es dinámica.
			onSubmit={(e) => e.preventDefault()}
		>
			<label htmlFor={id} className="visually-hidden">
				Buscar excursiones por texto
			</label>
			<FiSearch className={styles.searchIcon} aria-hidden="true" />
			<input
				ref={searchInputRef}
				id={id}
				className={cn("form-control", styles.searchInput)}
				type="search"
				placeholder="Busca excursiones..."
				value={search}
				onChange={introKeyPressed}
			/>
			{search && (
				<button
					type="button"
					className={styles.clearButton}
					onClick={handleClearSearch}
					aria-label="Limpiar búsqueda"
				>
					<FiX />
				</button>
			)}
		</form>
	);
}

export default SearchBar;
