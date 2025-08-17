import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { SkeletonTheme } from "react-loading-skeleton";
import UserInfoSkeleton from "./UserInfoSkeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "../../css/UserPage.module.css";

/** @typedef {import("../../types").RootState} RootState */

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

	return (
		<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
			<Row
				as="main"
				className="justify-content-center pt-2 h-100"
				aria-hidden="true"
			>
				<Col xs={11} md={11} lg={11} xl={8} className="d-flex flex-column pb-5">
					<h2 className={`${styles.title} mb-3`}>Tu perfil</h2>
					<UserInfoSkeleton />
				</Col>
			</Row>
		</SkeletonTheme>
	);
}

export default UserPageSkeleton;
