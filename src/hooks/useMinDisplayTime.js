import { useCallback, useRef } from "react";

/**
 * Hook que proporciona una función de dispatch que respeta un tiempo de visualización mínimo.
 * Es útil para asegurar que los indicadores de carga (esqueletos) se muestren durante un
 * tiempo perceptible, evitando parpadeos rápidos en la UI.
 *
 * @param {Function} dispatch - La función dispatch original de un `useReducer`.
 * @param {number} [minDisplayTime=300] - El tiempo mínimo de visualización en milisegundos.
 * @returns {{
 *  startTiming: () => void,
 *  dispatchWithMinDisplayTime: (action: object) => void
 * }} - Un objeto que contiene una función para iniciar el temporizador y una
 *      función de dispatch envuelta.
 */
export const useMinDisplayTime = (dispatch, minDisplayTime = 300) => {
	const startTimeRef = useRef(null);

	/**
	 * Registra el tiempo de inicio. Debe llamarse justo antes de que comience la operación asíncrona.
	 */
	const startTiming = useCallback(() => {
		startTimeRef.current = Date.now();
	}, []);

	/**
	 * Envuelve la función dispatch para retrasar su ejecución hasta que se cumpla el `minDisplayTime`.
	 * @param {object} action - La acción que se enviará al reducer.
	 */
	const dispatchWithMinDisplayTime = useCallback(
		(action) => {
			const startTime = startTimeRef.current || Date.now();
			const elapsedTime = Date.now() - startTime;
			const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

			setTimeout(() => {
				dispatch(action);
			}, remainingTime);
		},
		[dispatch, minDisplayTime]
	);

	return { startTiming, dispatchWithMinDisplayTime };
};