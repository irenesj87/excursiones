import React from "react";
import { Button, Spinner } from "react-bootstrap";
import styles from "./CustomButton.module.css";

/**
 * @typedef {object} CustomButtonProps
 * @property {string | number} children - El contenido textual del botón. Por seguridad, solo se aceptan strings o números.
 * @property {() => void} [onClick] - Función a ejecutar al hacer clic.
 * @property {'button' | 'submit' | 'reset'} [type='button'] - El tipo de botón.
 * @property {'primary' | 'secondary'} [variant='primary'] - La variante de estilo del botón.
 * @property {string} [className] - Clases CSS adicionales para personalizar.
 * @property {boolean} [disabled=false] - Si el botón está deshabilitado.
 * @property {boolean} [isLoading=false] - Si el botón está en estado de carga.
 */

/**
 * Un componente de botón personalizado y reutilizable que extiende la funcionalidad
 * del botón de React Bootstrap.
 * @param {CustomButtonProps} props - Las props del componente.
 * @returns {React.ReactElement} - El componente de botón.
 */
const CustomButton = ({
	children,
	onClick,
	type = "button",
	variant = "primary",
	className = "",
	disabled = false,
	isLoading = false,
	...rest
}) => {
	// Combina las clases: la base, la variante y cualquier clase extra pasada por props.
	const buttonClass = `${styles.customButton} ${styles[variant]} ${className}`;

	return (
		<Button
			type={type}
			className={buttonClass}
			onClick={onClick}
			disabled={disabled || isLoading}
			aria-busy={isLoading}
			{...rest}
		>
			{isLoading ? (
				<>
					<Spinner
						as="span"
						animation="border"
						size="sm"
						aria-hidden="true"
						className="me-2"
					/>
					{children}
					<span className="visually-hidden">Cargando...</span>
				</>
			) : (
				children
			)}
		</Button>
	);
};

export default CustomButton;
