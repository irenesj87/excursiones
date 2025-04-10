import React, { useEffect, useState, useRef } from "react";
import { Button, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import LoginForm from "./LoginForm";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Login.module.css";

export function Login() {
	// Variable that we need to be able to use dispatchers
	/*const loginDispatch = useDispatch();
	// Variable that saves if the login button is disabled or not
	const [disabled, setDisabled] = useState(true);
	// Variable that receive and change the mail that we received from the login form inputs
	const [mail, setMail] = useState("");
	// Variable that receive and change the password that we received from the login form inputs
	const [password, setPassword] = useState("");

	// Function that submits the information for the login form, saves the user and the token in the store and in the case of the token saves it in the sessionStorage too
	const submit = async (e) => {
		e.preventDefault();
		try {
			const data = await userLogin(mail, password);
			//The user logs in and we store his/her info and his/her token in the store
			loginDispatch(
				login({
					user: data.user,
					token: data.token,
				})
			);
			//...and then we save his/her token in the browser sessionStorage
			window.sessionStorage["token"] = data.token;
		} catch (error) {
			alert(error);
		}
	};

	// This useEffect disables the button to log until all the information in the login inputs is correct
	useEffect(() => {
		if (validateMail(mail) && validatePassword(password)) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [mail, password]);


	return (
		<DropdownButton
			className={styles.loginDropdownButton}
			title="Inicia sesión"
			autoClose="outside"
		>
			<Dropdown.Item as="div" className={styles.loginDropdownButtonItem}>
				<Form id="loginForm" noValidate onSubmit={submit} className={styles.formText}>
					<ValidatedFormGroup
						id="formLoginDropdownEmail"
						name="Correo electrónico"
						inputType="email"
						inputToChange={setMail}
						validationFunction={validateMail}
						value={mail}
						message={false}
						autocomplete="email"
						
					/>
					<ValidatedFormGroup
						id="formLoginDropdownPassword"
						inputType="password"
						name="Contraseña"
						inputToChange={setPassword}
						validationFunction={validatePassword}
						value={password}
						message={false}
						autocomplete="current-password"
					/>
					<Button
						className={`${styles.sendBtn} mt-3`}
						variant={disabled ? "secondary" : "success"}
						type="submit"
						disabled={disabled}
					>
						Enviar
					</Button>
				</Form>
			</Dropdown.Item>
		</DropdownButton>
	);*/

	const [showModal, setShowModal] = useState(false);
	const [isSmallScreen, setIsSmallScreen] = useState(false);

	// --- Inicio: Corrección para estado en componente desmontado ---
	const isMounted = useRef(true); // Usamos useRef para rastrear si está montado

	useEffect(() => {
		// Cuando el componente se monta, isMounted.current es true
		isMounted.current = true;
		// La función de limpieza se ejecuta cuando el componente se desmonta
		return () => {
			isMounted.current = false; // Marcar como desmontado
		};
	}, []); // El array vacío asegura que esto se ejecute solo al montar y desmontar
	// --- Fin: Corrección ---

	// Modifica handleClose y handleShow para verificar si está montado
	const handleClose = () => {
		if (isMounted.current) {
			// Solo actualiza si está montado
			setShowModal(false);
		}
	};
	const handleShow = () => {
		if (isMounted.current) {
			// Buena práctica añadirlo aquí también
			setShowModal(true);
		}
	};

	// Modifica el efecto del tamaño de pantalla
	useEffect(() => {
		const breakpoint = 1025;
		const checkScreenSize = () => {
			// Verifica también aquí antes de actualizar el estado
			if (isMounted.current) {
				setIsSmallScreen(window.innerWidth < breakpoint);
			}
		};

		window.addEventListener("resize", checkScreenSize);
		checkScreenSize(); // Comprobación inicial

		return () => {
			window.removeEventListener("resize", checkScreenSize);
		};
		// No necesitamos dependencias aquí si solo leemos window.innerWidth
		// y la única escritura de estado está protegida por isMounted.current
	}, []);

	// --- Renderizado Condicional (sin cambios aquí) ---
	if (isSmallScreen) {
		return (
			<>
				<Button
					variant="outline-success"
					onClick={handleShow}
					className={styles.loginModalButton}
				>
					Inicia sesión
				</Button>

				<Modal show={showModal} onHide={handleClose} centered>
					<Modal.Header closeButton>
						<Modal.Title>Iniciar sesión</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{/* handleClose ya está protegido */}
						<LoginForm onLoginSuccess={handleClose} />
					</Modal.Body>
				</Modal>
			</>
		);
	} else {
		return (
			<DropdownButton
				className={styles.loginDropdownButton}
				title="Inicia sesión"
				align="end"
				autoClose="outside"
			>
				<Dropdown.Item as="div" className={styles.loginDropdownButtonItem}>
					{/* Aquí onLoginSuccess no era necesario, así que no hay problema */}
					<LoginForm />
				</Dropdown.Item>
			</DropdownButton>
		);
	}
}

export default Login;
