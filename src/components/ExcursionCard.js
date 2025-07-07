import { useState, memo, useMemo, useCallback } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import {
	FiChevronDown,
	FiChevronUp,
	FiClock,
	FiBarChart,
	FiCheckCircle,
} from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.css";
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
	// useState que dice si una descripción está expandida o no
	const [isExpanded, setIsExpanded] = useState(false);

	// Función para alternar la visibilidad completa de la descripción
	const toggleReadMore = (e) => {
		e.preventDefault(); // Prevenir cualquier comportamiento por defecto si es un enlace
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
	 * Se usa `useCallback` para asegurar que la función no se recree innecesariamente,
	 * lo que es beneficioso para la optimización del rendimiento, especialmente porque `ExcursionCard` está memoizado.
	 */
	const handleJoin = useCallback(() => {
		// Llama a la función onJoin (si existe) pasándole el id de la excursión.
		onJoin?.(id);
	}, [id, onJoin]);

	return (
		<Card className={styles.excursionItemCard}>
			<Card.Body className="d-flex flex-column">
				<div>
					<Card.Title className={styles.excursionTitle}>{name}</Card.Title>
					<Card.Subtitle className={`${styles.excursionArea} mb-2`}>
						{area}
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
						<div className={styles.detailItem}>
							<FiBarChart className={styles.detailIcon} />
							<span>{difficulty}</span>
						</div>
						<div className={styles.detailItem}>
							<FiClock className={styles.detailIcon} />
							<span>{time}</span>
						</div>
					</div>
				</div>
				{isLoggedIn && (
					<div className="mt-auto pt-3 border-top d-flex justify-content-center justify-content-md-end">
						{isJoined ? (
							<div className={styles.joinedStatus}>
								<FiCheckCircle /> <span>Apuntado/a</span>
							</div>
						) : (
							<Row className="justify-content-sm-end gx-0 w-100">
								<Col xs={12} sm="auto">
									<Button onClick={handleJoin} className="w-100">
										Apuntarse
									</Button>
								</Col>
							</Row>
						)}
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

const ExcursionCard = memo(ExcursionCardComponent);

export default ExcursionCard;
