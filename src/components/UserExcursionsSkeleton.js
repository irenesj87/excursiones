import { Row, Col, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ExcursionCardSkeleton from "./ExcursionCardSkeleton";
import styles from "../css/UserPage.module.css";

/** @typedef {import("../types").RootState} RootState */

const UserExcursionsSkeleton = ({ numExcursions = 0 }) => {
	const mode = useSelector(
		/** @param {RootState} state */
		(state) => state.themeReducer.mode
	);

	// Define los colores del esqueleto según el tema para una experiencia visual consistente.
	// Para el modo claro, se ha aumentado el contraste entre el color base y el de resaltado
	// para que la animación sea más perceptible, similar a como se ve en el modo oscuro.
	const baseColor = mode === "dark" ? "#202020" : "#e0e0e0";
	const highlightColor = mode === "dark" ? "#444" : "#f5f5f5";
	return (
		<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
			<Card className={`${styles.excursionsCard} h-100 d-flex flex-column`}>
				<Card.Header className={styles.cardHeader}>
					Excursiones a las que te has apuntado
				</Card.Header>
				<Card.Body className="d-flex flex-column flex-grow-1">
					<Row xs={1} md={2} className="g-3">
						{/* Muestra 4 tarjetas de esqueleto para simular la lista. */}
						{Array.from({ length: 4 }).map((_, i) => (
							// eslint-disable-next-line react/no-array-index-key
							<Col key={`user-excursion-skeleton-${i}`}>
								<ExcursionCardSkeleton isLoggedIn={true} isJoined={true} />
							</Col>
						))}
						{/* Simula los elementos de paginación */}
					</Row>
					{/* Condición para mostrar el esqueleto de paginación solo si hay más de 4 "excursiones" */}
					{numExcursions > 4 && (
						<Col className="d-flex justify-content-center mt-4 pt-2 pb-4 border-top">
							<Skeleton height={38} width={130} />
						</Col>
					)}
				</Card.Body>
			</Card>
		</SkeletonTheme>
	);
};

export default UserExcursionsSkeleton;
