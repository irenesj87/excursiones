/**
 * El servicio de autenticación encapsula la lógica para interactuar con la API relacionada con la autenticación de usuarios.
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

/**
 * Verifica el estado de autenticación de un usuario validando un token de sesión.
 * @param {string | null} token - El token de sesión a validar.
 * @returns {Promise<{user: object, token: string} | null>} - Un objeto con los datos del usuario y el token si es válido, o null si no hay token.
 * @throws {Error} - Lanza un error si la validación del token falla.
 */
export const verifyToken = async (token) => {
	if (!token) {
		return null; // No hay token, no hay nada que verificar.
	}

	// El endpoint del backend para verificar el token (ej. /verify, /auth/status)
	// debe estar preparado para recibir el token en el header.
	const url = `${API_BASE_URL}/token/verify`; // Endpoint para verificar el token
	/** @type {RequestInit} */
	const options = {
		method: "GET",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await fetch(url, options);

	if (!response.ok) {
		// Intenta obtener un mensaje de error más detallado del cuerpo de la respuesta
		const errorData = await response.json().catch(() => null); // Evita un error si el cuerpo no es JSON
		const errorMessage =
			errorData?.message || `Error de validación del token: ${response.status}`;
		throw new Error(errorMessage);
	}

	return response.json();
};
