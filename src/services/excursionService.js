const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

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

	const url = `${API_BASE_URL}/users/${userMail}/excursions/${excursionId}`;
	/** @type {RequestInit} */
	const options = {
		method: "PUT",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ id: excursionId }),
	};

	const response = await fetch(url, options);

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "No se pudo completar la operación.");
	}

	return response.json();
};
