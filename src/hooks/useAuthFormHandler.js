import { useReducer, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../slicers/loginSlice";

/**
 * Estado inicial para el reducer del formulario de autenticación.
 */
const initialState = {
	isLoading: false,
	error: null,
	isButtonDisabled: true,
};

/**
 * Reducer genérico para gestionar el estado de los formularios de autenticación.
 * @param {object} state - El estado actual.
 * @param {object} action - La acción a despachar.
 */
function authFormReducer(state, action) {
	switch (action.type) {
		case "SUBMIT_START":
			return { ...state, isLoading: true, error: null };
		case "SUBMIT_SUCCESS":
			return { ...state, isLoading: false };
		case "SUBMIT_FAILURE":
			return { ...state, isLoading: false, error: action.payload };
		case "SET_VALIDITY":
			return { ...state, isButtonDisabled: !action.payload };
		case "CLEAR_ERROR":
			return { ...state, error: null };
		default:
			throw new Error(`Acción no soportada: ${action.type}`);
	}
}

/**
 * Hook personalizado para manejar la lógica de los formularios de autenticación (login y registro).
 * @param {{[key: string]: any}} formValues - Objeto con los valores actuales de los campos del formulario.
 * @param {() => boolean} isFormValidFn - Función que retorna si el formulario es válido.
 * @param {(...args: any[]) => Promise<any>} apiSubmitFunction - La función del servicio a llamar para el envío (ej. loginUser, registerUser).
 * @param {string} successRedirectPath - La ruta a la que redirigir en caso de éxito.
 * @returns {{
 *  formState: {isLoading: boolean, error: string | null, isButtonDisabled: boolean},
 *  formDispatch: React.Dispatch<any>,
 *  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
 * }}
 */
export function useAuthFormHandler(
	formValues,
	isFormValidFn,
	apiSubmitFunction,
	successRedirectPath
) {
	const loginDispatch = useDispatch();
	const navigate = useNavigate();
	const [formState, formDispatch] = useReducer(authFormReducer, initialState);

	// Efecto para validar el formulario cuando los valores cambian.
	useEffect(() => {
		const isFormValid = isFormValidFn();
		formDispatch({ type: "SET_VALIDITY", payload: isFormValid });
	}, [formValues, isFormValidFn]);

	/**
	 * Maneja el envío del formulario.
	 * @param {React.FormEvent<HTMLFormElement>} e - El evento de envío del formulario.
	 */
	const handleSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			if (formState.isButtonDisabled || formState.isLoading) {
				return;
			}
			formDispatch({ type: "SUBMIT_START" });

			try {
				const data = await apiSubmitFunction(...Object.values(formValues));
				loginDispatch(login({ user: data.user, token: data.token }));
				window.sessionStorage.setItem("token", data.token);
				formDispatch({ type: "SUBMIT_SUCCESS" });
				navigate(successRedirectPath);
			} catch (error) {
				console.error("Fallo en la autenticación:", error);
				let errorMessage;
				if (error instanceof TypeError && error.message === "Failed to fetch") {
					errorMessage =
						"No se pudo conectar con el servidor. Por favor, comprueba tu conexión e inténtalo de nuevo.";
				} else {
					errorMessage =
						error.message ||
						"Ocurrió un error inesperado. Inténtalo de nuevo.";
				}
				formDispatch({ type: "SUBMIT_FAILURE", payload: errorMessage });
			}
		},
		[
			formState.isButtonDisabled,
			formState.isLoading,
			apiSubmitFunction,
			formValues,
			loginDispatch,
			navigate,
			successRedirectPath,
		]
	);

	return { formState, formDispatch, handleSubmit };
}