import { useState, memo, useMemo } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/ExcursionCard.module.css";

// Límite de caracteres para la descripción truncada
const MAX_LENGTH = 150;

// Función para poner las badges de diferente color en función de la dificultad de la excursión
const getDifficultyBadgeClass = (difficulty) => {
	switch (difficulty?.toLowerCase()) {
		case "baja":
			return "bg-success"; // Verde para baja
		case "media":
			return "bg-warning text-dark"; // Amarillo para media
		case "alta":
			return "bg-danger"; // Roja para alta
		default:
			return "bg-secondary";
	}
};

// Componente memoizado para la tarjeta de excursión
const ExcursionCard = memo(function ExcursionCard({
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

	const difficultyBadgeClass = useMemo(() => {
		return getDifficultyBadgeClass(difficulty);
	}, [difficulty]);

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
					<div className={styles.excursionDetails}>
						<span className={`badge ${difficultyBadgeClass} mt-3 me-2`}>
							<span>Dificultad:</span> {difficulty}
						</span>
						<span className={`badge bg-info text-dark mt-3`}>
							<span>Tiempo estimado:</span> {time}
						</span>
					</div>
				</div>
				{isLoggedIn && (
					<div className="mt-auto pt-3 border-top">
						{isJoined ? (
							<div className="text-center text-sm-end">
								<span className="text-success text-uppercase fw-bold">
									Apuntado/a
								</span>
							</div>
						) : (
							<Row className="justify-content-sm-end gx-0">
								<Col xs={12} sm="auto">
									<Button onClick={onJoin} className="w-100">
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
});

export default ExcursionCard;
