import { Card } from "react-bootstrap";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import cardStyles from "./ExcursionCard.module.css"; // Se reutiliza el CSS de la tarjeta real
import detailItemStyles from "../ExcursionDetailItem/ExcursionDetailItem.module.css";
import skeletonStyles from "./ExcursionCardSkeleton.module.css";
import "react-loading-skeleton/dist/skeleton.css";

/** @typedef {object} ExcursionCardSkeletonProps
 * @property {boolean} [isLoggedIn=false] - Indica si el usuario ha iniciado sesión para mostrar el placeholder del botón.
 */

/**
 * Componente que muestra un esqueleto de carga para una ExcursionCard.
 * @param {ExcursionCardSkeletonProps} props
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
						<div className={detailItemStyles.detailItem}>
							<Skeleton circle width={20} height={20} />
							<Skeleton width={84} />
						</div>
						{/* Placeholder para la dificultad */}
						<div className={detailItemStyles.detailItem}>
							<Skeleton width={76} />
						</div>
						{/* Placeholder para el tiempo */}
						<div className={detailItemStyles.detailItem}>
							<Skeleton circle width={20} height={20} />
							<Skeleton width={58} />
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

ExcursionCardSkeleton.propTypes = {
	isLoggedIn: PropTypes.bool,
};

ExcursionCardSkeleton.defaultProps = {
	isLoggedIn: false,
};

export default ExcursionCardSkeleton;
