import { useState } from "react";
import { Card, Col, Form, Row, Button } from "react-bootstrap";
import UserPageInputEdit from "./UserPageInputEdit";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../slicers/loginSlice";
import { Navigate } from "react-router";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/UserInfoForm.module.css";

/**
 * Componente que se encarga del menú de edición y muestra de los datos del usuario logueado en ese momento
 */
function UserInfoForm() {
	// Variable que necesitamos para poder usar los dispatchers de Redux.
	const loginDispatch = useDispatch();
	// Este useSelector nos da la información de si un usuario está logueado o no, así como los datos del usuario actual.
	const { login: isLoggedIn, user } = useSelector(
		(state) => state.loginReducer
	);
	// Variable de estado para el nombre del usuario, inicializada con el nombre del usuario logueado. Se actualizará con los
	// cambios en los inputs de edición.
	const [name, setName] = useState(user?.name);
	// Variable de estado para los apellidos del usuario, inicializada con los apellidos del usuario logueado. Se actualizará
	// con los cambios en los inputs de edición.
	const [surname, setSurname] = useState(user?.surname);
	// Variable de estado para el teléfono del usuario, inicializada con el teléfono del usuario logueado. Se actualizará con
	// los cambios en los inputs de edición.
	const [phone, setPhone] = useState(user?.phone);
	// Variable de estado que guarda el nombre original en caso de que el usuario cancele la edición.
	const [originalName, setOriginalName] = useState(user?.name);
	// Variable de estado que guarda los apellidos originales en caso de que el usuario cancele la edición.
	const [originalSurname, setOriginalSurname] = useState(user?.surname);
	// Variable de estado que guarda el teléfono original en caso de que el usuario cancele la edición.
	const [originalPhone, setOriginalPhone] = useState(user?.phone);
	// Variable de estado que indica si el usuario está editando su información o no.
	const [isEditing, setIsEditing] = useState(false);

	// Objeto que representa los datos del usuario actual, incluyendo los cambios potenciales de los inputs.
	const currentUser = {
		name: name,
		surname: surname,
		mail: user?.mail,
		phone: phone,
	};
	// URL para la petición de actualización de los datos del usuario.
	const url = `http://localhost:3001/users/${currentUser.mail}`;
	// Opciones para la petición HTTP (PUT) para actualizar los datos del usuario.
	const options = {
		method: "PUT",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + window.sessionStorage["token"],
		},
		/*
		 * body: Es una propiedad estándar dentro de las opciones de fetch. Define el contenido a enviar en el cuerpo de la 
		   petición HTTP.
		 * Esto se usa típicamente con métodos como POST o PUT donde necesitas enviar datos al servidor (en este caso, para 
		   actualizar la información del usuario).
		 * JSON.stringify(...): Es una función de JavaScript. Su trabajo es tomar un objeto JavaScript (como el objeto 
		   currentUser) y convertirlo en una cadena JSON. Tenemos que convertirlo a una cadena JSON porque los servidores web 
		   y las APIs típicamente esperan que los datos enviados en el cuerpo de la petición estén en un formato de texto 
		   estandarizado y JSON es el formato más común para intercambiar datos entre clientes web y servidores.
		 */
		body: JSON.stringify(currentUser),
	};

	// Si el usuario no está logueado, lo redirigimos a la página de inicio.
	if (!isLoggedIn) {
		return <Navigate replace to="/" />;
	}

	// Función para iniciar el modo de edición.
	// Guarda los valores actuales como "originales" y muestra los inputs de edición.
	const startEdit = () => {
		setIsEditing(true);
		// Estas variables almacenan los valores originales cuando comienza la edición.
		setOriginalName(name);
		setOriginalSurname(surname);
		setOriginalPhone(phone);
	};
	// Función para cancelar el modo de edición.
	// Restaura los valores originales y oculta los inputs de edición.
	const cancelEdit = () => {
		setIsEditing(false);
		// Restablece los valores a los originales cuando el usuario cancela la edición.
		setName(originalName);
		setSurname(originalSurname);
		setPhone(originalPhone);
	};
	// Función para guardar la información que el usuario ha cambiado.
	// Realiza una petición PUT al servidor para actualizar los datos.
	const saveEdit = async () => {
		try {
			const response = await fetch(url, options);
			if (response.status === 401) {
				throw new Error("No puedes hacer esta operación");
			}
			const data = await response.json();
			// Actualiza el estado de Redux con los nuevos datos del usuario.
			loginDispatch(
				updateUser({
					user: data,
				})
			);
		} catch (error) {
			console.log(error);
		} finally {
			setIsEditing(false);
		}
	};

	return (
		<Card className={`${styles.profileCard} mb-4`}>
			<Card.Header className={styles.cardHeader}>Datos Personales</Card.Header>
			<Card.Body className={styles.cardBody}>
				{/* Campo de correo electrónico (solo lectura) */}
				<Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
					<Form.Label column sm="3" className="text-sm-end fw-bold">
						Correo:
					</Form.Label>
					<Col sm="9">
						<Form.Control
							plaintext
							readOnly // El campo es de solo lectura
							/*
							 * user?.mail intenta acceder a la propiedad 'mail' del objeto 'user'.
							 * El operador ?. (encadenamiento opcional) verifica si 'user' es null o undefined antes de
							 * intentar acceder a '.mail'. Si 'user' es null o undefined, la expresión se evalúa a undefined
							 * inmediatamente, sin lanzar un error. Si 'user' existe, procede a acceder a la propiedad 'mail'.
							 *
							 * El operador ?? (nullish coalescing) proporciona un valor por defecto.
							 * Verifica si el valor de su lado izquierdo (user?.mail en este caso) es null o undefined.
							 * Si es así, retorna el valor de su lado derecho (que es "", una cadena vacía).
							 * Si el lado izquierdo tiene cualquier otro valor (incluyendo "", 0, false, etc.), retorna
							 * ese valor.
							 */
							defaultValue={user?.mail ?? ""}
						/>
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-3 align-items-center">
					<Form.Label
						column
						sm="3"
						className="text-sm-end fw-bold"
						htmlFor="formPlaintextName"
					>
						Nombre:
						{/* Componente para editar el nombre */}
					</Form.Label>
					<Col sm="9">
						<UserPageInputEdit
							id="formPlaintextName"
							isEditing={isEditing}
							inputToChange={setName}
							value={name}
						/>
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-3 align-items-center">
					<Form.Label
						column
						sm="3"
						className="text-sm-end fw-bold"
						htmlFor="formPlaintextSurname"
					>
						Apellidos:
						{/* Componente para editar los apellidos */}
					</Form.Label>
					<Col sm="9">
						<UserPageInputEdit
							id="formPlaintextSurname"
							isEditing={isEditing}
							inputToChange={setSurname}
							value={surname}
						/>
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-3 align-items-center">
					<Form.Label
						column
						sm="3"
						className="text-sm-end fw-bold"
						htmlFor="formPlaintextPhone"
					>
						Teléfono:
						{/* Componente para editar el teléfono */}
					</Form.Label>
					<Col sm="9">
						<UserPageInputEdit
							id="formPlaintextPhone"
							isEditing={isEditing}
							inputToChange={setPhone}
							value={phone}
						/>
					</Col>
				</Form.Group>
				{/* Botón "Editar" visible cuando no se está editando */}
				{!isEditing && (
					<div className="mt-5 border-top pt-3">
						<Row className="justify-content-center justify-content-sm-end gx-0">
							{/* gx-0 para eliminar los "gutters" (espacios entre columnas) si no son necesarios */}
							<Col xs={12} sm="auto">
								<Button onClick={startEdit} className="w-100">
									Editar
								</Button>
							</Col>
						</Row>
					</div>
				)}
				{isEditing && (
					<div className="mt-5 border-top pt-3">
						<Row className="justify-content-center justify-content-sm-end gx-2">
							{/* gx-2 para añadir espaciado horizontal entre columnas */}
							{/* Cada botón ocupa la mitad del ancho en breakpoints extra pequeños (xs), y ancho automático en 
							sm+ */}
							<Col xs={6} sm="auto">
								<Button variant="danger" onClick={cancelEdit} className="w-100">
									Cancelar
								</Button>
							</Col>
							<Col xs={6} sm="auto">
								<Button variant="success" onClick={saveEdit} className="w-100">
									Guardar
								</Button>
							</Col>
						</Row>
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

export default UserInfoForm;
