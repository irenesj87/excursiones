import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import UserInfoForm from "./UserInfoForm"; //
import UserPageSkeleton from "./UserPageSkeleton"; //
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/UserPage.module.css";

/** @typedef {import('types.js').RootState} RootState */

/**
 * Componente que representa la página de perfil del usuario. Muestra la información personal del usuario y las excursiones
 * a las que se ha apuntado.
 */
function UserPage({ isAuthCheckComplete }) {
	// useSelector que indica si el usuario está logueado y proporciona la información del usuario.
	const { login: isLoggedIn } = useSelector(
		/** @param {RootState} state */
		(state) => state.loginReducer
	);

	// --- Lógica de Renderizado Secuencial ---

	// 1. Si la comprobación de autenticación inicial aún no ha terminado, mostramos
	// el esqueleto. Esto actúa como una barrera para prevenir que se ejecute
	// lógica con un estado de autenticación incompleto.
	if (!isAuthCheckComplete) {
		return <UserPageSkeleton />;
	}

	// 2. Una vez que ha cargado, si el usuario no está logueado, lo redirigimos.
	if (!isLoggedIn) {
		return <Navigate replace to="/" />;
	}

	// 3. Si todas las comprobaciones han pasado, mostramos el contenido final de la página.
	return (
		// Se añade `h-100` a la Row y `d-flex flex-column` a la Col para asegurar que el layout
		// ocupe toda la altura disponible y que el contenido se organice verticalmente.
		// Esto empuja el footer hacia abajo, evitando la superposición.
		<Row className="justify-content-center pt-2 h-100">
			<Col xs={11} md={11} lg={11} xl={8} className="d-flex flex-column pb-5">
				<h2 className={`${styles.title} mb-3`}>Tu perfil</h2>
				{/* UserInfoForm se expandirá para ocupar el espacio restante gracias al siguiente cambio. */}
				<UserInfoForm />
			</Col>
		</Row>
	);
}
export default UserPage;
