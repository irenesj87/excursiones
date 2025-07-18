import { useState, memo, useMemo, useCallback } from "react";
import { Card, Button } from "react-bootstrap";
import {
	FiMapPin,
	FiChevronDown,
	FiChevronUp,
	FiClock,
	FiBarChart,
	FiCheckCircle,
} from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.css";
import ExcursionDetailItem from "./ExcursionDetailItem";
import styles from "../css/ExcursionCard.module.css";

// Límite de caracteres para la descripción truncada
const MAX_LENGTH = 150;

/**
 * Componente para la tarjeta de excursión.
 * @param {object} props - Las propiedades del componente.
 * @param {string | number} props.id - El ID de la excursión.
 * @param {string} props.name - El nombre de la excursión.
 * @param {string} props.area - La zona donde se realiza la excursión.
 * @param {string} props.description - La descripción de la excursión.
 * @param {string} props.difficulty - La dificultad de la excursión (ej. "Baja", "Media", "Alta").
 * @param {string} props.time - El tiempo estimado de la excursión.
 * @param {boolean} props.isLoggedIn - Indica si el usuario ha iniciado sesión.
 * @param {boolean} props.isJoined - Indica si el usuario ya está apuntado a la excursión.
 * @param {(id: string | number) => void} [props.onJoin] - Función que se ejecuta cuando el usuario se apunta a la excursión. Recibe el ID de la excursión.
 */
function ExcursionCardComponent({
	id,
	name,
	area,
	description,
	difficulty,
	time,
	isLoggedIn,
	isJoined,
	onJoin,
}) {
	/**
	 * Estado que controla si la descripción de la excursión está expandida o truncada.
	 * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
	 */
	const [isExpanded, setIsExpanded] = useState(false);

	/**
	 * Alterna el estado de `isExpanded` para mostrar u ocultar la descripción completa.
	 * Previene el comportamiento por defecto del evento si es llamado desde un elemento interactivo.
	 * @param {React.MouseEvent<HTMLButtonElement>} e - El evento del click.
	 * @returns {void}
	 */
	const toggleReadMore = (e) => {
		e.preventDefault();
		setIsExpanded(!isExpanded);
	};

	// Se muestra la descripción entera si hay menos de 150 caracteres o la muestra truncada si hay más (memoizada)
	const displayDescription = useMemo(() => {
		if (!description) return "";
		return description.length > MAX_LENGTH && !isExpanded
			? `${description.substring(0, MAX_LENGTH)}...`
			: description;
	}, [description, isExpanded]);

	/**
	 * Crea un 'handler' para el evento 'click' que llama a la función `onJoin` con el ID de la excursión.
	 * Se usa `useCallback` para asegurar que la función no se recree innecesariamente, lo que es beneficioso para la optimización 
	 * del rendimiento, especialmente porque `ExcursionCard` está memoizado.
	 * @returns {void}
	 * @callback handleJoin
	 * @param {string | number} id - El ID de la excursión a la que el usuario desea apuntarse.
	 * @param {function} onJoin - La función callback que se ejecuta para unirse a la excursión.
	 */
	const handleJoin = useCallback(() => {
		// Llama a la función onJoin (si existe) pasándole el id de la excursión.
		onJoin?.(id);
	}, [id, onJoin]);

	return (
		<Card className={`${styles.excursionItemCard} h-100 w-100`}>
			<Card.Body className="d-flex flex-column">
				<div>
					<Card.Title className={`${styles.excursionTitle} mb-3`}>
						{name}
					</Card.Title>
					<Card.Subtitle className={`${styles.excursionArea} mb-2`}>
						<FiMapPin className={styles.areaIcon} />
						<span>{area}</span>
					</Card.Subtitle>
					<div className={styles.excursionDescriptionContainer}>
						<Card.Text className={styles.excursionDescription}>
							{displayDescription}
						</Card.Text>
						{description && description.length > MAX_LENGTH && (
							<Button
								variant="link"
								onClick={toggleReadMore}
								className={`${styles.readMoreLink} p-0 mt-1 d-flex align-items-center`}
								aria-expanded={isExpanded}
							>
								{isExpanded ? (
									<>
										Leer menos <FiChevronUp className="ms-1" />
									</>
								) : (
									<>
										Leer más <FiChevronDown className="ms-1" />
									</>
								)}
							</Button>
						)}
					</div>
					<div className={`${styles.excursionDetails} mt-3`}>
						<ExcursionDetailItem IconComponent={FiBarChart} text={difficulty} />
						<ExcursionDetailItem IconComponent={FiClock} text={time} />
					</div>
				</div>
				{isLoggedIn && (
					<div className={`${styles.cardActionArea} mt-auto pt-3 border-top`}>
						{isJoined ? (
							<div className="d-grid d-md-flex justify-content-center justify-content-md-end">
								<div className={styles.joinedStatus}>
									<FiCheckCircle /> <span>Apuntado/a</span>
								</div>
							</div>
						) : (
							<div className="d-grid d-md-flex justify-content-md-end">
								<Button onClick={handleJoin} className={styles.joinButton}>
									Apuntarse
								</Button>
							</div>
						)}
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

const ExcursionCard = memo(ExcursionCardComponent);

export default ExcursionCard;
