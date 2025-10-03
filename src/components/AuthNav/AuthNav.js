import React, { useState, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { useAuthContext } from "../../context/AuthContext";
import ErrorBoundary from "../ErrorBoundary";
import UserNavSkeleton from "../UserNav/UserNavSkeleton";
import GuestNavSkeleton from "../GuestNav/GuestNavSkeleton";

// Carga perezosa (lazy loading) de los componentes de navegación.
// Esto crea "chunks" de código separados que solo se descargan cuando son necesarios.
const UserNav = lazy(() => import("../UserNav"));
const GuestNav = lazy(() => import("../GuestNav"));

/**
 * @typedef {import('types.js').RootState} RootState
 */

/**
 * @typedef {object} AuthNavProps
 * @property {() => void} [onCloseMenu] - Función opcional para cerrar el menú de navegación, pasada a los componentes hijos.
 */

/**
 * Obtiene de manera segura el estado de autenticación inicial de sessionStorage.
 * @returns {boolean} - True si es probable que haya un token, false en otros casos.
 */
const getInitialAuthState = () => {
	// Comprobación para evitar errores en entornos de renderizado en servidor (SSR),
	// donde el objeto `window` (y por tanto `sessionStorage`) no está disponible. Usamos `globalThis` para compatibilidad universal.
	if (globalThis.window === undefined) {
		return false;
	}
	return !!sessionStorage.getItem("token");
};

/**
 * Renderiza la navegación condicionalmente (`UserNav` o `GuestNav`) según el estado de autenticación.
 * Muestra un esqueleto de carga optimizado para evitar cambios de layout (layout shifts) durante la verificación inicial.
 * @param {AuthNavProps} props - Las propiedades del componente.
 * @returns {React.ReactElement} - El componente de navegación adecuado.
 */
const AuthNav = ({ onCloseMenu }) => {
	const { login: isLoggedIn } = useSelector(
		/**
		 * @param {RootState} state - El estado global de la aplicación Redux.
		 * @returns {{login: boolean}} El estado de login del usuario.
		 */ (state) => state.loginReducer
	);

	// Obtenemos el estado de la comprobación de autenticación desde el contexto.
	const authContext = useAuthContext();
	const isAuthCheckComplete = authContext?.isAuthCheckComplete ?? false;

	// Para evitar el "salto" del esqueleto, no reaccionamos al estado de Redux que cambia
	// durante la comprobación. En su lugar, tomamos una "pista" inicial de sessionStorage.
	// Si hay un token, es muy probable que el usuario esté logueado, por lo que mostramos
	// el esqueleto correspondiente desde el principio. Esto estabiliza el layout.
	/**
	 * likelyLoggedIn: Almacena una pista inicial sobre si el usuario podría estar logueado, basada en sessionStorage,
	 * para renderizar el esqueleto correcto y evitar un "layout shift".
	 */
	const [likelyLoggedIn] = useState(getInitialAuthState);

	if (!isAuthCheckComplete) {
		// La elección del esqueleto se basa en la "pista" inicial para que no cambie
		// durante la verificación de autenticación.
		return likelyLoggedIn ? <UserNavSkeleton /> : <GuestNavSkeleton />;
	}

	// Una vez que la comprobación de autenticación ha finalizado, renderizamos el componente
	// correspondiente (UserNav o GuestNav).
	// Se envuelven en <Suspense> para manejar el estado de carga del componente perezoso.
	// El `fallback` muestra el esqueleto adecuado mientras el chunk de JS se descarga.
	return (
		<ErrorBoundary fallback={<GuestNavSkeleton />}>
			<Suspense
				fallback={isLoggedIn ? <UserNavSkeleton /> : <GuestNavSkeleton />}
			>
				{isLoggedIn ? (
					<UserNav onCloseMenu={onCloseMenu} />
				) : (
					<GuestNav onCloseMenu={onCloseMenu} />
				)}
			</Suspense>
		</ErrorBoundary>
	);
};

export default AuthNav;
