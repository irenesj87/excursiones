import ExcursionCard from "./ExcursionCard";
import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../slicers/loginSlice";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Excursion.module.css";

function Excursion({ id, name, area, description, difficulty, time }) {
	// useSelector que dice si el usuario está logueado o no. Además, nos da la información del usuario
	const { login: isLoggedIn, user } = useSelector(
		(state) => state.loginReducer
	);
	const loginDispatch = useDispatch();
	// Variable que guarda el correo del usuario que está logueado ahora mismo
	const auxUserMail = user?.mail;
	const url = `http://localhost:3001/users/${auxUserMail}/excursions/${id}`;

	// Esta función apunta a un usuario logueado a la excursión que él quiera, ahora memoizada con useCallback
	const joinExcursion = useCallback(async () => {
		// Asegurarse de que sessionStorage se accede de forma segura
		const token = window.sessionStorage ? window.sessionStorage["token"] : null;
		if (!token) {
			console.error("Token no encontrado en sessionStorage.");
			// Podrías manejar este caso, por ejemplo, redirigiendo al login o mostrando un error.
			return;
		}

		const options = {
			method: "PUT",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
			body: JSON.stringify({ id: id }),
		};

		try {
			const response = await fetch(url, options);
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
					user: data,
				})
			);
		} catch (error) {
			console.error("Error al unirse a la excursión:", error.message);
		}
	}, [url, id, loginDispatch]); // Dependencias de useCallback

	/* Variable que comprueba si el usuario está logueado en la web y si está logueado en esa excursión.
	También comprueba si existe el usuario y el array de excursiones de ese usuario */
	const isJoined = isLoggedIn && user?.excursions?.includes(id);

	return (
		// Reemplazamos el Container de Bootstrap por un div simple.
		// El Container de Bootstrap (no fluid) se centra por defecto, lo que podría causar el desplazamiento.
		// Un div simple ocupará el ancho disponible o el ancho de su contenido, alineándose a la izquierda.
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
