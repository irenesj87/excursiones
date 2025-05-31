import React, { useState } from "react";
import { Card, Col, Form, Row, Button } from "react-bootstrap";
import UserPageInputEdit from "./UserPageInputEdit";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../slicers/loginSlice";
import { Navigate } from "react-router";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/UserInfoForm.module.css";

function UserInfoForm() {
	// Variable that we need to be able to use dispatchers
	const loginDispatch = useDispatch();
	// This useSelector gives us the info if an user is logged or not
	const { login: isLoggedIn, user } = useSelector(
		(state) => state.loginReducer
	);
	// Variable that receive and change the name that we received from the edit inputs
	const [name, setName] = useState(user && user.name);
	// Variable that receive and change the surname that we received from the edit inputs
	const [surname, setSurname] = useState(user && user.surname);
	// Variable that receive and change the phone that we received from the edit inputs
	const [phone, setPhone] = useState(user && user.phone);
	// Variable that saves the original name in case the user cancels the editing
	const [originalName, setOriginalName] = useState(user && user.name);
	// Variable that saves the original surname in case the user cancels the editing
	const [originalSurname, setOriginalSurname] = useState(user && user.surname);
	// Variable that saves the original phone in case the user cancels the editing
	const [originalPhone, setOriginalPhone] = useState(user && user.phone);
	// Variable that sets the information for the current user
	// This variable says if the user is editing information or not
	const [isEditing, setIsEditing] = useState(false);
	//
	const currentUser = {
		name: name,
		surname: surname,
		mail: user && user.mail,
		phone: phone,
	};
	// Variable that has the url that is needed for the current user fetch
	const url = `http://localhost:3001/users/${currentUser.mail}`;
	const options = {
		method: "PUT",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + window.sessionStorage["token"],
		},
		// body: It is a standard property within the fetch options. It defines the content to send in the body of the HTTP request.
		/* This is typically used with methods like POST or PUT where you need to send data to the server (in this case, to update user information)
    JSON.stringify(...): This is a built-in JavaScript function. Its job is to take a JavaScript object (like the currentUser object) and convert it into a JSON string.
    We have to convert it to a JSON string because web servers and APIs typically expect data sent in the request body to be in a standardized 
    text format. JSON is the most common format for exchanging data between web clients and servers.*/
		body: JSON.stringify(currentUser),
	};

	// If the user is not logged in we send him/her to the home page
	if (!isLoggedIn) {
		return <Navigate replace to="/" />;
	}

	// Function that gives an alert when the user starts editing. Then the inputs to edit the user's info appears
	const startEdit = () => {
		setIsEditing(true);
		//This variables store the original values when editing starts
		setOriginalName(name);
		setOriginalSurname(surname);
		setOriginalPhone(phone);
	};
	// Function that gives an alert when the user cancels the editing. Then the inputs to edit the user's info disappears
	const cancelEdit = () => {
		setIsEditing(false);
		//Reset to the original values when the user cancels the editing
		setName(originalName);
		setSurname(originalSurname);
		setPhone(originalPhone);
	};
	// Function that saves the info the user has changed
	const saveEdit = async () => {
		try {
			const response = await fetch(url, options);
			if (response.status === 401) {
				throw new Error("No puedes hacer esta operación");
			}
			const data = await response.json();
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
				<Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
					<Form.Label column sm="3" className="text-sm-end fw-bold">
						Correo:
					</Form.Label>
					<Col sm="9">
						<Form.Control
							plaintext
							readOnly
							/* The user?.mail part attempts to access the mail property of the user object.
										The key is the ?. It checks if user is null or undefined before trying to access .mail.
										If user is null or undefined, the expression short-circuits and evaluates to undefined immediately,
										without throwing an error (which would happen with just user.mail).
										If user exists, it proceeds to access the mail property.*/
							/* The operator (??) provides a default value. It checks if the value on its left-hand side (user?.mail in this case) is either null or undefined.
										If the left-hand side is null or undefined, it returns the value on the right-hand side (which is "", an empty string).
										If the left-hand side has any other value (including an empty string "", 0, false, etc.), it returns that left-hand side value.*/
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
				{!isEditing && (
					// Usamos Row y Col para el botón Editar para un control de ancho más robusto.
					// El div externo ya no necesita ser d-flex; Row y Col se encargarán.
					<div className="mt-5 border-top pt-3">
						<Row className="justify-content-center gx-0"> {/* gx-0 para eliminar gutters si no son necesarios */}
							<Col xs={12} sm="auto"> {/* xs={12} para ancho completo en pequeño, sm="auto" para ancho de contenido en sm+ */}
								<Button onClick={startEdit} className="w-100"> {/* w-100 para que el botón llene la Col */}
									Editar
								</Button>
							</Col>
						</Row>
					</div>
				)}
				{isEditing && (
					// Contenedor para margen superior y borde.
					// El layout de los botones se maneja con Row y Col.
					<div className="mt-5 border-top pt-3">
						<Row className="justify-content-center gx-2"> {/* gx-2 para espaciado horizontal entre columnas */}
							{/* Cada botón ocupa la mitad del ancho en xs, y ancho automático en sm+ */}
							<Col xs={6} sm="auto">
								<Button variant="danger" onClick={cancelEdit} className="w-100"> {/* w-100 para llenar la Col */}
									Cancelar
								</Button>
							</Col>
							<Col xs={6} sm="auto">
								<Button variant="success" onClick={saveEdit} className="w-100"> {/* w-100 para llenar la Col */}
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
