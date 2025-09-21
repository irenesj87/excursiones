import { memo, useCallback } from "react";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import ExcursionDetailItem from "../ExcursionDetailItem";
import { FiMapPin, FiClock, FiCheckCircle } from "react-icons/fi";
import { useJoinExcursion } from "../../hooks/useJoinExcursion";
import cn from "classnames";
import { GENERIC_ERROR_MESSAGE } from "../../constants";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./ExcursionCard.module.css";

/**
 * Determina las clases CSS para el badge de dificultad.
 * @param {string} difficultyLevel - El nivel de dificultad ("Baja", "Media", "Alta").
 * @returns {string} Una cadena de clases CSS.
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

/** @typedef {object} JoinButtonProps
 * @property {boolean} isJoined - Indica si el usuario se ha apuntado a la excursión.
 * @property {boolean} isJoining - Muestra si la acción de unirse está en progreso.
 * @property {() => void} onJoin - Callback que se ejecuta cuando se cliquea el botón para apuntarse.
 */

/**
 * Renderiza el botón para unirse a una excursión. Muestra un botón "Apuntarse", un estado de carga o un estado "Apuntado/a".
 * @param {JoinButtonProps} props
 * @returns {React.ReactElement}
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
			<Button
				onClick={onJoin}
				className={styles.joinButton}
				disabled={isJoining}
			>
				{isJoining ? (
					<>
						<Spinner
							as="span"
							animation="border"
							size="sm"
							aria-hidden="true"
							className="me-2"
						/>
						Apuntando...
					</>
				) : (
					"Apuntarse"
				)}
			</Button>
		</div>
	);
}

// El componente JoinButton se memoiza para evitar re-renderizados si sus props no cambian.
// Esto es efectivo porque la prop `onJoin` que recibe ahora será una función estable gracias a `useCallback`.
const JoinButton = memo(JoinButtonComponent);

/** @typedef {object} ExcursionCardProps
 * @property {string | number} id - El ID de la excursión.
 * @property {string} name - El nombre de la excursión.
 * @property {string} area - La zona donde se realiza la excursión.
 * @property {string} difficulty - La dificultad de la excursión (ej. "Baja", "Media", "Alta").
 * @property {string} time - El tiempo estimado de la excursión.
 * @property {boolean} isLoggedIn - Indica si el usuario ha iniciado sesión.
 * @property {boolean} isJoined - Indica si el usuario ya está apuntado a la excursión.
 * @property {(id: string | number) => Promise<void>} [onJoin] - Función asíncrona que se ejecuta cuando el usuario se apunta a la excursión. Recibe el ID de la excursión.
 */

/**
 * Componente para la tarjeta de excursión.
 * @param {ExcursionCardProps} props - Las propiedades del componente.
 * @returns {React.ReactElement}
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
	// La lógica para unirse a la excursión se encapsula en un hook personalizado.
	// Esto limpia el componente, haciéndolo puramente presentacional.
	const { isJoining, joinError, handleJoin, clearError } =
		useJoinExcursion(onJoin);

	// Genera un ID único para el título, que se usará para la accesibilidad.
	// Reemplaza espacios y caracteres especiales para crear un ID válido.
	const titleId = `excursion-title-${id}`;

	// Se crea una función estable para el evento onJoin usando useCallback.
	// Esto evita que se cree una nueva función en cada render, lo que permite
	// que el componente `JoinButton` (ahora memoizado) evite re-renderizados innecesarios.
	const handleOnJoin = useCallback(() => {
		handleJoin(id);
	}, [handleJoin, id]);

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
			<Card.Body className="d-flex flex-column">
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
								{typeof joinError === "string"
									? joinError
									: GENERIC_ERROR_MESSAGE}
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
