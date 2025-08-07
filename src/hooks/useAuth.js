import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { verifyToken } from "../services/authService";
import { login, logout } from "../slicers/loginSlice";

/**
 * Hook para manejar la autenticación del usuario. Verifica el token de sessionStorage en la carga inicial y actualiza la
 * Redux store.
 * @returns {{isAuthCheckComplete: boolean}} Un objeto que contiene el estado de la autenticación.
 */
export const useAuth = () => {
	const dispatch = useDispatch();
	const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);

	useEffect(() => {
		const verifyAuthStatus = async () => {
			/**
			 * Registra el tiempo de inicio para calcular el tiempo transcurrido y asegurar que el esqueleto se muestre
			 * durante un tiempo mínimo.
			 */
			const startTime = Date.now();
			const sessionToken = sessionStorage.getItem("token");
			try {
				const data = await verifyToken(sessionToken);
				if (data) {
					dispatch(login({ user: data.user, token: data.token }));
				}
			} catch (error) {
				console.error(
					"Error en la verificación del estado de autenticación:",
					error.message
				);
				dispatch(logout());
				sessionStorage.removeItem("token");
			} finally {
				/**
				 * Calcula el tiempo restante para cumplir con el `minDisplayTime` y retrasa la actualización del estado
				 * para evitar un parpadeo rápido del esqueleto.
				 */
				const elapsedTime = Date.now() - startTime;
				const minDisplayTime = 500;
				const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
				setTimeout(() => setIsAuthCheckComplete(true), remainingTime);
			}
		};
		verifyAuthStatus();
	}, [dispatch]);

	return { isAuthCheckComplete };
};
