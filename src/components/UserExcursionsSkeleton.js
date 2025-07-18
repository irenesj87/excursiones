import { Row, Col, Card } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import ExcursionCardSkeleton from "./ExcursionCardSkeleton";
import styles from "../css/UserPage.module.css";

const UserExcursionsSkeleton = ({ numExcursions = 0 }) => (
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
);

export default UserExcursionsSkeleton;
