import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import cardStyles from "../css/ExcursionCard.module.css"; // Reutilizamos el CSS de la tarjeta real
import skeletonStyles from "../css/ExcursionCardSkeleton.module.css";
import "react-loading-skeleton/dist/skeleton.css";

/** @typedef {import("../types").RootState} RootState */

/**
 * Componente que muestra un esqueleto de carga para una ExcursionCard.
 * Utiliza react-loading-skeleton para una apariencia consistente y se adapta al modo oscuro.
 * @param {{ isLoggedIn?: boolean }} props
 */
function ExcursionCardSkeleton({ isLoggedIn = false }) {
	const mode = useSelector(
		/** @param {RootState} state */
		(state) => state.themeReducer.mode
	);

	// Define los colores del esqueleto según el tema.
	const baseColor = mode === "dark" ? "#202020" : "#e0e0e0";
	const highlightColor = mode === "dark" ? "#444" : "#f5f5f5";

	const renderDetailItem = () => (
		// Replicamos la estructura de flexbox con gap del componente real,
		// por lo que no necesitamos márgenes manuales.
		<div className={cardStyles.detailItem}>
			<Skeleton circle width={20} height={20} />
			<Skeleton width="60%" />
		</div>
	);

	return (
		<Card
			className={`${skeletonStyles.skeletonCard} h-100 w-100`}
			aria-hidden="true"
		>
			<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
				<Card.Body className="d-flex flex-column">
					<div>
						{/* Título */}
						<Skeleton height={21} width="70%" style={{ marginBottom: "0.5rem" }} />
						{/* Subtítulo (Área) */}
						<Skeleton height={16} width="40%" className="mb-2" />

						{/* Descripción y "Leer más" */}
						<div className={cardStyles.excursionDescriptionContainer}>
							<Skeleton count={4} />
							<Skeleton width="25%" style={{ marginTop: "0.25rem" }} />
						</div>

						{/* Detalles (Dificultad, Tiempo) */}
						<div className={`${cardStyles.excursionDetails} mt-3`}>
							{renderDetailItem()}
							{renderDetailItem()}
						</div>
					</div>

					{/* Botón de "Apuntarse" */}
					{isLoggedIn && (
						<div className="mt-auto pt-3 border-top d-flex justify-content-end">
							<Skeleton height={38} width={90} />
						</div>
					)}
				</Card.Body>
			</SkeletonTheme>
		</Card>
	);
}

export default ExcursionCardSkeleton;
