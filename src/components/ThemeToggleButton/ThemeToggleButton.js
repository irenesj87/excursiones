import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { toggleMode } from "../../slices/themeSlice";
import { FaMoon, FaSun } from "react-icons/fa";
import styles from "./ThemeToggleButton.module.css";

/** @typedef {import('../../types').RootState} RootState */

/**
 * @typedef {object} ThemeToggleButtonProps
 * @property {string} [className] - Clases CSS adicionales para el botón.
 * @property {boolean} [showText=false] - Si es true, muestra el texto junto al icono.
 */

/**
 * Botón que permite al usuario cambiar entre el tema claro y oscuro.
 * @param {ThemeToggleButtonProps} props - Las propiedades del componente.
 * @returns {React.ReactElement} - El componente del botón de cambio de tema.
 */
const ThemeToggleButton = ({ className = "", showText = false }) => {
	const mode = useSelector(
		/** @param {RootState} state - El estado global de Redux. */
		(state) => state.themeReducer.mode
	);
	const dispatch = useDispatch();

	/**
	 * Efecto que se ejecuta cuando el `mode` (tema) cambia.
	 * Aplica la clase CSS correspondiente al elemento `<html>` y guarda la preferencia en `localStorage`.
	 */
	useEffect(() => {
		if (mode === "light" || mode === "dark") {
			// Se selecciona la etiqueta <html>
			const root = document.documentElement;
			// Se asegura de que la etiqueta <html> no tiene las clases 'light' y 'dark' aplicadas antes que el código añada
			// la correcta basada en 'mode'
			root.classList.remove("light", "dark");
			// Añade la clase 'mode' ('light' o 'dark') a <html>
			root.classList.add(mode);
			// Actualiza la variable 'mode' en localStorage
			localStorage.setItem("themeMode", mode);
		}
	}, [mode]);

	/**
	 * Alterna el modo de tema (claro/oscuro) despachando la acción de Redux.
	 * @returns {void}
	 */
	const toggleTheme = () => {
		dispatch(toggleMode());
	};

	const icon =
		mode === "light" ? (
			<FaMoon className={styles.themeIcon} />
		) : (
			<FaSun className={styles.themeIcon} />
		);

	return (
		<Button
			className={`${styles.themeToggleBtn} ${className}`}
			onClick={toggleTheme}
			aria-label={
				mode === "light" ? "Activa el modo oscuro" : "Activa el modo claro"
			}
		>
			{icon}
			{showText && (
				<span className="ms-2">
					{mode === "light" ? "Modo Oscuro" : "Modo Claro"}
				</span>
			)}
		</Button>
	);
};

export default ThemeToggleButton;
