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
	// Reutiliza la misma lógica de validación que para el nombre para evitar duplicación.
	return validateName(surname);
}

/**
 * Valida el formato de un número de teléfono español.
 * Acepta formatos con o sin prefijo (+34), con o sin paréntesis, y con o sin espacios/guiones.
 * @param {string} phone - El número de teléfono a validar.
 * @returns {boolean} - Retorna true si el teléfono es válido, de lo contrario false.
 */
export function validatePhone(phone) {
	const validPhone =
		/^(\(\+?34\))?\s?(?:6\d|7[1-9])\d(-|\s)?\d{3}(-|\s)?\d{3}$/;

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
	const validMail =
		/^([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)@(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,})$/;
	return validMail.test(mail);
}

/**
 * Valida la fortaleza de una contraseña.
 * Devuelve `true` si es válida, o un `string` con el error específico si no lo es.
 * @param {string} password - La contraseña a validar.
 * @returns {true|string} - Retorna `true` si la contraseña es válida, o un mensaje de error.
 */
export function validatePassword(password) {
	if (password.length < 8) {
		return "Debe tener al menos 8 caracteres.";
	}
	if (!/[A-Za-z]/.test(password)) {
		return "Debe contener al menos una letra.";
	}
	if (!/\d/.test(password)) {
		return "Debe contener al menos un número.";
	}
	if (!/[@$!%*?&.,_-]/.test(password)) {
		return "Debe contener un carácter especial (ej: @$!%*?&.,_-).";
	}
	// Comprueba que no haya caracteres no permitidos.
	if (/[^A-Za-z\d@$!%*?&.,_-]/.test(password)) {
		return "Contiene caracteres no permitidos.";
	}
	return true;
}

/**
 * Comprueba que dos contraseñas coincidan y que la segunda contraseña cumpla con los requisitos de validación.
 * @param {string} password - La contraseña original.
 * @param {string} samePassword - La contraseña de confirmación.
 * @returns {true|string} - Retorna `true` si ambas contraseñas son iguales y válidas, o un `string` con el mensaje de error.
 */
export function validSamePassword(password, samePassword) {
	const passwordValidationResult = validatePassword(samePassword);
	if (passwordValidationResult !== true) {
		return passwordValidationResult; // Retorna el error específico de la validación de la contraseña.
	}
	if (password !== samePassword) {
		return "Las contraseñas no coinciden.";
	}
	return true;
}
