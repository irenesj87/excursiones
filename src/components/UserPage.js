import React, { useState, useEffect } from "react";
import {
	Col,
	Button,
	Row,
	Container,
	Table,
	Card,
	Form
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router";
import UserPageInputEdit from "./UserPageInputEdit";
import { updateUser } from "../slicers/loginSlice";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/UserPage.module.css";

function UserPage() {
	// Variable that we need to be able to use dispatchers
	const loginDispatch = useDispatch();
	// This useSelector gives us the info if an user is logged or not
	const { login: isLoggedIn, user } = useSelector(
		(state) => state.loginReducer
	);
	// This variable says if the user is editing information or not
	const [isEditing, setIsEditing] = useState(false);
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
	const currentUser = {
		name: name,
		surname: surname,
		mail: user && user.mail,
		phone: phone,
	};
	// Variable that has the url that is needed for the current user fetch
	const url = `http://localhost:3001/users/${currentUser.mail}`;
	// Variable that has the url that is needed for the excursions that the current user joined fetch
	const excursionsUrl = `http://localhost:3001/excursions`;
	// Variable that saves the options that the fetch needs
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
	// State for saving the user's excursions info
	const [userExcursions, setUserExcursions] = useState([]);

	// Fetch the user's excursions data
	useEffect(() => {
		const fetchData = async () => {
			if (isLoggedIn && user && user.excursions.length > 0) {
				try {
					const response = await fetch(excursionsUrl);
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					const data = await response.json();
					const filteredExcursions = data.filter((excursion) =>
						user.excursions.includes(excursion.id)
					);
					setUserExcursions(filteredExcursions);
				} catch (error) {
					console.error("Error fetching excursions:", error);
				}
			} else {
				setUserExcursions([]);
			}
		};
		fetchData();
	}, [isLoggedIn, user, excursionsUrl]);

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
		<Container className={styles.userPage}>
			<Row className="mb-4">
				<Col>
					<h2 className={styles.title}>Tu perfil</h2>
				</Col>
			</Row>
			<Row className="mb-4 justify-content-center">
				<Col xs="12" md="12" lg="9">
					<Card className={`${styles.profileCard} mb-4`}>
						<Card.Header className={styles.cardHeader}>
							Datos Personales
						</Card.Header>
						<Card.Body className={styles.cardBody}>
							<Form.Group
								as={Row}
								className="mb-3"
								controlId="formPlaintextEmail"
							>
								<Form.Label column sm="3" className="text-sm-end">
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
									className="text-sm-end"
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
									className="text-sm-end"
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
									className="text-sm-end"
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
						</Card.Body>
						<Card.Footer className={`${styles.cardFooter} text-end`}>
							{/* Lógica de botones */}
							{!isEditing && (
								<Button variant="secondary" onClick={startEdit}>
									Editar Perfil
								</Button>
							)}
							{isEditing && (
								<div className="d-flex justify-content-end gap-2">
									<Button variant="danger" onClick={cancelEdit}>
										Cancelar
									</Button>
									<Button variant="success" onClick={saveEdit}>
										Guardar Cambios
									</Button>
								</div>
							)}
						</Card.Footer>
					</Card>
					<Card className={styles.excursionsCard}>
						<Card.Header className={styles.cardHeader}>
							Excursiones a las que te has apuntado
						</Card.Header>
						<Card.Body className={styles.cardBody}>
							{userExcursions.length > 0 ? (
								<Table
									responsive
									bordered
									size="sm"
									className={styles.excursionsTable}
								>
									<thead>
										<tr>
											<th>Nombre</th>
											<th>Descripción</th>
											<th>Zona</th>
											<th>Dificultad</th>
											<th>Tiempo Estimado</th>
										</tr>
									</thead>
									<tbody>
										{userExcursions.map((excursion) => (
											<tr key={excursion.id}>
												<td>{excursion.name}</td>
												<td>{excursion.description}</td>
												<td>{excursion.area}</td>
												<td>{excursion.difficulty}</td>
												<td>{excursion.time}</td>
											</tr>
										))}
									</tbody>
								</Table>
							) : (
								<p className={styles.noExcursionsJoined ?? "text-muted"}>
									Aún no te has apuntado a ninguna excursión.
								</p>
							)}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default UserPage;
