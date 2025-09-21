import { Card } from "react-bootstrap";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";
import cardStyles from "./ExcursionCard.module.css"; // Se reutiliza el CSS de la tarjeta real
import detailItemStyles from "../ExcursionDetailItem/ExcursionDetailItem.module.css";
import "react-loading-skeleton/dist/skeleton.css";

// Define las dimensiones del esqueleto como constantes para evitar "números mágicos"
// y facilitar el mantenimiento.
/**
 * @constant {object} SKELETON_SIZES - Define las dimensiones y anchos para los elementos del esqueleto.
 * y facilitar el mantenimiento.
 */
const SKELETON_SIZES = {
	TITLE_HEIGHT: 21,
	TITLE_WIDTH: "70%",
	ICON_SIZE: 20,
	AREA_TEXT_WIDTH: 84,
	DIFFICULTY_TEXT_WIDTH: 76,
	TIME_TEXT_WIDTH: 58,
	BUTTON_HEIGHT: 38,
	BUTTON_MIN_WIDTH: 100,
};

/**
 * @typedef {object} DetailItemSkeletonProps
 * @property {boolean} [withIcon=false] - Si se debe mostrar el esqueleto de un icono.
 * @property {number | string} width - El ancho del esqueleto de texto.
 */

/**
 * Componente auxiliar para renderizar el esqueleto de un ítem de detalle.
 * @param {DetailItemSkeletonProps} props
 */
const DetailItemSkeleton = ({ withIcon = false, width }) => (
	<div className={detailItemStyles.detailItem}>
		{withIcon && (
			<Skeleton
				circle
				width={SKELETON_SIZES.ICON_SIZE}
				height={SKELETON_SIZES.ICON_SIZE}
			/>
		)}
		<Skeleton width={width} />
	</div>
);

/** @typedef {object} ExcursionCardSkeletonProps
 * @property {boolean} [isLoggedIn=false] - Indica si el usuario ha iniciado sesión para mostrar el placeholder del botón.
 */

/**
 * Componente que muestra un esqueleto de carga para una ExcursionCard.
 * @param {ExcursionCardSkeletonProps} props
 */
function ExcursionCardSkeleton({ isLoggedIn = false }) {
	const { baseColor, highlightColor } = useSkeletonTheme();

	return (
		<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
			<Card
				className={`${cardStyles.excursionItemCard} h-100 w-100`}
				aria-hidden="true"
				data-testid="excursion-card-skeleton"
			>
				<Card.Body className="d-flex flex-column flex-grow-1">
					<div>
						{/* Título */}
						<Skeleton
							height={SKELETON_SIZES.TITLE_HEIGHT}
							width={SKELETON_SIZES.TITLE_WIDTH}
							className="mb-3"
						/>
						{/* Detalles (Zona, Dificultad, Tiempo) */}
						<div className={cardStyles.excursionDetails}>
							<DetailItemSkeleton
								withIcon
								width={SKELETON_SIZES.AREA_TEXT_WIDTH}
							/>
							<DetailItemSkeleton
								width={SKELETON_SIZES.DIFFICULTY_TEXT_WIDTH}
							/>
							<DetailItemSkeleton
								withIcon
								width={SKELETON_SIZES.TIME_TEXT_WIDTH}
							/>
						</div>
					</div>
					{/* Botón de "Apuntarse" */}
					{isLoggedIn && (
						<div
							className="mt-auto pt-3"
							data-testid="button-skeleton-container"
						>
							<div className="d-grid d-md-flex justify-content-md-end">
								<Skeleton
									height={SKELETON_SIZES.BUTTON_HEIGHT}
									className="w-100"
									style={{ minWidth: SKELETON_SIZES.BUTTON_MIN_WIDTH }}
								/>
							</div>
						</div>
					)}
				</Card.Body>
			</Card>
		</SkeletonTheme>
	);
}

export default ExcursionCardSkeleton;
