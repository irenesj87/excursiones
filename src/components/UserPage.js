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
		if (isLoggedIn && user && user.excursions.length > 0) {
			fetch(excursionsUrl)
				.then((response) => response.json())
				.then((data) => {
					const filteredExcursions = data.filter((excursion) =>
						user.excursions.includes(excursion.id)
					);
					setUserExcursions(filteredExcursions);
				})
				.catch((error) => {
					console.error("Error fetching excursions:", error);
				});
		} else {
			setUserExcursions([]);
		}
	}, [isLoggedIn, user, excursionsUrl]);

	// If the user is not logged in we send him/her to the home page
	if (!isLoggedIn) {
		return <Navigate replace to="/" />;
	}

	// Function that gives an alert when the user starts editing. Then the inputs to edit the user's info appears
	const startEdit = () => {
		setIsEditing(true);
	};

	// Function that gives an alert when the user cancels the editing. Then the inputs to edit the user's info disappears
	const cancelEdit = () => {
		setIsEditing(false);
	};

	// Function that saves the info the user has changed
	const saveEdit = () => {
		fetch(url, options)
			.then((response) => {
				if (response.status === 401) {
					throw new Error("No estás autorizado/a para hacer esta operación");
				} else {
					return response.json();
				}
			})
			.then((data) => {
				loginDispatch(
					updateUser({
						user: data,
					})
				);
			})
			.catch(function (error) {
				console.log(error);
			})
			.finally(() => {
				setIsEditing(false);
			});
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
