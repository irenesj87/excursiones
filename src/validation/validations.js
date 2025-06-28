/**
 * Valida que el nombre no esté vacío después de quitarle los espacios en blanco.
 * @param {string} name - El nombre a validar.
 * @returns {boolean} - Retorna true si el nombre es válido, de lo contrario false.
 */
export function validateName(name) {
	return name.trim() !== "";
}

/**
 * Valida que el apellido no esté vacío después de quitarle los espacios en blanco.
 * @param {string} surname - El apellido a validar.
 * @returns {boolean} - Retorna true si el apellido es válido, de lo contrario false.
 */
export function validateSurname(surname) {
	return surname.trim() !== "";
}

/**
 * Valida el formato de un número de teléfono español.
 * Acepta formatos con o sin prefijo (+34), con o sin paréntesis, y con o sin espacios/guiones.
 * @param {string} phone - El número de teléfono a validar.
 * @returns {boolean} - Retorna true si el teléfono es válido, de lo contrario false.
 */
export function validatePhone(phone) {
	const validPhone = /^(\(\+?34\))?\s?(?:6\d|7[1-9])\d(-|\s)?\d{3}(-|\s)?\d{3}$/;

	return validPhone.test(phone);
}

/**
 * Valida el formato de una dirección de correo electrónico.
 * @param {string} mail - El correo electrónico a validar.
 * @returns {boolean} - Retorna true si el correo es válido, de lo contrario false.
 */
export function validateMail(mail) {
	/**
	 * Expresión regular simplificada para la validación de email.
	 * Se han eliminado los casos para emails con IPs (ej: usuario@[192.168.1.1]) y partes locales entre comillas
	 * (ej: "nombre con espacios"@dominio.com) para reducir la complejidad y evitar posibles ataques ReDoS.
	 */
	const validMail = /^([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)@(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,})$/;
	return validMail.test(mail);
}

/**
 * Valida la fortaleza de una contraseña.
 * La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra y un número.
 * @param {string} password - La contraseña a validar.
 * @returns {boolean} - Retorna true si la contraseña es válida, de lo contrario false.
 */
export function validatePassword(password) {
	const validPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
	return validPassword.test(password);
}

/**
 * Comprueba que dos contraseñas coincidan y que la segunda contraseña cumpla con los requisitos de validación.
 * @param {string} password - La contraseña original.
 * @param {string} samePassword - La contraseña de confirmación.
 * @returns {boolean} - Retorna true si ambas contraseñas son iguales y válidas, de lo contrario false.
 */
export function validSamePassword(password, samePassword) {
	return validatePassword(samePassword) && password === samePassword;
}
