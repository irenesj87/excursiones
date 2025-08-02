import { useReducer, useEffect, useRef } from "react";
import { Card, Col, Form, Row, Button, Spinner, Alert } from "react-bootstrap";
import UserPageInputEdit from "./UserPageInputEdit";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../slicers/loginSlice";
import {
	validateName,
	validateSurname,
	validatePhone,
} from "../validation/validations";
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
		originalValues: {
			name: user?.name ?? "",
			surname: user?.surname ?? "",
			phone: user?.phone ?? "",
		},
		isEditing: false,
		isLoading: false,
		error: null,
		successMessage: null,
	};

	/**
	 * Reducer para gestionar el estado del formulario de información del usuario.
	 * @param {object} state - El estado actual del formulario.
	 * @param {object} action - La acción a despachar.
	 */
	const formReducer = (state, action) => {
		switch (action.type) {
			case "START_EDIT":
				return {
					...state,
					isEditing: true,
					error: null,
					successMessage: null,
				};
			case "CANCEL_EDIT":
				return {
					...state,
					isEditing: false,
					values: state.originalValues, // Restaura los valores originales
					error: null,
					successMessage: null,
				};
			case "UPDATE_FIELD":
				return {
					...state,
					values: {
						...state.values,
						[action.payload.field]: action.payload.value,
					},
				};
			case "SAVE_START":
				return { ...state, isLoading: true, error: null, successMessage: null };
			case "SAVE_SUCCESS":
				return {
					...state,
					isEditing: false,
					isLoading: false,
					originalValues: state.values,
					successMessage: "¡Datos guardados con éxito!",
				};
			case "SAVE_FAILURE":
				return { ...state, isLoading: false, error: action.payload };
			case "CLEAR_MESSAGES":
				return { ...state, error: null, successMessage: null };
			default:
				return state;
		}
	};

	const [formState, formDispatch] = useReducer(formReducer, initialState);
	const {
		values,
		originalValues,
		isEditing,
		isLoading,
		error,
		successMessage,
	} = formState;

	const nameInputRef = useRef(null);
	const alertRef = useRef(null);

	// URL para la petición de actualización de los datos del usuario.
	const url = `http://localhost:3001/users/${user?.mail}`;

	// Comprueba si el formulario es válido.
	const isFormValid =
		validateName(values.name) &&
		validateSurname(values.surname) &&
		validatePhone(values.phone);

	// Comprueba si el formulario ha cambiado.
	const isFormChanged =
		JSON.stringify(values) !== JSON.stringify(originalValues);

	// Configuración de los campos del formulario para renderizarlos dinámicamente.
	const formFields = [
		{
			id: "formPlaintextName",
			label: "Nombre",
			field: "name",
			ref: nameInputRef,
			validation: validateName,
			errorMessage: "El nombre no puede estar vacío.",
		},
		{
			id: "formPlaintextSurname",
			label: "Apellidos",
			field: "surname",
			validation: validateSurname,
			errorMessage: "Los apellidos no pueden estar vacíos.",
		},
		{
			id: "formPlaintextPhone",
			label: "Teléfono",
			field: "phone",
			validation: validatePhone,
			errorMessage: "El formato del teléfono no es válido.",
		},
	];

	/**
	 * Inicia el modo de edición del formulario.
	 */
	const startEdit = () => {
		formDispatch({ type: "START_EDIT" });
	};

	/**
	 * Cancela el modo de edición y restaura los valores originales del formulario.
	 */
	const cancelEdit = () => {
		formDispatch({ type: "CANCEL_EDIT" });
	};

	/**
	 * Guarda la información del usuario en el servidor. Realiza una petición PUT para actualizar los datos del usuario.
	 */
	const saveEdit = async () => {
		formDispatch({ type: "SAVE_START" });
		/** @type {RequestInit} */
		const options = {
			method: "PUT",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + window.sessionStorage["token"],
			},
			body: JSON.stringify({ ...values, mail: user?.mail }),
		};

		try {
			const response = await fetch(url, options);
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				const errorMessage =
					errorData.message || "No se pudieron guardar los cambios.";
				throw new Error(errorMessage);
			}
			const data = await response.json();
			// Actualiza el estado de Redux con los nuevos datos del usuario.
			loginDispatch(
				updateUser({
					user: data,
				})
			);
			formDispatch({ type: "SAVE_SUCCESS" });
		} catch (error) {
			console.error(error);
			formDispatch({ type: "SAVE_FAILURE", payload: error.message });
		}
	};

	/**
	 * Maneja el cambio de valor en un campo del formulario.
	 * @param {string} field - El nombre del campo que se está actualizando.
	 * @param {string} value - El nuevo valor del campo.
	 */
	const handleInputChange = (field, value) => {
		formDispatch({ type: "UPDATE_FIELD", payload: { field, value } });
	};

	// Efecto para enfocar el primer input al entrar en modo edición.
	useEffect(() => {
		if (isEditing && nameInputRef.current) {
			nameInputRef.current.focus();
		}
	}, [isEditing]);

	// Efecto para auto-descartar el mensaje de éxito después de 5 segundos.
	useEffect(() => {
		if (successMessage) {
			const timer = setTimeout(() => {
				formDispatch({ type: "CLEAR_MESSAGES" });
			}, 5000); // 5 segundos

			// Limpia el temporizador si el componente se desmonta o el mensaje se descarta manualmente.
			return () => clearTimeout(timer);
		}
	}, [successMessage]);

	// Efecto para enfocar las alertas cuando aparecen.
	useEffect(() => {
		if ((error || successMessage) && alertRef.current) {
			alertRef.current.focus();
		}
	}, [error, successMessage]);

	// Determina el `aria-label` para el contenedor de la alerta.
	// Esto proporciona un nombre accesible al grupo de alertas, que es anunciado por los lectores de pantalla al enfocarlo.
	// Si hay un mensaje de éxito, se usa un label específico. Si hay un error y se está editando, se usa otro label.
	// Si no hay alertas, se deja undefined para que no interfiera con la accesibilidad.
	const alertContainerAriaLabel = (() => {
		if (successMessage) {
			return "Mensaje de éxito";
		}
		if (isEditing && error) {
			return "Mensaje de error";
		}
		return undefined;
	})();

	return (
		<Card className={`${styles.profileCard} w-100 flex-grow-1`}>
			<Card.Header className={styles.cardHeader}>Datos Personales</Card.Header>
			<Card.Body className={`${styles.cardBody} d-flex flex-column`}>
				{/*
				 * Contenedor para alertas de éxito y error.
				 * - `role="group"` agrupa las alertas semánticamente.
				 * - `aria-label` proporciona un nombre accesible al grupo, que es anunciado por los lectores de pantalla al enfocarlo.
				 * - `ref` y `tabIndex={-1}` permiten que el contenedor sea enfocado programáticamente.
				 */}
				<div
					ref={alertRef}
					tabIndex={-1}
					role="group"
					aria-label={alertContainerAriaLabel}
				>
					{successMessage && (
						<Alert
							variant="success"
							onClose={() => formDispatch({ type: "CLEAR_MESSAGES" })}
							dismissible
							className="mb-3"
						>
							{successMessage}
						</Alert>
					)}
					{isEditing && error && (
						<Alert
							variant="danger"
							onClose={() => formDispatch({ type: "CLEAR_MESSAGES" })}
							dismissible
							className="mb-3"
						>
							{error}
						</Alert>
					)}
				</div>

				{/* Campo de correo electrónico (sólo lectura) */}
				<Form.Group
					as={Row}
					className="mb-3 gx-2"
					controlId="formPlaintextEmail"
				>
					<Form.Label column sm="3" className="text-sm-end fw-bold">
						Correo:
					</Form.Label>
					<Col sm="9">
						<Form.Control plaintext readOnly defaultValue={user?.mail ?? ""} />
					</Col>
				</Form.Group>

				{/* Renderizado dinámico de los campos del formulario */}
				{formFields.map((field, index) => (
					<Form.Group
						as={Row}
						key={field.id}
						className={`${
							index === formFields.length - 1 ? "mb-4" : "mb-3"
						} gx-2 align-items-center`}
					>
						<Form.Label
							column
							sm="3"
							className="text-sm-end fw-bold"
							htmlFor={field.id}
						>
							{field.label}:
						</Form.Label>
						<Col sm="9">
							<UserPageInputEdit
								ref={field.ref}
								id={field.id}
								isEditing={isEditing}
								onInputChange={(value) => handleInputChange(field.field, value)}
								value={values[field.field]}
								validationFunction={field.validation}
								message={true}
								errorMessage={field.errorMessage}
							/>
						</Col>
					</Form.Group>
				))}

				{/* Botón "Editar" visible cuando no se está editando */}
				{!isEditing && (
					<div className="mt-auto pt-3">
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
				{isEditing && (
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
									variant={
										!isFormValid || !isFormChanged ? "secondary" : "success"
									}
									onClick={saveEdit}
									className={`${styles.saveButton} w-100`}
									disabled={!isFormValid || !isFormChanged || isLoading}
								>
									{isLoading ? (
										<Spinner
											as="span"
											animation="border"
											size="sm"
											role="status"
											aria-hidden="true"
										/>
									) : (
										"Guardar"
									)}
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
