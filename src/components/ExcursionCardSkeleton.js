import { Card, Row, Col } from "react-bootstrap";
import { useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import cardStyles from "../css/ExcursionCard.module.css"; // Se reutiliza el CSS de la tarjeta real
import skeletonStyles from "../css/ExcursionCardSkeleton.module.css";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Componente que muestra un esqueleto de carga para una ExcursionCard.
 * @param {{ isLoggedIn?: boolean, isJoined?: boolean }} props
 */
function ExcursionCardSkeleton({ isLoggedIn = false, isJoined = false }) {
	// Función auxiliar para renderizar un elemento de detalle del esqueleto. Se memoiza para evitar recreaciones innecesarias en
	// cada render.
	const renderDetailItem = useCallback(
		() => (
			<div className={cardStyles.detailItem}>
				<Skeleton circle width={20} height={20} />
				<Skeleton width="60%" />
			</div>
		),
		[]
	);

	return (
		<Card
			className={`${skeletonStyles.skeletonCard} h-100 w-100`}
			aria-hidden="true"
		>
			<Card.Body className="d-flex flex-column flex-grow-1">
				<div>
					{/* Título */}
					<Skeleton height={21} width="70%" className="mb-3" />
					{/* Detalles (Zona, Dificultad, Tiempo) */}
					<div className={cardStyles.excursionDetails}>
						{renderDetailItem()}
						{renderDetailItem()}
						{renderDetailItem()}
					</div>
				</div>
				{/* Botón de "Apuntarse" */}
				{isLoggedIn && (
					<div className="mt-auto pt-3 border-top">
						{isJoined ? (
							<div className="d-grid d-md-flex justify-content-center justify-content-md-end">
								<div
									className={`${cardStyles.joinedStatus} d-flex align-items-center`}
								>
									<Skeleton circle width={22} height={22} />
									<Skeleton width={80} className="ms-2" />
								</div>
							</div>
						) : (
							<Row className="justify-content-md-end">
								<Col xs={12} md="auto">
									<Skeleton
										height={38}
										className="w-100"
										// El min-width da al esqueleto un ancho base en breakpoints 'md' y superiores
										style={{ minWidth: 100 }}
									/>
								</Col>
							</Row>
						)}
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

export default ExcursionCardSkeleton;
