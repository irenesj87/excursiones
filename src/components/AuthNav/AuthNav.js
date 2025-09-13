import { useState } from "react";
import UserNavSkeleton from "../UserNav/UserNavSkeleton";
import GuestNavSkeleton from "../GuestNav/GuestNavSkeleton";
import UserNav from "../UserNav";
import GuestNav from "../GuestNav/GuestNav";

/**
 * Obtiene de manera segura el estado de autenticación inicial de sessionStorage.
 * @returns {boolean} True si es probable que haya un token, false en otros casos.
 */
const getInitialAuthState = () => {
	if (typeof window === "undefined") {
		return false;
	}
	return !!sessionStorage.getItem("token");
};

/**
 * Componente AuthNav que renderiza la navegación adecuada según el estado de autenticación del usuario.
 * Muestra un esqueleto de carga mientras se verifica la autenticación, y luego los enlaces para usuarios autenticados o
 * invitados
 * @typedef {object} AuthNavProps
 * @property {boolean} isAuthCheckComplete - Si la comprobación de autenticación ha finalizado.
 * @property {boolean} isLoggedIn - Si el usuario está logueado.
 * @property {() => void} [onCloseMenu] - Función para cerrar el menú al hacer clic en un enlace.
 * @param {AuthNavProps} props
 */
const AuthNav = ({ isAuthCheckComplete, isLoggedIn, onCloseMenu }) => {
	// Para evitar el "salto" del esqueleto, no reaccionamos al estado de Redux que cambia
	// durante la comprobación. En su lugar, tomamos una "pista" inicial de sessionStorage.
	// Si hay un token, es muy probable que el usuario esté logueado, por lo que mostramos
	// el esqueleto correspondiente desde el principio. Esto estabiliza el layout.
	const [likelyLoggedIn] = useState(getInitialAuthState);

	if (!isAuthCheckComplete) {
		// La elección del esqueleto se basa en la "pista" inicial para que no cambie
		// durante la verificación de autenticación.
		return likelyLoggedIn ? <UserNavSkeleton /> : <GuestNavSkeleton />;
	}

	return isLoggedIn ? (
		<UserNav onCloseMenu={onCloseMenu} />
	) : (
		<GuestNav onCloseMenu={onCloseMenu} />
	);
};

export default AuthNav;
