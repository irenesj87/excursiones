import { Row, Col, Card, Form } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import userInfoStyles from "../../css/UserInfoForm.module.css";

/**
 * Renderiza un esqueleto para la tarjeta de información del usuario de la página de usuario.
 * @returns {React.ReactElement}
 */
function UserInfoSkeleton() {
	return (
		<Card className={`${userInfoStyles.profileCard} w-100 flex-grow-1`}>
			<Card.Header as="h3" className={userInfoStyles.cardHeader}>
				Datos Personales
			</Card.Header>
			<Card.Body className={`${userInfoStyles.cardBody} d-flex flex-column`}>
				<div>
					{/* Simula la fila de Correo (solo texto) */}
					<Row className="mb-3 gx-2 align-items-center">
						<Form.Label column sm={3} className="text-sm-end fw-bold">
							<Skeleton width="80%" />
						</Form.Label>
						<Col sm={9}>
							<Skeleton width="60%" />
						</Col>
					</Row>
					{/* Simula 2 filas de etiqueta + input con margen estándar */}
					{[...Array(2)].map((_, i) => (
						<Row
							// eslint-disable-next-line react/no-array-index-key
							key={`user-info-placeholder-row-${i}`}
							className="mb-3 gx-2 align-items-center"
						>
							<Form.Label column sm={3} className="text-sm-end fw-bold">
								<Skeleton width="80%" />
							</Form.Label>
							<Col sm={9}>
								<Skeleton height={38} />
							</Col>
						</Row>
					))}
					{/* Simula la última fila con un margen inferior mayor para separarla de los botones */}
					<Row className="mb-4 gx-2 align-items-center">
						<Form.Label column sm={3} className="text-sm-end fw-bold">
							<Skeleton width="80%" />
						</Form.Label>
						<Col sm={9}>
							<Skeleton height={38} />
						</Col>
					</Row>
				</div>
				<div className="mt-auto pt-3">
					<Row className="justify-content-sm-end gx-0">
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
