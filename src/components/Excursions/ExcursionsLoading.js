import { memo } from "react";
import { Row, Col } from "react-bootstrap";
import { SkeletonTheme } from "react-loading-skeleton";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";
import ExcursionCardSkeleton from "../ExcursionCard/ExcursionCardSkeleton";
import styles from "./Excursions.module.css";

/**
 * Componente para mostrar el esqueleto mientras las excursiones se cargan.
 * @param {ExcursionsLoadingProps} props
 * @typedef {object} ExcursionsLoadingProps
 * @property {boolean} isLoggedIn - Indica si el usuario ha iniciado sesión.
 */
const ExcursionsLoadingComponent = ({ isLoggedIn }) => {
	const skeletonThemeProps = useSkeletonTheme();
	return (
		<SkeletonTheme {...skeletonThemeProps}>
			<div className={styles.excursionsContainer}>
				<h2 className={styles.title}>Próximas excursiones</h2>
				<div role="status" aria-live="polite" className="visually-hidden">
					Cargando excursiones...
				</div>
				<Row as="ul" className="gx-4 gy-5 list-unstyled">
					{Array.from({ length: 8 }).map((_, index) => (
						<Col
							as="li"
							xs={12}
							md={6}
							lg={4}
							xl={3}
							// eslint-disable-next-line react/no-array-index-key
							key={`skeleton-card-${index}`}
							className="d-flex"
						>
							<ExcursionCardSkeleton isLoggedIn={isLoggedIn} />
						</Col>
					))}
				</Row>
			</div>
		</SkeletonTheme>
	);
};

const ExcursionsLoading = memo(ExcursionsLoadingComponent);

export default ExcursionsLoading;
