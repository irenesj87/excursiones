import { Row, Col, Card } from "react-bootstrap";
import ExcursionCardSkeleton from "./ExcursionCardSkeleton";
import styles from "../css/UserPage.module.css";

/**
 * Componente que muestra un esqueleto de carga para la lista de excursiones del usuario.
 * No incluye `SkeletonTheme` para poder ser anidado en otros componentes de esqueleto.
 * @returns {React.ReactElement}
 */
function UserExcursionsSkeleton() {
	return (
		<Card className={`${styles.excursionsCard} h-100 d-flex flex-column`}>
			<Card.Header className={styles.cardHeader}>
				Excursiones a las que te has apuntado
			</Card.Header>
			<Card.Body className="d-flex flex-column flex-grow-1">
				<Row xs={1} md={2} className="g-3">
					{/* Muestra 4 tarjetas de esqueleto para simular la lista */}
					{[...Array(4)].map((_, i) => (
						// eslint-disable-next-line react/no-array-index-key
						<Col key={`user-excursion-skeleton-${i}`}>
							<ExcursionCardSkeleton isLoggedIn={true} isJoined={true} />
						</Col>
					))}
				</Row>
			</Card.Body>
		</Card>
	);
}

export default UserExcursionsSkeleton;