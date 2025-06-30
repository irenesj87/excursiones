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

	// Es mejor práctica enviar el token en el header de autorización.
	// const url = `${API_BASE_URL}/verify`; // Endpoint de ejemplo
	// const options = {
	// 	method: "GET",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 		Authorization: `Bearer ${token}`,
	// 	},
	// };

	// Usando la implementación actual con el token en la URL
	const url = `${API_BASE_URL}/token/${token}`;
	/** @type {RequestInit} */
	const options = {
		method: "GET",
		mode: "cors",
		headers: { "Content-Type": "application/json" },
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
