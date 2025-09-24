import { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import { verifyToken } from "../services/authService";
import { login, logout } from "../slices/loginSlice";
import { useMinDisplayTime } from "./useMinDisplayTime";

/**
 * Hook personalizado para verificar si un usuario ya tiene una sesión iniciada desde una visita anterior, justo cuando la aplicación se carga
 * por primera vez.
 * Ese hook es necesario para evitar el problema del parpadeo, que da una mala experiencia de usuario.
 * Sin useAuth pasaría esto:
 * 1. Un usuario que ya ha iniciado sesión vuelve a tu web o refresca la página.
 * 2. La aplicación se carga. El estado de Redux está vacío al principio, por lo que la aplicación cree que el usuario no está
 * 	  logueado.
 * 3. Durante un instante, la barra de navegación mostraría los botones "Regístrate" e "Inicia sesión".
 * 4. Un segundo después, algún código leería el token de sessionStorage, validaría la sesión y actualizaría el estado.
 * 5. La barra de navegación "parpadearía" y cambiaría para mostrar "Tu perfil" y "Cierra sesión".
 * @typedef {object} AuthState
 * @property {boolean} isAuthCheckComplete - Un flag que indica si la comprobación de autenticación inicial ha finalizado.
 *   Este estado es crucial para la lógica de renderizado condicional en la aplicación.
 *   - `false`: La comprobación del token de sesión está en curso. La UI debería mostrar un estado de carga
 *     (como un esqueleto o spinner) para evitar mostrar contenido incorrecto o una pantalla en blanco.
 *   - `true`: La comprobación ha finalizado. La aplicación ya sabe si el usuario está autenticado o no
 *     y puede renderizar de forma segura las rutas protegidas o redirigir a la página de login.
 */

/**
 * Estado inicial para el reducer de autenticación.
 * @type {AuthState}
 */
const authInitialState = {
	isAuthCheckComplete: false,
};

/**
 * Reducer para manejar el estado de la autenticación del usuario.
 * @param {AuthState} state - El estado actual.
 * @param {{type: string}} action - La acción a despachar.
 * @returns {AuthState} El nuevo estado.
 */
const authReducer = (state, action) => {
	switch (action.type) {
		// Cuando se recibe esta acción, se indica que la verificación de autenticación ha comenzado.
		case "AUTH_START_CHECK":
			return { ...state, isAuthCheckComplete: false };
		// Cuando se recibe esta acción, se indica que la verificación de autenticación ha finalizado (con éxito o no).
		case "AUTH_CHECK_COMPLETE":
			return { ...state, isAuthCheckComplete: true };
		default:
			return state;
	}
};

/**
 * Hook personalizado para manejar la autenticación del usuario.
 * Verifica el token de sessionStorage en la carga inicial de la aplicación y actualiza el estado de Redux.
 * @returns {{isAuthCheckComplete: boolean}} Un objeto que indica si el proceso de verificación de autenticación ha finalizado.
 */
export const useAuth = () => {
	// useDispatch de Redux para despachar acciones de login y logout.
	const reduxDispatch = useDispatch();
	// useReducer para manejar el estado de autenticación local.
	const [state, authDispatch] = useReducer(authReducer, authInitialState);
	// useMinDisplayTime es un hook personalizado que maneja el tiempo mínimo de visualización de ciertos estados.
	// Se usa para evitar el parpadeo de la UI durante la verificación del estado de autenticación.
	// authDispatch se pasa para que pueda despachar acciones relacionadas con la autenticación.
	// startTiming inicia un temporizador para asegurar que la UI se muestre durante un tiempo mínimo.
	// dispatchWithMinDisplayTime despacha acciones con un tiempo mínimo de visualización.
	const { startTiming, dispatchWithMinDisplayTime } =
		useMinDisplayTime(authDispatch);

	useEffect(() => {
		// Flag para comprobar si el componente sigue montado.
		// Es una salvaguarda crucial para evitar intentar actualizar el estado de un componente que ya ha sido 
		// desmontado, (por ejmplo, si el usuario navega a otra página rápidamente), lo que causaría errores.
		let isMounted = true;
		// Esta función se ejecuta una vez cuando el componente se monta por primera vez.
		const verifyAuthStatus = async () => {
			authDispatch({ type: "AUTH_START_CHECK" });
			// Inicia el temporizador para asegurar que la UI se muestre durante un tiempo mínimo.
			startTiming();
			// Intenta obtener el token que debería estar guardado en el navegador si el usuario inició sesió previamente.
			const sessionToken = sessionStorage.getItem("token");
			try {
				// Intenta verificar el token haciendo la petición al backend.
				// Si la llamada tiene éxito, significa que el token es válido y el usuario está autenticado.
				const authData = await verifyToken(sessionToken);
				if (isMounted) {
					// Si el token es válido, authData contendrá el usuario y el token.
					if (authData) {
						// Despacha la acción de login con los datos del usuario y el token.
						// Esto actualizará el estado de Redux y permitirá que la aplicación sepa que el usuario está autenticado.
						reduxDispatch(
							login({ user: authData.user, token: authData.token })
						);
					}
				}
				// Si la verificación falla, se lanza un error que se captura en el bloque catch.
			} catch (error) {
				console.error(
					"Error en la verificación del estado de autenticación:",
					// Usamos error.message para un log más limpio, ya que el servicio ya formatea el error.
					error.message
				);
				// Si el token no es válido o ha expirado, se despacha la acción de logout.
				// Esto actualizará el estado de Redux para reflejar que el usuario no está autenticado.
				// También se elimina el token del sessionStorage para limpiar la sesión.
				// Si el componente ya no está montado, no hacemos nada.
				if (isMounted) {
					reduxDispatch(logout());
					sessionStorage.removeItem("token");
				}
			} finally {
				// Finalmente, independientemente de si la verificación fue exitosa o fallida,
				// se despacha la acción de AUTH_CHECK_COMPLETE para indicar que la verificación ha terminado (isAuthCheckComplete a true).
				// Esto es importante para que la UI sepa que ya no está en un estado de carga.
				// Si el componente ya no está montado, no hacemos nada.
				if (isMounted) {
					dispatchWithMinDisplayTime({ type: "AUTH_CHECK_COMPLETE" });
				}
			}
		};
		verifyAuthStatus();

		// Función de limpieza que se ejecuta al desmontar el componente (por ejemplo si el usuario cierra la pestaña).
		// Pone isMounted a false para prevenir que se intente actualizar el estado de un componente que ya no existe.
		return () => {
			isMounted = false;
		};
	}, [reduxDispatch, startTiming, dispatchWithMinDisplayTime, authDispatch]);

	return { isAuthCheckComplete: state.isAuthCheckComplete };
};
