import { memo } from "react";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import ExcursionDetailItem from "../ExcursionDetailItem";
import { FiMapPin, FiClock, FiCheckCircle } from "react-icons/fi";
import cn from "classnames";
import { useJoinExcursion } from "../../hooks/useJoinExcursion";
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

	return cn(
		styles.difficultyBadge,
		classMap[lowerCaseDifficulty], // Aplica la clase de color de fondo
		{
			[styles.difficultyTextLight]: lowerCaseDifficulty !== "media", // Texto claro para Baja/Alta
			[styles.difficultyTextDark]: lowerCaseDifficulty === "media", // Texto oscuro para Media
		}
	);
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
const JoinButton = ({ isJoined, isJoining, onJoin }) => {
	if (isJoined) {
		return (
			<div className="d-grid d-md-flex justify-content-center justify-content-md-end">
				<div className={styles.joinedStatus} role="status" aria-live="polite">
					<FiCheckCircle /> <span>Apuntado/a</span>
				</div>
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
							role="status"
							aria-hidden="true"
						/>
						<span className="visually-hidden">Apuntando...</span>
					</>
				) : (
					"Apuntarse"
				)}
			</Button>
		</div>
	);
};

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

	return (
		<Card
			role="group"
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
					<Card.Title
						as="h3"
						id={titleId}
						className={`${styles.excursionTitle} mb-3`}
					>
						{name}
					</Card.Title>

					<div className={styles.excursionDetails}>
						<ExcursionDetailItem
							IconComponent={FiMapPin}
							text={area}
							label="Zona"
						/>
						<ExcursionDetailItem text={difficulty} label="Dificultad">
							{/* Mapea la dificultad a la clase CSS y asegura el contraste del texto. */}
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
								{joinError}
							</Alert>
						)}
						<JoinButton
							isJoined={isJoined}
							isJoining={isJoining}
							onJoin={() => handleJoin(id)}
						/>
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

const ExcursionCard = memo(ExcursionCardComponent);

export default ExcursionCard;
