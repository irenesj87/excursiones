import { Card } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import cardStyles from "./ExcursionCard.module.css"; // Se reutiliza el CSS de la tarjeta real
import skeletonStyles from "./ExcursionCardSkeleton.module.css";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Componente que muestra un esqueleto de carga para una ExcursionCard.
 * @param {object} props
 * @param {boolean} [props.isLoggedIn=false] - Indica si el usuario ha iniciado sesión para mostrar el placeholder del botón.
 */
function ExcursionCardSkeleton({ isLoggedIn = false }) {
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
						{/* Placeholder para la zona */}
						<div className={cardStyles.detailItem}>
							<Skeleton circle width={20} height={20} />
							<Skeleton width={84} />
						</div>
						{/* Placeholder para la dificultad */}
						<div className={cardStyles.detailItem}>
							<Skeleton circle width={20} height={20} />
							<Skeleton width={42} />
						</div>
						{/* Placeholder para el tiempo */}
						<div className={cardStyles.detailItem}>
							<Skeleton circle width={20} height={20} />
							<Skeleton width={44} />
						</div>
					</div>
				</div>
				{/* Botón de "Apuntarse" */}
				{isLoggedIn && (
					<div className="mt-auto pt-3">
						<div className="d-grid d-md-flex justify-content-md-end">
							<Skeleton
								height={38}
								className="w-100"
								// El min-width da al esqueleto un ancho base en breakpoints 'md' y superiores
								style={{ minWidth: 100 }}
							/>
						</div>
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

export default ExcursionCardSkeleton;
