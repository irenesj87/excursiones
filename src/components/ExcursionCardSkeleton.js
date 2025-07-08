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
							<span className="d-block d-md-none">
								{/* 4 líneas para xs */}
								<Placeholder xs={12} /> <Placeholder xs={12} />
								<Placeholder xs={12} /> <Placeholder xs={4} />
							</span>
							<span className="d-none d-md-block d-xl-none">
								{/* 7 líneas para tabletas (md y lg) */}
								<Placeholder xs={12} /> <Placeholder xs={12} />
								<Placeholder xs={12} /> <Placeholder xs={12} />
								<Placeholder xs={12} /> <Placeholder xs={12} />{" "}
								<Placeholder xs={8} />
							</span>
							<span className="d-none d-xl-block d-xxl-none">
								{/* 4 líneas para escritorio (xl) */}
								<Placeholder xs={12} /> <Placeholder xs={12} />
								<Placeholder xs={12} /> <Placeholder xs={10} />
							</span>
							<span className="d-none d-xxl-block">
								{/* 3 líneas para escritorio grande (xxl) */}
								<Placeholder xs={12} /> <Placeholder xs={12} />
								<Placeholder xs={8} />
							</span>
						</Placeholder>
						{/* Placeholder para el botón "Leer más", que ocupa espacio en las tarjetas con texto largo */}
						<Placeholder animation="glow">
							<Placeholder xs={3} className="mt-1 mb-1" />
						</Placeholder>
					</div>
					{/* Replicamos la estructura de los detalles (icono + texto) para mayor precisión */}
					<div className={`${cardStyles.excursionDetails} mt-3`}>
						<Placeholder
							as="div"
							animation="glow"
							className={cardStyles.detailItem}
						>
							<Placeholder xs={1} size="lg" /> {/* Placeholder para el icono */}
							<Placeholder xs={5} />
							{/* Placeholder para el texto (ej. "Dificultad: Media") */}
						</Placeholder>
						<Placeholder
							as="div"
							animation="glow"
							className={cardStyles.detailItem}
						>
							<Placeholder xs={1} size="lg" /> {/* Placeholder para el icono */}
							<Placeholder xs={5} />
							{/* Placeholder para el texto (ej. "Tiempo: 4h") */}
						</Placeholder>
					</div>
				</div>
				{isLoggedIn && (
					<div className="mt-auto pt-3 border-top">
						<Placeholder.Button
							variant="primary"
							xs={5}
							className="float-end"
						/>
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

export default ExcursionCardSkeleton;
