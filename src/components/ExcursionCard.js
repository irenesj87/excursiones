import { memo, useCallback, useState } from "react";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import ExcursionDetailItem from "./ExcursionDetailItem";
import { FiMapPin, FiClock, FiCheckCircle } from "react-icons/fi";
import cn from "classnames";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/ExcursionCard.module.css";

/**
 * Renderiza el botón para unirse a una excursión. Muestra un botón "Apuntarse", un estado de carga o un estado "Apuntado/a".
 * @param {object} props
 * @param {boolean} props.isJoined - Indica si el usuario se ha apuntado a la excursión.
 * @param {boolean} props.isJoining - Muestra si la acción de unirse está en progreso.
 * @param {() => void} props.onJoin - Callback que se ejecuta cuando se cliquea el botón para apuntarse.
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

/**
 * Componente para la tarjeta de excursión.
 * @param {object} props - Las propiedades del componente.
 * @param {string | number} props.id - El ID de la excursión.
 * @param {string} props.name - El nombre de la excursión.
 * @param {string} props.area - La zona donde se realiza la excursión.
 * @param {string} props.difficulty - La dificultad de la excursión (ej. "Baja", "Media", "Alta").
 * @param {string} props.time - El tiempo estimado de la excursión.
 * @param {boolean} props.isLoggedIn - Indica si el usuario ha iniciado sesión.
 * @param {boolean} props.isJoined - Indica si el usuario ya está apuntado a la excursión.
 * @param {(id: string | number) => Promise<void>} [props.onJoin] - Función asíncrona que se ejecuta cuando el usuario se apunta a la excursión. Recibe el ID de la excursión.
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
	const [isJoining, setIsJoining] = useState(false);
	const [joinError, setJoinError] = useState(null);
	/*
	 * Crea un 'handler' que llama a la función `onJoin` con el ID de la excursión.
	 * Se usa `useCallback` para memoizar la función y evitar que se recree en cada renderizado, optimizando el rendimiento.
	 * El botón se deshabilita durante la carga para prevenir múltiples clicks.
	 */
	const handleJoin = useCallback(async () => {
		if (isJoining) return; // Evita múltiples ejecuciones si ya está en proceso
		setIsJoining(true);
		setJoinError(null); // Limpiar errores previos al reintentar
		try {
			// Llama a la función onJoin (si existe) pasándole el id de la excursión.
			await onJoin?.(id);
			// Si tiene éxito, el componente padre actualizará `isJoined`, y el estado `isJoining` de este componente
			// desaparecerá al no renderizarse más el botón.
		} catch (error) {
			console.error("Error al unirse a la excursión en la tarjeta:", error);
			setJoinError(
				error.message || "No se pudo completar la acción. Inténtalo de nuevo."
			);
			// Si hay un error, restablecemos el estado del botón para que el usuario pueda intentarlo de nuevo.
			setIsJoining(false);
		}
	}, [id, onJoin, isJoining]);

	// Genera un ID único para el título, que se usará para la accesibilidad.
	// Reemplaza espacios y caracteres especiales para crear un ID válido.
	const titleId = `excursion-title-${id}`;

	const difficultyClassMap = {
		Baja: styles.difficultyLow,
		Media: styles.difficultyMedium,
		Alta: styles.difficultyHigh,
	};

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
							<div
								className={cn(
									styles.difficultyBadge,
									difficultyClassMap[difficulty]
								)}
							>
								<span className={styles.difficultyTextLight}>{difficulty}</span>
							</div>
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
								onClose={() => setJoinError(null)}
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
							onJoin={handleJoin}
						/>
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

/**
 * Componente memoizado para la tarjeta de excursión.
 *
 * `memo` se utiliza para optimizar el rendimiento, evitando renderizados innecesarios
 * si las propiedades (`props`) del componente no han cambiado. Esto es especialmente útil
 * en listas donde muchos elementos pueden ser renderizados.
 */
const ExcursionCard = memo(ExcursionCardComponent);

export default ExcursionCard;
