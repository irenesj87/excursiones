// This function has the variables and the fetch that is neccessary for an user to logged
const userLogin = (mail, password) => {
	// Variable that has the url that is needed for the fetch
	const url = `http://localhost:3001/login`;

	// Login object that we pass to the server for it to authenticate the user
	const credentials = {
		mail: mail,
		password: password,
	};

	// Variable that saves the options that the fetch needs
	const options = {
		method: "POST",
		mode: "cors",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(credentials),
	};

	return fetch(url, options).then((response) => {
		if (response.status === 401) {
			throw new Error("Datos incorrectos. Inténtalo de nuevo.");
		} else {
			return response.json();
		}
	});
};

// This function has the variables and the fetch that is neccessary for an user to register
const registerUser = (name, surname, phone, mail, password) => {
	// Variable that has the url that is needed for the fetch
	const url = `http://localhost:3001/users`;

	// Variable that has a user with the information we have received from the register form, then this is sent to the server to add the user
	const user = {
		name: name,
		surname: surname,
		phone: phone,
		mail: mail,
		password: password,
	};

	// Variable that saves the options that the fetch needs
	const options = {
		method: "POST",
		mode: "cors",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(user), // Here we send the user's info that the user has given in the register form to the server
	};

	return fetch(url, options).then((response) => {
		if (response.status === 409) {
			throw new Error("Ya hay un usuario registrado con ese correo. Elige otro.");
		} else {
			return response.json();
		}
	});
};

export { userLogin, registerUser };
