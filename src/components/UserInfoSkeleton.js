import { Row, Col, Card } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import userInfoStyles from "../css/UserInfoForm.module.css";
import styles from "../css/UserPage.module.css";

/**
 * Renderiza un esqueleto para la tarjeta de información del usuario.
 * @returns {React.ReactElement}
 */
function UserInfoSkeleton() {
	return (
		<Card className={`${userInfoStyles.profileCard} w-100 flex-grow-1`}>
			<Card.Header className={styles.cardHeader}>Datos Personales</Card.Header>
			<Card.Body className="d-flex flex-column">
				<div className="flex-grow-1">
					{/* Simula 4 filas de etiqueta + input, como en UserInfoForm */}
					{[...Array(4)].map((_, i) => (
						<Row
							// eslint-disable-next-line react/no-array-index-key
							key={`user-info-placeholder-row-${i}`}
							className="mb-3 gx-2 align-items-center"
						>
							<Col sm={3} className="text-sm-end">
								<Skeleton width="80%" />
							</Col>
							<Col sm={9}>
								<Skeleton height={38} />
							</Col>
						</Row>
					))}
				</div>
				<div className="mt-auto border-top pt-3">
					<Row className="justify-content-sm-end">
						<Col xs={12} sm="auto">
							<Skeleton
								height={38}
								className="w-100"
								style={{ minWidth: 70 }}
							/>
						</Col>
					</Row>
				</div>
			</Card.Body>
		</Card>
	);
}

export default UserInfoSkeleton;