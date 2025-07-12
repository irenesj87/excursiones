import { Row, Col, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import UserExcursionsSkeleton from "./UserExcursionsSkeleton.js";
import "react-loading-skeleton/dist/skeleton.css";
import userInfoStyles from "../css/UserInfoForm.module.css";
import styles from "../css/UserPage.module.css";

/** @typedef {import("../types").RootState} RootState */

/**
 * Componente que muestra un esqueleto de carga para la página de perfil de usuario.
 * Simula la estructura de la `UserPage` mientras los componentes reales se cargan.
 */
function UserPageSkeleton() {
	const mode = useSelector(
		/** @param {RootState} state */
		(state) => state.themeReducer.mode
	);

	// Define los colores del esqueleto según el tema para una experiencia visual consistente.
	const baseColor = mode === "dark" ? "#202020" : "#e0e0e0";
	const highlightColor = mode === "dark" ? "#444" : "#f5f5f5";

	/**
	 * Renderiza un esqueleto para la tarjeta de información del usuario.
	 * @returns {React.ReactElement}
	 */
	const renderUserInfoPlaceholder = () => (
		<Card className={`${userInfoStyles.profileCard} h-100`}>
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
							<Skeleton height={38} width={70} />
						</Col>
					</Row>
				</div>
			</Card.Body>
		</Card>
	);

	return (
		<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
			<Row className="justify-content-center pt-2" aria-hidden="true">
				<Col xs={11} md={11} lg={11} xl={8}>
					<h2 className={`${styles.title} mb-3`}>Tu perfil</h2>
					<Row className="mb-3">
						<Col lg={6} xl={4} className="mb-4 mb-lg-0">
							{renderUserInfoPlaceholder()}
						</Col>
						<Col lg={6} xl={8}>
							<UserExcursionsSkeleton />
						</Col>
					</Row>
				</Col>
			</Row>
		</SkeletonTheme>
	);
}

export default UserPageSkeleton;
