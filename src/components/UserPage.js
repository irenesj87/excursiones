import React, { useState, useEffect } from "react";
import { Col, Button, Row, Container, Table } from "react-bootstrap";
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
				throw new Error("No estás autorizado/a para hacer esta operación");
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
		<div className={styles.container}>
			<Container>
				<Row>
					<Col className={styles.title}>Tu perfil</Col>
				</Row>
				<Row>
					<Col className="text-start text-md-end" xs="12" md="6">
						<label className={styles.userInputLabel}>Correo:</label>
					</Col>
					<Col className="text-start" xs="12" md="6">
						{user && user.mail}
					</Col>
				</Row>
				<Row>
					<Col className="text-start text-md-end" xs="12" md="6">
						<label className={styles.userInputLabel}>Nombre:</label>
					</Col>
					<Col className="text-start" xs="12" md="4">
						<UserPageInputEdit
							isEditing={isEditing}
							inputToChange={setName}
							value={name}
						/>
					</Col>
				</Row>
				<Row>
					<Col className="text-start text-md-end" xs="12" md="6">
						<label className={styles.userInputLabel}>Apellidos:</label>
					</Col>
					<Col className="text-start" xs="12" md="4">
						<UserPageInputEdit
							isEditing={isEditing}
							inputToChange={setSurname}
							value={surname}
						/>
					</Col>
				</Row>
				<Row>
					<Col className="text-start text-md-end" xs="12" md="6">
						<label className={styles.userInputLabel}>Teléfono:</label>
					</Col>
					<Col className="text-start" xs="12" md="4">
						<UserPageInputEdit
							isEditing={isEditing}
							inputToChange={setPhone}
							value={phone}
						/>
					</Col>
				</Row>
				<Row className={styles.excursionsJoined}>
					<Col>
						<h4 className={styles.excursionsJoinedTitle}>
							Excursiones a las que te has apuntado
						</h4>
						{userExcursions.length > 0 ? (
							<Table bordered>
								<thead>
									<tr>
										<th>Nombre</th>
										<th>Zona</th>
										<th>Dificultad</th>
										<th>Tiempo Estimado</th>
									</tr>
								</thead>
								<tbody>
									{userExcursions.map((excursion) => (
										<tr key={excursion.id}>
											<td>{excursion.name}</td>
											<td>{excursion.area}</td>
											<td>{excursion.difficulty}</td>
											<td>{excursion.time}</td>
										</tr>
									))}
								</tbody>
							</Table>
						) : (
							<p className={styles.noExcursionsJoined}>
								Aún no te has apuntado a ninguna excursión.
							</p>
						)}
					</Col>
				</Row>
			</Container>
			<Container className={styles.btns}>
				<Row className="justify-content-center">
					<Col xs="12" md="4">
						{!isEditing && (
							<Button className="w-100" variant="success" onClick={startEdit}>
								Editar
							</Button>
						)}
						{isEditing && (
							<div className="d-flex justify-content-between">
								<Button className="w-48" variant="danger" onClick={cancelEdit}>
									Cancelar
								</Button>
								<Button className="w-48" variant="success" onClick={saveEdit}>
									Guardar
								</Button>
							</div>
						)}
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default UserPage;
