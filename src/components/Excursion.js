import React from "react";
import { Container } from "react-bootstrap";
import ExcursionCard from "./ExcursionCard";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../slicers/loginSlice";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Excursion.module.css";

function Excursion(props) {
	// useSelector que dice si el usuario está logueado o no. Además, nos da la información del usuario
	const { login: isLoggedIn, user } = useSelector(
		(state) => state.loginReducer
	);
	const loginDispatch = useDispatch();
	// Variable que guarda el correo del usuario que está logueado ahora mismo
	const auxUserMail = user && user.mail;
	const url = `http://localhost:3001/users/${auxUserMail}/excursions/${props.id}`;

	// Esta función apunta a un usuario logueado a la excursión que él quiera
	const joinExcursion = async () => {
		const options = {
			method: "PUT",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				// Authorization: Es la cabecera HTTP estándar para mandar credenciales de autenticación al servidor.
				/* Bearer: Un string que representa el esquema autenticación en el estándar the OAuth 2.0 (RFC 6750). 
				Indica que la credencial es un 'bearer token'. Significa que quien tenga este token está autorizado
				para acceder a recursos o llevar a cabo acciones relacionadas con ese associated token, sin necesidad de 
				pruebas adicionales como firmas criptográficas. El espacio después de  Bearer es parte del formato estándar. 
				La cabecera Authorization: Bearer <token> se usa para demostrar que el usuario ya está autenticado cuando 
				realiza acciones. Al contrario, en el proceso de login es el momento donde se obtiene ese token por primera vez, 
				por eso en el login no necesitamos esta cabecera */
				Authorization: "Bearer " + window.sessionStorage["token"],
			},
			/* body: Es la propiedad estándar en las opciones del fetch. Define el contenido que hay que mandar en el 
			 cuerpo de la petición HTTP. */
			body: JSON.stringify({ id: props.id }),
		};

		try {
			const response = await fetch(url, options);
			if (response.status === 401) {
				throw new Error("No estás autorizado/a para hacer esta operación");
			} else {
				const data = await response.json();
				loginDispatch(
					updateUser({
						user: data,
					})
				);
			}
		} catch (error) {
			console.log(error);
		}
	};

	/* Variable que comprueba si el usuario está logueado en la web y si está logueado en esa excursión.
	También comprueba si existe el usuario y el array de excursiones de ese usuario */
	const isJoined =
		isLoggedIn && user && user.excursions && user.excursions.includes(props.id);

	return (
		<Container className={`${styles.excursionContainer} py-3`}>
			<ExcursionCard
				id={props.id}
				name={props.name}
				area={props.area}
				description={props.description}
				difficulty={props.difficulty}
				time={props.time}
				isLoggedIn={isLoggedIn}
				isJoined={isJoined}
				onJoin={joinExcursion}
			/>
		</Container>
	);
}

export default Excursion;
