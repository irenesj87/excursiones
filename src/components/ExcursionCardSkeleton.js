import { useCallback } from "react";
import { Card } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import cardStyles from "../css/ExcursionCard.module.css"; // Se reutiliza el CSS de la tarjeta real
import skeletonStyles from "../css/ExcursionCardSkeleton.module.css";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Componente que muestra un esqueleto de carga para una ExcursionCard.
 * @param {{ isLoggedIn?: boolean, isJoined?: boolean }} props
 */
function ExcursionCardSkeleton({ isLoggedIn = false, isJoined = false }) {
	// Función auxiliar para renderizar un elemento de detalle del esqueleto. Se memoiza para evitar recreaciones innecesarias en cada render.
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
			<Card.Body className="d-flex flex-column">
				<div>
					{/* Título */}
					<Skeleton height={21} width="70%" className="mb-3" />
					{/* Subtítulo (Área) */}
					<Skeleton height={16} width="40%" className="mb-2" />
					{/* Descripción y "Leer más" */}
					<div className={cardStyles.excursionDescriptionContainer}>
						<Skeleton count={4} />
						<Skeleton width="25%" className="mt-1" />
					</div>
					{/* Detalles (Dificultad, Tiempo) */}
					<div className={`${cardStyles.excursionDetails} mt-3`}>
						{renderDetailItem()}
						{renderDetailItem()}
					</div>
				</div>
				{/* Botón de "Apuntarse" */}
				{isLoggedIn && (
					<div className="mt-auto pt-3 border-top d-flex justify-content-end align-items-center">
						{isJoined ? (
							<div
								className={`${cardStyles.joinedStatus} d-flex align-items-center`}
							>
								<Skeleton circle width={22} height={22} />
								<Skeleton width={80} className="ms-2" />
							</div>
						) : (
							<Skeleton height={38} width={90} />
						)}
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

export default ExcursionCardSkeleton;
