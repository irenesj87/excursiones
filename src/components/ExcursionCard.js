import React, { useState } from "react"; // Importar useState
import { Card, Button, Row, Col } from "react-bootstrap";
import { FiChevronDown, FiChevronUp } from "react-icons/fi"; // Importamos los iconos
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/ExcursionCard.module.css";

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

function ExcursionCard({
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
	// Límite de caracteres para la descripción truncada
	const MAX_LENGTH = 200; 

	const toggleReadMore = (e) => {
		e.preventDefault(); // Prevenir cualquier comportamiento por defecto si es un enlace
		setIsExpanded(!isExpanded);
	};

	const displayDescription =
		description && description.length > MAX_LENGTH && !isExpanded
			? `${description.substring(0, MAX_LENGTH)}...`
			: description;

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
								className={`${styles.readMoreLink} p-0 mt-1 d-flex align-items-center`} // Cambiado a d-flex para que ocupe su propia línea
							>
								{isExpanded ? (
									<>Leer menos <FiChevronUp className="ms-1" /></>
								) : (
									<>Leer más <FiChevronDown className="ms-1" /></>
								)}
							</Button>
						)}
					</div>
					<div className={styles.excursionDetails}>
						<span
							className={`badge ${getDifficultyBadgeClass(
								difficulty
							)} mt-3 me-2`}
						>
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
							// Centramos el texto "Apuntado/a"
							<div className="text-center">
								<span className="text-success text-uppercase fw-bold">
									Apuntado/a
								</span>
							</div>
						) : (
							// justify-content-center en la Row centrará la Col de ancho automático en breakpoints 'sm' y mayores.
							<Row className="justify-content-center gx-0">
								<Col xs={12} sm="auto">
									{/* xs={12} para ancho completo en pequeño, sm="auto" para ancho de contenido en sm+ */}
									<Button onClick={onJoin} className="w-100">
										{/* w-100 para que el botón llene la Col */}
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

// Definición de PropTypes para el componente ExcursionCard
ExcursionCard.propTypes = {
	name: PropTypes.string.isRequired,
	area: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	difficulty: PropTypes.string.isRequired,
	time: PropTypes.string.isRequired,
	isLoggedIn: PropTypes.bool,
	isJoined: PropTypes.bool,
	onJoin: PropTypes.func,
};

export default ExcursionCard;
