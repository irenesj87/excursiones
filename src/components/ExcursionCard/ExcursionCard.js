import React, { memo, useCallback, useId, useState, useEffect } from "react";
import { Card, Alert } from "react-bootstrap";
import ExcursionDetailItem from "../ExcursionDetailItem";
import CustomButton from "../CustomButton";
import { FiMapPin, FiClock, FiCheckCircle } from "react-icons/fi";
import { useJoinExcursion } from "../../hooks/useJoinExcursion";
import cn from "classnames";
import { getSafeErrorMessage } from "../../utils/errorUtils";
import { GENERIC_ERROR_MESSAGE } from "../../constants";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./ExcursionCard.module.css";

/**
 * Determina las clases CSS para el badge de dificultad.
 * @param {string} difficultyLevel - El nivel de dificultad ("Baja", "Media", "Alta").
 * @returns {string} - Una cadena de clases CSS.
 */
const getDifficultyClasses = (difficultyLevel) => {
	const lowerCaseDifficulty = difficultyLevel.toLowerCase();
	const classMap = {
		baja: styles.difficultyLow,
		media: styles.difficultyMedium,
		alta: styles.difficultyHigh,
	};

	return cn(styles.difficultyBadge, classMap[lowerCaseDifficulty]);
};

/**
 * @typedef {object} JoinButtonProps
 * @property {boolean} isJoined - Indica si el usuario se ha apuntado a la excursión.
 * @property {boolean} isJoining - Muestra si la acción de unirse está en progreso.
 * @property {() => void} onJoin - Callback que se ejecuta cuando se cliquea el botón para apuntarse.
 */

/**
 * Renderiza el botón para unirse a una excursión. Muestra un botón "Apuntarse", un estado de carga o un estado "Apuntado/a".
 * @param {JoinButtonProps} props - Las propiedades del componente.
 * @returns {React.ReactElement} - El elemento React que representa el botón o estado.
 */
function JoinButtonComponent({ isJoined, isJoining, onJoin }) {
	if (isJoined) {
		return (
			<div className="d-grid d-md-flex justify-content-center justify-content-md-end">
				<output className={styles.joinedStatus}>
					<FiCheckCircle /> <span>Apuntado/a</span>
				</output>
			</div>
		);
	}

	return (
		<div className="d-grid d-md-flex justify-content-md-end">
			<CustomButton
				onClick={onJoin}
				className={styles.joinButton}
				isLoading={isJoining}
			>
				{isJoining ? "Apuntando..." : "Apuntarse"}
			</CustomButton>
		</div>
	);
}

const JoinButton = memo(JoinButtonComponent);

/**
 * @typedef {object} ExcursionCardProps
 * @property {string | number} id - El ID de la excursión.
 * @property {string} name - El nombre de la excursión.
 * @property {string} area - La zona donde se realiza la excursión.
 * @property {string} difficulty - La dificultad de la excursión (ej. "Baja", "Media", "Alta").
 * @property {string} time - El tiempo estimado de la excursión.
 * @property {boolean} isLoggedIn - Indica si el usuario ha iniciado sesión.
 * @property {boolean} isJoined - Indica si el usuario ya está apuntado a la excursión.
 * @property {(id: string | number) => Promise<void>} [onJoin] - Función asíncrona que se ejecuta cuando el usuario se
 * apunta a la excursión. Recibe el ID de la excursión.
 */

/**
 * Componente para la tarjeta de excursión.
 * @param {ExcursionCardProps} props - Las propiedades del componente.
 * @returns {React.ReactElement} El elemento React que representa la tarjeta de excursión.
 */
function ExcursionCardComponent({
	id,
	name,
	area,
	difficulty,
	time,
	isLoggedIn,
	isJoined,
	onJoin,
}) {
	// La lógica para unirse a la excursión se encapsula en un hook personalizado para limpiar el componente y
	// haceerlo puramente presentacional.
	const { isJoining, joinError, handleJoin, clearError } =
		useJoinExcursion(onJoin);

	// Estado para gestionar los anuncios para lectores de pantalla.
	const [announcement, setAnnouncement] = useState("");

	// Genera un ID seguro para el título, que se usará para la accesibilidad, previniendo inyección de atributos.
	const titleId = useId();

	// Callback memoizado para manejar el evento de unirse a la excursión.
	const handleOnJoin = useCallback(() => {
		handleJoin(id);
	}, [handleJoin, id]);

	// Efecto para anunciar cambios de estado a los lectores de pantalla.
	useEffect(() => {
		if (isJoining) {
			setAnnouncement(`Apuntando a la excursión ${name}.`);
		}
	}, [isJoining, name]);

	// Efecto para anunciar el resultado (éxito o error) de la acción.
	// Usamos una referencia para evitar que se anuncie el estado "Apuntado" en la carga inicial.
	const isInitialMount = React.useRef(true);
useEffect(() => {
	if (isInitialMount.current) {
		isInitialMount.current = false;
		return;
	}
	if (joinError) {
		setAnnouncement(`Error al apuntarse: ${getSafeErrorMessage(joinError)}`);
	} else if (isJoined) {
		setAnnouncement(`Te has apuntado correctamente a la excursión ${name}.`);
	}
}, [joinError, isJoined, name]);

	return (
		<Card
			as="fieldset"
			// La tarjeta es programáticamente enfocable con el teclado para mejorar la accesibilidad,
			// para que todos los usuarios puedan navegar por el contenido.
			tabIndex={0}
			aria-labelledby={titleId}
			className={cn(styles.excursionItemCard, "h-100 w-100", {
				[styles.isJoinedCard]: isJoined,
			})}
		>
			{/* Contenedor invisible para los anuncios del lector de pantalla. */}
			<div aria-live="polite" aria-atomic="true" className="visually-hidden">
				{announcement}
			</div>

			<Card.Body className="d-flex flex-column flex-grow-1">
				<div>
					{/* Título de la excursión */}
					<Card.Title
						as="legend"
						id={titleId}
						className={`${styles.excursionTitle} mb-3`}
					>
						{name}
					</Card.Title>
					{/* Detalles de la excursión */}
					<div className={styles.excursionDetails}>
						<ExcursionDetailItem
							IconComponent={FiMapPin}
							text={area}
							label="Zona"
						/>
						<ExcursionDetailItem text={difficulty} label="Dificultad">
							<span className={getDifficultyClasses(difficulty)}>
								{difficulty}
							</span>
						</ExcursionDetailItem>
						<ExcursionDetailItem
							IconComponent={FiClock}
							text={time}
							label="Tiempo estimado"
						/>
					</div>
				</div>
				{/* Área de acción: botón para unirse a la excursión */}
				{isLoggedIn && (
					<div className={`${styles.cardActionArea} mt-auto pt-3`}>
						{joinError && (
							<Alert
								variant="danger"
								onClose={clearError}
								dismissible
								className="mb-2 small"
								role="alert"
							>
								{/* Verificación de seguridad: Asegura que solo se rendericen strings. */}
								{getSafeErrorMessage(joinError)}
							</Alert>
						)}
						<JoinButton
							isJoined={isJoined}
							isJoining={isJoining}
							onJoin={handleOnJoin}
						/>
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

const ExcursionCard = memo(ExcursionCardComponent);

export default ExcursionCard;
