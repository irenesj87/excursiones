import { useReducer, useCallback } from "react";
import { useMinDisplayTime } from "./useMinDisplayTime";

const excursionsInitialState = {
	data: [],
	isLoading: true,
	error: null,
};

/**
 * Reducer para manejar el estado de las excursiones.
 * @param {object} state - El estado actual.
 * @param {object} action - La acción a despachar.
 */
const excursionsReducer = (state, action) => {
	switch (action.type) {
		case "FETCH_START":
			return { ...state, isLoading: true, error: null };
		case "FETCH_SUCCESS":
			return { ...state, isLoading: false, data: action.payload };
		case "FETCH_ERROR":
			return { ...state, isLoading: false, error: action.payload, data: [] };
		default:
			throw new Error(`Acción no soportada: ${action.type}`);
	}
};

/**
 * Hook para manejar el estado del fetching de las excursiones.
 * @returns {{
 *  excursionsState: {data: any[], isLoading: boolean, error: any},
 *  handleExcursionsFetchStart: () => void,
 *  handleExcursionsFetchSuccess: (excursions: any[]) => void,
 *  handleExcursionsFetchEnd: (error: any) => void
 * }}
 */
export const useExcursions = () => {
	const [excursionsState, excursionsDispatch] = useReducer(
		excursionsReducer,
		excursionsInitialState
	);
	const { startTiming, dispatchWithMinDisplayTime } = useMinDisplayTime(
		excursionsDispatch,
		500
	);

	/**
	 * Inicia el proceso de carga de excursiones.
	 */
	const handleExcursionsFetchStart = useCallback(() => {
		startTiming();
		excursionsDispatch({ type: "FETCH_START" });
	}, [startTiming]);

	/**
	 * Maneja el éxito de la carga de excursiones.
	 * Despacha la acción de éxito después de un tiempo mínimo de visualización.
	 * @param {Array} excursions - Los datos de las excursiones cargadas.
	 */
	const handleExcursionsFetchSuccess = useCallback(
		(excursions) => {
			dispatchWithMinDisplayTime({
				type: "FETCH_SUCCESS",
				payload: excursions,
			});
		},
		[dispatchWithMinDisplayTime]
	);

	/**
	 * Maneja el final de la carga de excursiones, incluyendo errores.
	 * Despacha la acción de error si existe.
	 */
	const handleExcursionsFetchEnd = useCallback(
		(error) => {
			if (error) {
				dispatchWithMinDisplayTime({ type: "FETCH_ERROR", payload: error });
			}
		},
		[dispatchWithMinDisplayTime]
	);

	return {
		excursionsState,
		handleExcursionsFetchStart,
		handleExcursionsFetchSuccess,
		handleExcursionsFetchEnd,
	};
};
