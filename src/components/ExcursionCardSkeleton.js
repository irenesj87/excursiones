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
	// Objeto de configuración para las líneas de la descripción en cada breakpoint.
	// Esto centraliza la lógica y hace que sea más fácil de modificar.
	const descriptionLineConfigs = {
		xs: {
			className: "d-block d-md-none",
			lines: [12, 12, 12, 4], // 4 líneas para xs
		},
		md: {
			className: "d-none d-md-block d-lg-none",
			lines: [12, 12, 12, 12, 12, 8], // 6 líneas para md
		},
		lg: {
			className: "d-none d-lg-block d-xl-none",
			lines: [12, 12, 12, 12, 12, 12, 8], // 7 líneas para lg
		},
		xl: {
			className: "d-none d-xl-block d-xxl-none",
			lines: [12, 12, 12, 10], // 4 líneas para xl
		},
		xxl: { className: "d-none d-xxl-block", lines: [12, 12, 8] }, // 3 líneas para xxl
	};

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
							{Object.entries(descriptionLineConfigs).map(
								([breakpoint, config]) => (
									<span key={breakpoint} className={config.className}>
										{config.lines.map((width, index) => (
											// Usamos una clave única y estable combinando el breakpoint y el índice.
											// Esto soluciona la advertencia de Sonar "Do not use Array index in keys".
											<React.Fragment key={`${breakpoint}-line-${index}`}>
												<Placeholder xs={width} />{" "}
											</React.Fragment>
										))}
									</span>
								)
							)}
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
