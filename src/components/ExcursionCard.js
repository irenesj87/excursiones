import React from "react";
import { Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/ExcursionCard.module.css";

// Destructure props for easier access, including the new ones for button logic
function ExcursionCard({
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
	return (
		<Card className={styles.excursionItemCard}>
			<Card.Body className="d-flex flex-column">
				{/* Use flex column for layout */}
				<div>
					{/* Wrapper for main content */}
					<Card.Title className={styles.excursionTitle}>{name}</Card.Title>
					<Card.Subtitle className="mb-2">{area}</Card.Subtitle>
					<Card.Text className={styles.excursionDescription}>
						{description}
					</Card.Text>
					<div className={styles.excursionDetails}>
						<span className="badge bg-warning me-2 mb-2">
							Dificultad: {difficulty}
						</span>
						<span className="badge bg-info mb-2">
							Tiempo estimado: {time}
						</span>
					</div>
				</div>
				{/* --- Section for the button/text --- */}
				{/* Only show button/text area if user is logged in */}
				{isLoggedIn && (
					<div className="mt-auto pt-3 d-flex justify-content-center align-items-center border-top">
						{isJoined ? (
							// If joined, show the text
							<span className="text-success text-uppercase fw-bold">
								Apuntado/a
							</span>
						) : (
							// If not joined, show the button and attach the onJoin handler
							<Button onClick={onJoin}>Apuntarse</Button>
						)}
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

export default ExcursionCard;
