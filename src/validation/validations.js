// This function deletes the blank spaces at the beginning and at the end of the string. Then, validates the name of the user
export function validateName(name) {
	return name.trim() !== "";
}

// This function deletes the blank spaces at the beginning and at the end of the string. Then, validates the surname of the user
export function validateSurname(surname) {
	return surname.trim() !== "";
}

// This function validates the phone of the user
export function validatePhone(phone) {
	const validPhone =
		/^([(][+]?34[)])?\s?(?:6\d|7[1-9])\d(-|\s)?\d{3}(-|\s)?\d{3}$/;

	return validPhone.test(phone);
}

// This function validates the mail of the user
export function validateMail(mail) {
	const validMail =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	return validMail.test(mail);
}

// This function validates the password of the user. The password has to have at least eight characters, one number and one letter
export function validatePassword(password) {
	const validPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

	return validPassword.test(password);
}

// This function validates the same password input
export function validSamePassword(password, samePassword) {
	return validatePassword(samePassword) && password === samePassword;
}
