import React from "react";
import { Card, Placeholder } from "react-bootstrap";
import cardStyles from "../css/ExcursionCard.module.css"; // Reutilizamos el CSS de la tarjeta real
import skeletonStyles from "../css/ExcursionCardSkeleton.module.css";

/**
 * Componente que muestra un placeholder con animación (skeleton)
 * para simular la carga de una ExcursionCard.
 * @param {{ isLoggedIn?: boolean }} props
 */
function ExcursionCardSkeleton({ isLoggedIn = false }) {
	return (
		<Card
			className={`${skeletonStyles.skeletonCard} h-100 w-100`}
			aria-hidden="true"
		>
			<Card.Body className="d-flex flex-column">
				<div>
					{/* Usamos los mismos componentes y clases que la tarjeta real */}
					<Placeholder
						as={Card.Title}
						animation="glow"
						className={cardStyles.excursionTitle}
					>
						<Placeholder xs={7} />
					</Placeholder>
					<Placeholder
						as={Card.Subtitle}
						animation="glow"
						className={`${cardStyles.excursionArea} mb-2`}
					>
						<Placeholder xs={4} />
					</Placeholder>
					{/* Contenedor para la descripción y el botón "Leer más" para replicar la estructura real */}
					<div>
						<Placeholder
							as={Card.Text}
							animation="glow"
							className={cardStyles.excursionDescription}
						>
							{/* 
							  Usamos placeholders responsivos para simular el reflujo del texto en diferentes tamaños de pantalla.
							  El número de líneas de placeholder se ajusta para que la altura del esqueleto coincida mejor
							  con la altura de una tarjeta real en cada breakpoint, evitando así el "salto" del layout.
							  - xs (1 columna): Más líneas.
							  - md (2 columnas): Menos líneas.
							  - lg (3 columnas): Aún menos líneas.
							  - xl (4 columnas): El menor número de líneas.
							*/}
							<span className="d-block d-md-none">
								{/* 7 líneas para móvil */}
								<Placeholder xs={12} /> <Placeholder xs={12} /> <Placeholder xs={12} /> <Placeholder xs={12} /> <Placeholder xs={12} /> <Placeholder xs={12} /> <Placeholder xs={4} />
							</span>
							<span className="d-none d-md-block d-lg-none">
								{/* 6 líneas para tabletas en vertical */}
								<Placeholder xs={12} /> <Placeholder xs={12} /> <Placeholder xs={12} /> <Placeholder xs={12} /> <Placeholder xs={12} /> <Placeholder xs={8} />
							</span>
							<span className="d-none d-lg-block d-xl-none">
								{/* 5 líneas para tabletas en horizontal */}
								<Placeholder xs={12} /> <Placeholder xs={12} /> <Placeholder xs={12} /> <Placeholder xs={12} /> <Placeholder xs={6} />
							</span>
							<span className="d-none d-xl-block">
								{/* 4 líneas para escritorio */}
								<Placeholder xs={12} /> <Placeholder xs={12} /> <Placeholder xs={12} /> <Placeholder xs={10} />
							</span>
						</Placeholder>
						{/* Placeholder para el botón "Leer más", que ocupa espacio en las tarjetas con texto largo */}
						<Placeholder animation="glow">
							<Placeholder xs={3} className="mt-1" />
						</Placeholder>
					</div>
					{/* Replicamos la estructura de los detalles (icono + texto) para mayor precisión */}
					<div className={`${cardStyles.excursionDetails} mt-3`}>
						<Placeholder as="div" animation="glow" className={cardStyles.detailItem}>
							<Placeholder xs={1} size="lg" /> {/* Placeholder para el icono */}
							<Placeholder xs={5} />{" "}
							{/* Placeholder para el texto (ej. "Dificultad: Media") */}
						</Placeholder>
						<Placeholder as="div" animation="glow" className={cardStyles.detailItem}>
							<Placeholder xs={1} size="lg" /> {/* Placeholder para el icono */}
							<Placeholder xs={5} /> {/* Placeholder para el texto (ej. "Tiempo: 4h") */}
						</Placeholder>
					</div>
				</div>
				{isLoggedIn && (
					<div className="mt-auto pt-3 border-top">
						<Placeholder.Button variant="primary" xs={5} className="float-end" />
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

export default ExcursionCardSkeleton;