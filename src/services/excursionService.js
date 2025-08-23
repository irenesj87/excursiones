const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

/**
 * Busca excursiones basadas en un texto y filtros.
 * @param {string} debouncedSearch - El término de búsqueda de texto.
 * @param {string[]} area - Filtros de área.
 * @param {string[]} difficulty - Filtros de dificultad.
 * @param {string[]} time - Filtros de tiempo.
 * @returns {Promise<any[]>} Un array de excursiones.
 */
export const searchExcursions = async (
	debouncedSearch,
	area,
	difficulty,
	time
) => {
	const params = new URLSearchParams();
	if (debouncedSearch) params.append("q", debouncedSearch);
	area.forEach((value) => params.append("area", value));
	difficulty.forEach((value) => params.append("difficulty", value));
	time.forEach((value) => params.append("time", value));

	const url = `${API_BASE_URL}/excursions?${params.toString()}`;
	const response = await fetch(url);
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		const errorMessage =
			errorData.message || `Error al buscar excursiones: ${response.status}`;
		throw new Error(errorMessage);
	}
	return response.json();
};

/**
 * Permite a un usuario unirse a una excursión.
 * @param {string} userMail - El correo del usuario.
 * @param {string | number} excursionId - El ID de la excursión.
 * @param {string | null} token - El token de autenticación del usuario.
 * @returns {Promise<object>} - Los datos del usuario actualizados.
 * @throws {Error} - Lanza un error si la operación falla.
 */
export const joinExcursion = async (userMail, excursionId, token) => {
	if (!userMail || !token) {
		throw new Error("Usuario no autenticado o información faltante.");
	}

	const url = `${API_BASE_URL}/users/${userMail}/excursions`;
	/** @type {RequestInit} */
	const options = {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ excursionId }),
	};

	const response = await fetch(url, options);

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "No se pudo completar la operación.");
	}

	return response.json();
};
