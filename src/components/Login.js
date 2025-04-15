import React, { useEffect, useState, useRef } from "react";
import { Button, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import LoginForm from "./LoginForm";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Login.module.css";

export function Login(props) {
	// Variable para saber si hay que mostrar el Modal o no
	const [showModal, setShowModal] = useState(false);
	// Variable para saber si la pantalla es pequeña o no
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	/* Variable que se utiliza para mostrar si el componente está actualmente "montado" (es decir, si existe en el árbol DOM de la página)
	o si ya ha sido "desmontado" (eliminado).*/
	const isMounted = useRef(true);
	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		// Cuando el componente se monta, isMounted.current es true
		isMounted.current = true;
		// La función de limpieza se ejecuta cuando el componente se desmonta
		return () => {
			isMounted.current = false; // Marcar como desmontado
		};
	}, []); // El array vacío asegura que esto se ejecute solo al montar y desmontar

	const clearLoginInputs = () => {
		setMail("");
		setPassword("");
	};

	// handleShow se utiliza para mostrar el Modal
	const handleShow = () => {
		if (isMounted.current) {
			setShowModal(true);
		}
	};

	// handleClose se utiliza para cerrar el Modal
	const handleClose = () => {
		if (isMounted.current) {
			// Solo actualiza si está montado
			setShowModal(false);
			clearLoginInputs();
		}
	};

	const handleShowAndCollapseNav = () => {
		if (props.onClickCloseCollapsibleLogin) {
			props.onClickCloseCollapsibleLogin(); // Llama a la función para cerrar el Navbar
		}
		handleShow(); // Llama a la función original para mostrar el Modal
	};

	// Modifica el efecto del tamaño de pantalla
	useEffect(() => {
		const breakpoint = 1024;
		const checkScreenSize = () => {
			// Verifica también aquí antes de actualizar el estado
			if (isMounted.current) {
				setIsSmallScreen(window.innerWidth < breakpoint);
			}
		};

		/* Añadimos un event listener a la ventana del navegador. Cada vez que el tamaño de la ventana cambie (evento resize), 
		se ejecutará la función checkScreenSize.*/
		window.addEventListener("resize", checkScreenSize);
		checkScreenSize(); // Comprobación inicial

		return () => {
			/*Elimina el event listener cuando el componente se desmonta. Esto es crucial para evitar pérdidas de memoria 
			(memory leaks) y errores, ya que el listener dejaría de tener sentido si el componente ya no existe.*/
			window.removeEventListener("resize", checkScreenSize);
		};
		// No necesitamos dependencias aquí si solo leemos window.innerWidth
		// y la única escritura de estado está protegida por isMounted.current
	}, [isSmallScreen]);

	const handleDropDownToggle = (isOpen) => {
		// Si el dropdown está cerrado
		if (!isOpen) {
			// Se resetean los inputs
			clearLoginInputs();
		}
	};

	// Función que se pasará a LoginForm para cuando el login sea exitoso
	// Ahora necesita limpiar el estado aquí también si el modal/dropdown no se cierra automáticamente
	const handleLoginSuccess = () => {
		if (isSmallScreen) {
			handleClose(); // Cierra el modal si es pantalla pequeña
		} else {
			// En pantalla grande, el dropdown podría seguir abierto si autoClose no es 'true'.
			// Si quieres cerrarlo programáticamente necesitarías controlar el estado 'show' del DropdownButton
			// o simplemente limpiar los campos aquí también si no se cierra solo.
			clearLoginInputs();
		}
	};

	// --- Renderizado Condicional ---
	if (isSmallScreen) {
		// Si la pantalla es pequeña, se utiliza el Modal...
		return (
			<>
				<Button
					variant="outline-success"
					onClick={handleShowAndCollapseNav}
					className={styles.loginModalButton}
				>
					Inicia sesión
				</Button>

				<Modal show={showModal} onHide={handleClose} centered>
					<Modal.Header closeButton>
						<Modal.Title>Iniciar sesión</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{/* Si el login ha sido exitoso el LoginForm le dice a Login que puede cerrar el Modal */}
						<LoginForm
							mail={mail}
							password={password}
							setMail={setMail}
							setPassword={setPassword}
							onLoginSuccess={handleLoginSuccess}
						/>
					</Modal.Body>
				</Modal>
			</>
		);
	} else {
		// ...Y si la pantalla es grande utilizamos el botón
		return (
			<DropdownButton
				className={styles.loginDropdownButton}
				variant="outline-success"
				title="Inicia sesión"
				align="end"
				autoClose="outside"
				onToggle={handleDropDownToggle}
			>
				<Dropdown.Item as="div" className={styles.loginDropdownButtonItem}>
					<LoginForm
						mail={mail}
						password={password}
						setMail={setMail}
						setPassword={setPassword}
						onLoginSuccess={handleLoginSuccess}
					/>
				</Dropdown.Item>
			</DropdownButton>
		);
	}
}

export default Login;
