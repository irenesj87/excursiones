import { useEffect, useReducer } from "react";
import { useMinDisplayTime } from "./useMinDisplayTime";
import { fetchFilters } from "../services/filterService";

/**
 * @typedef {object} FiltersState
 * @property {any[]} data - Los datos de los filtros.
 * @property {boolean} isLoading - Indica si los datos se están cargando.
 * @property {Error | null} error - Almacena un error si la carga falla.
 * Estado inicial para el reducer que gestiona la carga de filtros.
 */
const initialState = {
	data: [],
	isLoading: true,
	error: null,
};

/**
 * Reducer para manejar el estado de la obtención de filtros.
 * @param {FiltersState} state - El estado actual.
 * @param {{type: string, payload?: any}} action - La acción a despachar, con un tipo y una carga útil opcional.
 * @returns {FiltersState} El nuevo estado.
 */
function filtersReducer(state, action) {
	switch (action.type) {
		case "FETCH_INIT":
			return { ...initialState, isLoading: true };
		case "FETCH_SUCCESS":
			return { ...state, isLoading: false, data: action.payload, error: null };
		case "FETCH_FAILURE":
			return { ...state, isLoading: false, error: action.payload, data: [] };
		default:
			throw new Error(`Acción no soportada: ${action.type}`);
	}
}

/**
 * Hook personalizado para obtener los filtros de una categoría específica.
 * @param {string} filterName - El nombre de la categoría de filtro (ej. "area").
 * @returns {FiltersState} El estado de los filtros, que incluye los datos, el estado de carga y cualquier error.
 */
export function useFilters(filterName) {
	const [state, dispatch] = useReducer(filtersReducer, initialState);
	const { startTiming, dispatchWithMinDisplayTime } = useMinDisplayTime(
		dispatch,
		300
	);

	useEffect(() => {
		let isMounted = true; // Flag para rastrear el estado de montaje

		const fetchData = async () => {
			startTiming();
			dispatch({ type: "FETCH_INIT" });

			try {
				const data = await fetchFilters(filterName);
				if (isMounted) {
					dispatchWithMinDisplayTime({ type: "FETCH_SUCCESS", payload: data });
				}
			} catch (error) {
				// Logueamos el error original para depuración.
				console.error(
					`Error al cargar los filtros para "${filterName}":`,
					error
				);

				// Si es un error de conexión, podemos añadir un log más específico para el desarrollador.
				if (error instanceof TypeError && error.message === "Failed to fetch") {
					console.error(
						"Pista para el desarrollador: El servidor de la API no parece estar respondiendo. ¿Está en marcha?"
					);
				}
				if (isMounted) {
					// Creamos un error genérico y amigable para mostrar siempre en la UI.
					const finalError = new Error("No se pudieron cargar los filtros.");
					dispatchWithMinDisplayTime({
						type: "FETCH_FAILURE",
						payload: finalError,
					});
				}
			}
		};

		fetchData();

		// Función de limpieza que se ejecuta al desmontar
		return () => {
			isMounted = false;
		};
	}, [filterName, dispatchWithMinDisplayTime, startTiming]);

	return state;
}
