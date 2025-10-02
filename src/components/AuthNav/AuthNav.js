import React, { useState, lazy, Suspense } from "react";
import ErrorBoundary from "../ErrorBoundary";
import UserNavSkeleton from "../UserNav/UserNavSkeleton";
import GuestNavSkeleton from "../GuestNav/GuestNavSkeleton";

// Carga perezosa (lazy loading) de los componentes de navegación.
// Esto crea "chunks" de código separados que solo se descargan cuando son necesarios.
const UserNav = lazy(() => import("../UserNav"));
const GuestNav = lazy(() => import("../GuestNav"));

/**
 * @typedef {object} AuthNavProps
 * @property {boolean} isAuthCheckComplete - Indica si la comprobación inicial de autenticación ha finalizado.
 * @property {boolean} isLoggedIn - Indica si el usuario está actualmente logueado.
 * @property {() => void} [onCloseMenu] - Función opcional para cerrar el menú de navegación, pasada a los componentes hijos.
 */

/**
 * Obtiene de manera segura el estado de autenticación inicial de sessionStorage.
 * @returns {boolean} - True si es probable que haya un token, false en otros casos.
 */
const getInitialAuthState = () => {
	// Comprobación para evitar errores en entornos de renderizado en servidor (SSR),
	// donde el objeto `window` (y por tanto `sessionStorage`) no está disponible.
	if (globalThis.window === undefined) {
		return false;
	}
	return !!sessionStorage.getItem("token");
};

/**
 * Componente AuthNav que renderiza la navegación adecuada según el estado de autenticación del usuario.
 * Muestra un esqueleto de carga mientras se verifica la autenticación. Hay dos esqueletos, uno para usuarios 
 * autenticados y otro para invitados.
 * @param {AuthNavProps} props - Las propiedades del componente.
 * @returns {React.ReactElement} - El componente de navegación adecuado.
 */
const AuthNav = ({ isAuthCheckComplete, isLoggedIn, onCloseMenu }) => {
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
