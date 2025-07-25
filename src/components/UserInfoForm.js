import { useReducer } from "react";
import { Card, Col, Form, Row, Button } from "react-bootstrap";
import UserPageInputEdit from "./UserPageInputEdit";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../slicers/loginSlice";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/UserInfoForm.module.css";

/** @typedef {import('types.js').RootState} RootState */

/**
 * Componente que se encarga del menú de edición y muestra de los datos del usuario logueado en ese momento
 */
function UserInfoForm() {
	// Variable que necesitamos para poder usar los dispatchers de Redux.
	const loginDispatch = useDispatch();
	// Este useSelector nos da los datos del usuario actual.
	const { user } = useSelector(
		/** @param {RootState} state */ (state) => state.loginReducer
	);
	// Estado inicial para el reducer del formulario
	const initialState = {
		values: {
			name: user?.name ?? "",
			surname: user?.surname ?? "",
			phone: user?.phone ?? "",
		},
		originalValues: null, // Para guardar los valores antes de editar
		isEditing: false,
	};

	// Reducer para gestionar el estado del formulario
	const formReducer = (state, action) => {
		switch (action.type) {
			case "START_EDIT":
				return {
					...state,
					isEditing: true,
					originalValues: state.values, // Guarda el estado actual
				};
			case "CANCEL_EDIT":
				return {
					...state,
					isEditing: false,
					values: state.originalValues, // Restaura los valores originales
					originalValues: null,
				};
			case "UPDATE_FIELD":
				return {
					...state,
					values: {
						...state.values,
						[action.payload.field]: action.payload.value,
					},
				};
			case "SAVE_SUCCESS":
				return { ...state, isEditing: false, originalValues: null };
			default:
				return state;
		}
	};

	const [formState, formDispatch] = useReducer(formReducer, initialState);

	// URL para la petición de actualización de los datos del usuario.
	const url = `http://localhost:3001/users/${user?.mail}`;
	// Opciones para la petición HTTP (PUT) para actualizar los datos del usuario.
	/** @type {RequestInit} */
	const options = {
		method: "PUT",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + window.sessionStorage["token"],
		},
		body: JSON.stringify({ ...formState.values, mail: user?.mail }),
	};

	// Función para iniciar el modo de edición.
	const startEdit = () => {
		formDispatch({ type: "START_EDIT" });
	};
	// Función para cancelar el modo de edición.
	const cancelEdit = () => {
		formDispatch({ type: "CANCEL_EDIT" });
	};
	// Función para guardar la información que el usuario ha cambiado.
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
			// Opcional: podrías despachar una acción de error aquí para mostrar un mensaje
		} finally {
			formDispatch({ type: "SAVE_SUCCESS" });
		}
	};

	const handleInputChange = (field, value) => {
		formDispatch({ type: "UPDATE_FIELD", payload: { field, value } });
	};

	return (
		<Card className={`${styles.profileCard} w-100 flex-grow-1`}>
			<Card.Header className={styles.cardHeader}>Datos Personales</Card.Header>
			<Card.Body className={`${styles.cardBody} d-flex flex-column`}>
				{/* Campo de correo electrónico (solo lectura) */}
				<Form.Group
					as={Row}
					className="mb-3 gx-2"
					controlId="formPlaintextEmail"
				>
					<Form.Label column sm="3" className="text-sm-end fw-bold">
						Correo:
					</Form.Label>
					<Col sm="9">
						<Form.Control
							plaintext
							readOnly // El campo es de solo lectura
							defaultValue={user?.mail ?? ""}
						/>
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-3 gx-2 align-items-center">
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
							isEditing={formState.isEditing}
							onInputChange={(value) => handleInputChange("name", value)}
							value={formState.values.name}
						/>
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-3 gx-2 align-items-center">
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
							isEditing={formState.isEditing}
							onInputChange={(value) => handleInputChange("surname", value)}
							value={formState.values.surname}
						/>
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="mb-4 gx-2 align-items-center">
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
							isEditing={formState.isEditing}
							onInputChange={(value) => handleInputChange("phone", value)}
							value={formState.values.phone}
						/>
					</Col>
				</Form.Group>
				{/* Botón "Editar" visible cuando no se está editando */}
				{!formState.isEditing && (
					<div className="mt-auto border-top pt-3">
						<Row className="justify-content-center justify-content-sm-end gx-0">
							<Col xs={12} sm="auto">
								<Button
									onClick={startEdit}
									className={`${styles.editButton} w-100`}
								>
									Editar
								</Button>
							</Col>
						</Row>
					</div>
				)}
				{formState.isEditing && (
					<div className="mt-auto border-top pt-3">
						<Row className="justify-content-center justify-content-sm-end gx-2">
							{/* En xs, los botones ocupan el ancho completo y se apilan. En sm+, se muestran en línea. */}
							<Col xs={12} sm="auto" className="mb-2 mb-sm-0">
								<Button
									variant="danger"
									onClick={cancelEdit}
									className={`${styles.cancelButton} w-100`}
								>
									Cancelar
								</Button>
							</Col>
							<Col xs={12} sm="auto">
								<Button
									variant="success"
									onClick={saveEdit}
									className={`${styles.saveButton} w-100`}
								>
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
