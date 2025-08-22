import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { FiSearch, FiX } from "react-icons/fi";
import cn from "classnames";
import { searchExcursions } from "../services/excursionService";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/SearchBar.module.css";

/** @typedef {import('types.js').RootState} RootState */

/**
 * Componente que maneja la barra de búsqueda y la aplicación de filtros para las excursiones.
 * @param {object} props - Las propiedades del componente.
 * @param {(excursions: any[]) => void} props.onFetchSuccess - Función para actualizar el estado de la lista de excursiones en el componente padre.
 * @param {() => void} props.onFetchStart - Callback que se ejecuta al iniciar la búsqueda de excursiones.
 * @param {(error: (Error & { secondaryMessage?: string }) | null) => void} props.onFetchEnd - Callback que se ejecuta al finalizar la búsqueda de excursiones
 * @param {string} props.id - ID único para el input de búsqueda, útil para accesibilidad y múltiples instancias.
 * @param {string} props.searchValue - El término de búsqueda actual.
 * @param {(value: string) => void} props.onSearchChange - Callback para actualizar el término de búsqueda.
 */
function SearchBar({
	onFetchSuccess,
	onFetchStart,
	onFetchEnd,
	id,
	searchValue,
	onSearchChange,
}) {
	// Estado para el texto de búsqueda "debounced" (retrasado) que se usará en la API.
	const [debouncedSearch, setDebouncedSearch] = useState(searchValue);
	// Ref para el input de búsqueda para poder enfocarlo programáticamente.
	const searchInputRef = useRef(null);
	// Selector de Redux que obtiene los filtros de área, dificultad y tiempo del estado `filterReducer`.
	const { area, difficulty, time } = useSelector(
		/** @param {RootState} state */ (state) => state.filterReducer,
		shallowEqual
	);
	/**
	 * Maneja el evento `onChange` del input de búsqueda, actualizando el estado `search`.
	 * @param {React.ChangeEvent<HTMLInputElement>} event - El evento de cambio del input.
	 */
	// Función que maneja el cambio en el input de búsqueda, actualizando el estado `search`.
	const handleSearchChange = (event) => {
		onSearchChange(event.target.value);
	};

	/**
	 * Limpia el contenido del input de búsqueda y da el foco al mismo.
	 */
	const handleClearSearch = () => {
		onSearchChange("");
		// Damos el foco al input para mejorar la experiencia de usuario.
		searchInputRef.current?.focus();
	};

	// Efecto para aplicar el "debounce" al término de búsqueda.
	// Solo actualiza `debouncedSearch` cuando el usuario deja de teclear por 500ms.
	useEffect(() => {
		const timerId = setTimeout(() => {
			setDebouncedSearch(searchValue);
		}, 500); // Un debounce de 500ms es una buena práctica.

		return () => clearTimeout(timerId);
	}, [searchValue]);

	/**
	 * Función memoizada con useCallback para realizar la petición de búsqueda de excursiones.
	 * useCallback evita que esta función se recree en cada renderizado, optimizando el rendimiento.
	 * Ahora solo se volverá a crear si alguna de sus dependencias (debouncedSearch, area, etc.) cambia.
	 */
	const fetchData = useCallback(async () => {
		// Llama a la función onFetchStart si se proporcionó, para indicar que la carga de excursiones ha comenzado.
		onFetchStart?.();
		try {
			const data = await searchExcursions(
				debouncedSearch,
				area,
				difficulty,
				time
			);
			// Actualiza el estado de las excursiones en el componente padre.
			onFetchSuccess(data);
			// Llama a onFetchEnd con null para indicar que la carga terminó sin errores.
			onFetchEnd?.(null);
		} catch (error) {
			// Si ocurre un error durante la petición, lo muestra en la consola.
			// Logueamos el error original para depuración.
			console.error("Error técnico al buscar excursiones:", error);
			// Opcionalmente, vacía la lista de excursiones en caso de error.
			onFetchSuccess([]);

			// Si es un error de conexión, podemos añadir un log más específico para el desarrollador.
			if (error instanceof TypeError && error.message === "Failed to fetch") {
				console.error("Pista para el desarrollador: El servidor de la API no parece estar respondiendo. ¿Está en marcha? Revisa también la configuración de CORS.");
			}

			/** @type {Error & {secondaryMessage?: string}} */
			// Creamos un error amigable para la UI, intentando usar el mensaje del error original.
			const userFriendlyError = new Error(
				error.message || "No se han podido cargar las excursiones."
			);
			userFriendlyError.secondaryMessage = "Por favor, inténtalo de nuevo más tarde o revisa tu conexión a internet.";

			// Pasamos el error amigable a la UI para que se muestre
			onFetchEnd?.(userFriendlyError);
		}
	}, [
		debouncedSearch,
		area,
		difficulty,
		time,
		onFetchSuccess,
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
				value={searchValue}
				onChange={handleSearchChange}
			/>
			{searchValue && (
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
