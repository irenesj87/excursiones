import AuthNavSkeleton from "./AuthNavSkeleton";
import UserNav from "../UserNav";
import GuestNav from "../GuestNav";

/**
/**
 * Componente AuthNav que renderiza la navegación adecuada según el estado de autenticación del usuario.
 * Muestra un esqueleto de carga mientras se verifica la autenticación, y luego los enlaces para usuarios autenticados o invitados.
 * @param {object} props
 * @param {boolean} props.isAuthCheckComplete - Si la comprobación de autenticación ha finalizado.
 * @param {boolean} props.isLoggedIn - Si el usuario está logueado.
 * @param {() => void} props.onCloseOffcanvas - Función para cerrar el menú Offcanvas al hacer clic en un enlace.
 */
const AuthNav = ({ isAuthCheckComplete, isLoggedIn, onCloseOffcanvas }) => {
	if (!isAuthCheckComplete) {
		return <AuthNavSkeleton />;
	}

	return isLoggedIn ? (
		<UserNav onCloseOffcanvas={onCloseOffcanvas} />
	) : (
		<GuestNav onCloseOffcanvas={onCloseOffcanvas} />
	);
};

export default AuthNav;
