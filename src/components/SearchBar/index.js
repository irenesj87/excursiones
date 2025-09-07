import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { useSelector, shallowEqual } from "react-redux";
import { FiSearch, FiX } from "react-icons/fi";
import cn from "classnames";
import { searchExcursions } from "../../services/excursionService";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./SearchBar.module.css";

/** @typedef {import('types.js').RootState} RootState */

/** @typedef {object} SearchBarProps
 * @property {(excursions: any[]) => void} onFetchSuccess - Función para actualizar el estado de la lista de excursiones en el componente padre.
 * @property {() => void} onFetchStart - Callback que se ejecuta al iniciar la búsqueda de excursiones.
 * @property {(error: (Error & { secondaryMessage?: string }) | null) => void} onFetchEnd - Callback que se ejecuta al finalizar la búsqueda de excursiones
 * @property {string} id - ID único para el input de búsqueda, útil para accesibilidad y múltiples instancias.
 * @property {string} searchValue - El término de búsqueda actual.
 * @property {(value: string) => void} onSearchChange - Callback para actualizar el término de búsqueda.
 */

/**
 * Componente que maneja la barra de búsqueda y la aplicación de filtros para las excursiones.
 * @param {SearchBarProps} props - Las propiedades del componente.
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
				console.error(
					"Pista para el desarrollador: El servidor de la API no parece estar respondiendo. ¿Está en marcha? Revisa también la configuración de CORS."
				);
			}

			/** @type {Error & {secondaryMessage?: string}} */
			let userFriendlyError;

			// Si es un error de conexión, creamos un mensaje específico.
			if (error instanceof TypeError && error.message === "Failed to fetch") {
				userFriendlyError = new Error("Error de conexión");
				userFriendlyError.secondaryMessage =
					"No se pudo conectar con el servidor. Por favor, revisa tu conexión a internet e inténtalo de nuevo.";
			} else {
				// Para otros errores, usamos el mensaje que venga del servidor o uno genérico.
				userFriendlyError = new Error(
					error.message || "No se han podido cargar las excursiones."
				);
				userFriendlyError.secondaryMessage =
					"Por favor, inténtalo de nuevo más tarde.";
			}

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

SearchBar.propTypes = {
	onFetchSuccess: PropTypes.func.isRequired,
	onFetchStart: PropTypes.func.isRequired,
	onFetchEnd: PropTypes.func.isRequired,
	id: PropTypes.string.isRequired,
	searchValue: PropTypes.string.isRequired,
	onSearchChange: PropTypes.func.isRequired,
};

export default SearchBar;
