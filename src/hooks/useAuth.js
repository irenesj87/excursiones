import { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import { verifyToken } from "../services/authService";
import { login, logout } from "../slicers/loginSlice";
import { useMinDisplayTime } from "./useMinDisplayTime";

const authInitialState = {
	isAuthCheckComplete: false,
};

const authReducer = (state, action) => {
	if (action.type === "AUTH_CHECK_COMPLETE") {
		return { ...state, isAuthCheckComplete: true };
	}
	return state;
};

/**
 * Hook para manejar la autenticación del usuario. Verifica el token de sessionStorage en la carga inicial y actualiza la
 * Redux store.
 * @returns {{isAuthCheckComplete: boolean}} Un objeto que indica si la comprobación de autenticación ha finalizado.
 */
export const useAuth = () => {
	const reduxDispatch = useDispatch();
	const [state, authDispatch] = useReducer(authReducer, authInitialState);
	const { startTiming, dispatchWithMinDisplayTime } =
		useMinDisplayTime(authDispatch);

	useEffect(() => {
		let isMounted = true; // Flag para rastrear el estado de montaje

		const verifyAuthStatus = async () => {
			startTiming();
			const sessionToken = sessionStorage.getItem("token");
			try {
				const authData = await verifyToken(sessionToken);
				if (isMounted) {
					// Si el token es válido, authData contendrá el usuario y el token.
					if (authData) {
						reduxDispatch(
							login({ user: authData.user, token: authData.token })
						);
					}
					// Si no hay token, authData será null y no se hace nada; el usuario no está logueado.
				}
			} catch (error) {
				console.error(
					"Error en la verificación del estado de autenticación:",
					// Usamos error.message para un log más limpio, ya que el servicio ya formatea el error.
					error.message
				);
				if (isMounted) {
					reduxDispatch(logout());
					sessionStorage.removeItem("token");
				}
			} finally {
				if (isMounted) {
					dispatchWithMinDisplayTime({ type: "AUTH_CHECK_COMPLETE" });
				}
			}
		};
		verifyAuthStatus();

		// Función de limpieza que se ejecuta al desmontar
		return () => {
			isMounted = false;
		};
	}, [reduxDispatch, startTiming, dispatchWithMinDisplayTime]);

	return { isAuthCheckComplete: state.isAuthCheckComplete };
};
