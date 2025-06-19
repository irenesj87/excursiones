import ExcursionCard from "./ExcursionCard";
import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../slicers/loginSlice";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Excursion.module.css";

function Excursion({ id, name, area, description, difficulty, time }) {
	// useSelector que dice si el usuario está logueado o no. Además, da la información del usuario
	const { login: isLoggedIn, user } = useSelector(
		(state) => state.loginReducer // Indica que queremos obtener el estado gestionado por loginReducer
	);
	const loginDispatch = useDispatch();

	// Esta función apunta a un usuario logueado a la excursión que él quiera, ahora memoizada con useCallback
	const joinExcursion = useCallback(async () => {
		// Obtenemos el correo del usuario y el token dentro del callback para asegurar que usamos los valores más actuales
		// en el momento de la ejecución.
		const currentUserMail = user?.mail;
		// Se mira si tenemos el correo del usuario
		if (!currentUserMail) {
			console.error(
				"Correo del usuario no disponible. No se puede unir a la excursión."
			);
			// Considerar mostrar un mensaje de error al usuario aquí si es necesario
			return;
		}
		// Se mira si tenemos el token
		const token = window.sessionStorage?.getItem("token");
		if (!token) {
			console.error("Token no encontrado en sessionStorage.");
			// Considerar mostrar un mensaje de error al usuario o redirigir al login
			return;
		}

		const currentUrl = `http://localhost:3001/users/${currentUserMail}/excursions/${id}`;
		const options = {
			method: "PUT",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
			body: JSON.stringify({ id: id }),
		};
		// Se intenta loguear al usuario en la excursión
		try {
			// Nota: Sería ideal tener un estado de carga local (ej. setLoadingJoin(true))
			// para dar feedback visual en ExcursionCard mientras esta operación ocurre.
			const response = await fetch(currentUrl, options);
			if (!response.ok) {
				// Chequeo más genérico de errores de respuesta
				// Intentar parsear el error del cuerpo si es posible
				const errorData = await response.json().catch(() => null);
				const errorMessage =
					errorData?.message || `Error HTTP ${response.status}`;
				throw new Error(errorMessage);
			}
			const data = await response.json();
			loginDispatch(
				updateUser({
					// Envía el objeto user actualizado (esto incluye la nueva excursión a la que se ha apuntado)
					user: data,
				})
			);
			// Si hay un problema, se muestra un error
		} catch (error) {
			console.error("Error al unirse a la excursión:", error.message);
			// Nota: Aquí se podría establecer un estado de error local para informar al usuario
			// a través de ExcursionCard, si ExcursionCard tuviera la capacidad de mostrarlo.
		} finally {
			// setLoadingJoin(false); // Si se implementara un estado de carga.
		}
	}, [id, user, loginDispatch]);

	/** Variable que comprueba si el usuario está logueado en la web y si se ha apuntado a esa excursión (su lista de excursiones
	 * contiene el id de esta excursión). También comprueba si existe el usuario y el array de excursiones de ese usuario
	 */
	const isJoined = isLoggedIn && user?.excursions?.includes(id);

	return (
		<div className={`${styles.excursionContainer} py-3`}>
			<ExcursionCard
				name={name}
				area={area}
				description={description}
				difficulty={difficulty}
				time={time}
				isLoggedIn={isLoggedIn}
				isJoined={isJoined}
				onJoin={joinExcursion}
			/>
		</div>
	);
}

export default Excursion;
