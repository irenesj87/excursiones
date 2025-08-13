/**
 * El servicio encapsula la lógica para interactuar con la API de autenticación.
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

/**
 * Inicia sesión de un usuario.
 * @param {string} mail - El correo electrónico del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<{user: object, token: string}>}
 */
export const loginUser = async (mail, password) => {
	const url = `${API_BASE_URL}/login`;
	const credentials = { mail, password };
	/** @type {RequestInit} */
	const options = {
		method: "POST",
		mode: "cors",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(credentials),
	};

	const response = await fetch(url, options);
	if (response.status === 401) {
		throw new Error("Datos incorrectos. Inténtalo de nuevo.");
	}
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "Error al iniciar sesión.");
	}
	return response.json();
};

/**
 * Registra un nuevo usuario.
 * @param {string} name - El nombre del usuario.
 * @param {string} surname - El apellido del usuario.
 * @param {string} phone - El número de teléfono del usuario.
 * @param {string} mail - El correo electrónico del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<any>}
 */
export const registerUser = async (name, surname, phone, mail, password) => {
	const url = `${API_BASE_URL}/users`;
	const user = { name, surname, phone, mail, password };
	/** @type {RequestInit} */
	const options = {
		method: "POST",
		mode: "cors",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(user),
	};

	const response = await fetch(url, options);
	if (response.status === 409) {
		throw new Error("Ya hay un usuario registrado con ese correo. Elige otro.");
	}
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "Error al registrar el usuario.");
	}
	return response.json();
};

/**
 * Verifica el estado de autenticación de un usuario validando un token de sesión.
 * @param {string | null} token - El token de sesión a validar.
 * @returns {Promise<{user: object, token: string} | null>} Un objeto con los datos del usuario y el token si es válido, o null si no hay token.
 */
export const verifyToken = async (token) => {
	if (!token) return null;

	const url = `${API_BASE_URL}/token/verify`;
	const options = {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
	};

	const response = await fetch(url, options);
	if (!response.ok) {
		const errorData = await response.json().catch(() => null);
		const errorMessage =
			errorData?.message || `Error de validación del token: ${response.status}`;
		throw new Error(errorMessage);
	}
	return response.json();
};

/**
 * Invalida la sesión/token del usuario en el servidor.
 * @param {string} token - El token de autenticación del usuario.
 */
export const logoutUser = async (token) => {
	const url = `${API_BASE_URL}/logout`;
	const options = {
		method: "DELETE",
		headers: { Authorization: `Bearer ${token}` },
	};

	const response = await fetch(url, options);
	if (!response.ok) {
		const errorData = await response.json().catch(() => null);
		const errorMessage =
			errorData?.message ||
			`El cierre de sesión en el servidor falló con estado: ${response.status}`;
		throw new Error(errorMessage);
	}
};