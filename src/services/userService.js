const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

/**
 * Actualiza la información de un usuario.
 * @param {string} mail - El correo del usuario a actualizar.
 * @param {object} userData - Los datos del usuario a actualizar.
 * @param {string} token - El token de autenticación.
 * @returns {Promise<object>} Los datos del usuario actualizados.
 */
export const updateUserInfo = async (mail, userData, token) => {
	const url = `${API_BASE_URL}/users/${mail}`;
	/** @type {RequestInit} */
	const options = {
		method: "PUT",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ ...userData, mail }),
	};

	const response = await fetch(url, options);
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		const errorMessage =
			errorData.message || "No se pudieron guardar los cambios.";
		throw new Error(errorMessage);
	}
	return response.json();
};