import { Row, Col } from "react-bootstrap";
import { useSelector, shallowEqual } from "react-redux";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "../css/UserPage.module.css";

import UserInfoSkeleton from "./UserInfoSkeleton"; // Import the extracted component
import UserExcursionsSkeleton from "./UserExcursionsSkeleton"; // Import the extracted component
/** @typedef {import("../types").RootState} RootState */

/**
 * Componente que muestra un esqueleto de carga para la página de perfil de usuario.
 * Simula la estructura de la `UserPage` mientras los componentes reales se cargan.
 */
function UserPageSkeleton() {
	const { mode, user } = useSelector(
		/** @param {RootState} state */
		(state) => ({
			mode: state.themeReducer.mode,
			user: state.loginReducer.user,
		}),
		shallowEqual
	);

	const numExcursions = user?.excursions?.length ?? 0;

	// Define los colores del esqueleto según el tema para una experiencia visual consistente.
	const baseColor = mode === "dark" ? "#202020" : "#e0e0e0";
	const highlightColor = mode === "dark" ? "#444" : "#f5f5f5";

	return (
		<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
			<Row className="justify-content-center pt-2" aria-hidden="true">
				<Col xs={11} md={11} lg={11} xl={8}>
					<h2 className={`${styles.title} mb-3`}>Tu perfil</h2>
					<Row className="mb-3">
						<Col lg={6} xl={4} className="mb-4 mb-lg-0">
							<UserInfoSkeleton />
						</Col>
						<Col lg={6} xl={8}>
							<UserExcursionsSkeleton numExcursions={numExcursions} />
						</Col>
					</Row>
				</Col>
			</Row>
		</SkeletonTheme>
	);
}

export default UserPageSkeleton;
