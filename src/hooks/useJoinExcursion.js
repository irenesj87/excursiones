import { useState, useCallback } from "react";

/**
 * Hook para gestionar la lógica de unirse a una excursión. Encapsula el estado de carga, el manejo de errores y la llamada a la API.
 * @param {(id: string | number) => Promise<void>} onJoin - La función asíncrona del componente padre para unirse a la excursión.
 * @returns {{
 *  isJoining: boolean,
 *  joinError: string | null,
 *  handleJoin: (id: string | number) => Promise<void>,
 *  clearError: () => void
 * }}
 */
export const useJoinExcursion = (onJoin) => {
    // Variable que sirve para controlar el Spinner de carga del botón "Apuntarse". Cuando el usuario lo pulsa el botón esta 
    // variable se pone a true y el botón se deshabilita
	const [isJoining, setIsJoining] = useState(false);
    // Variable para guardar el error si la API falla
	const [joinError, setJoinError] = useState(null);

    // Función que llama el componente ExcursionCard cuando el usuario hace click en el botón para apuntarse a la excursión
	const handleJoin = useCallback(
		async (id) => {
			if (isJoining) return;
			setIsJoining(true);
			setJoinError(null);
			try {
				await onJoin?.(id);
				// El éxito es manejado por el componente padre, que actualizará `isJoined`.
				// El estado `isJoining` se resolverá cuando el componente se vuelva a renderizar sin el botón.
			} catch (error) {
				// El error técnico ya se loguea en el componente padre (Excursions.js).
				// Aquí solo nos encargamos de capturar el mensaje para la UI.
				setJoinError(
					error.message || "No se pudo completar la acción. Inténtalo de nuevo."
				);
				setIsJoining(false);
			}
		},
		[onJoin, isJoining]
	);

	const clearError = useCallback(() => setJoinError(null), []);

	return { isJoining, joinError, handleJoin, clearError };
};
