import { memo, useCallback, useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import ExcursionDetailItem from "./ExcursionDetailItem";
import { FiMapPin, FiClock, FiCheckCircle } from "react-icons/fi";
import cn from "classnames";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/ExcursionCard.module.css";

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
	/**
	 * Crea un 'handler' para el evento 'click' que llama a la función `onJoin` con el ID de la excursión.
	 * Se usa `useCallback` para asegurar que la función no se recree innecesariamente, lo que es beneficioso para la optimización
	 * del rendimiento, especialmente porque `ExcursionCard` está memoizado.
	 * @returns {void}
	 * @callback handleJoin
	 * @param {string | number} id - El ID de la excursión a la que el usuario desea apuntarse.
	 * @param {function} onJoin - La función callback que se ejecuta para unirse a la excursión.
	 */
	const handleJoin = useCallback(async () => {
		if (isJoining) return; // Previene múltiples clicks
		setIsJoining(true);
		try {
			// Llama a la función onJoin (si existe) pasándole el id de la excursión.
			await onJoin?.(id);
			// Si tiene éxito, el componente se volverá a renderizar con isJoined=true, por lo que no es necesario
			// establecer isJoining en false aquí.
		} catch (error) {
			// Si hay un error, restablecemos el estado del botón para que el usuario pueda intentarlo de nuevo.
			setIsJoining(false);
		}
	}, [id, onJoin, isJoining]);

	const difficultyClassMap = {
		Baja: styles.difficultyLow,
		Media: styles.difficultyMedium,
		Alta: styles.difficultyHigh,
	};

	return (
		<Card
			className={cn(styles.excursionItemCard, "h-100 w-100", {
				[styles.isJoinedCard]: isJoined,
			})}
		>
			<Card.Body className="d-flex flex-column">
				<div>
					<Card.Title className={`${styles.excursionTitle} mb-3`}>
						{name}
					</Card.Title>

					<div className={styles.excursionDetails}>
						<ExcursionDetailItem
							IconComponent={FiMapPin}
							text={area}
							label="Zona"
						/>
						<div
							className={styles.detailItem}
							title={`Dificultad: ${difficulty}`}
						>
							{/* Etiqueta oculta para accesibilidad */}
							<span className="visually-hidden">Dificultad: </span>
							<span
								className={cn(
									styles.difficultyIndicator,
									difficultyClassMap[difficulty]
								)}
								aria-hidden="true"
							/>
							<span>{difficulty}</span>
						</div>
						<ExcursionDetailItem
							IconComponent={FiClock}
							text={time}
							label="Tiempo estimado"
						/>
					</div>
				</div>
				{isLoggedIn && (
					<div className={`${styles.cardActionArea} mt-auto pt-3`}>
						{isJoined ? (
							<div className="d-grid d-md-flex justify-content-center justify-content-md-end">
								<div className={styles.joinedStatus}>
									<FiCheckCircle /> <span>Apuntado/a</span>
								</div>
							</div>
						) : (
							<div className="d-grid d-md-flex justify-content-md-end">
								<Button
									onClick={handleJoin}
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
						)}
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

/**
 * Memoiza el componente ExcursionCardComponent para evitar renderizados innecesarios.
 * Esto es útil para mejorar el rendimiento, especialmente si el componente recibe props que no cambian
 * frecuentemente, como el ID, nombre, área, descripción, dificultad y tiempo de la excursión.
 * En este caso se hace porque su renderizado puede ser costoso si se renderiza muchas veces
 * en una lista de excursiones muy larga.
 */
const ExcursionCard = memo(ExcursionCardComponent);

export default ExcursionCard;
