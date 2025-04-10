import React, { useEffect, useState, useRef } from "react";
import { Button, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import LoginForm from "./LoginForm";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Login.module.css";

export function Login() {
	// Variable para saber si hay que mostrar el Modal o no
	const [showModal, setShowModal] = useState(false);
	// Variable para saber si la pantalla es pequeña o no
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
		const breakpoint = 1024;
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

	// --- Renderizado Condicional ---
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
				variant="outline-success"
				title="Inicia sesión"
				align="end"
				autoClose="outside"
			>
				<Dropdown.Item as="div" className={styles.loginDropdownButtonItem}>
					<LoginForm />
				</Dropdown.Item>
			</DropdownButton>
		);
	}
}

export default Login;
