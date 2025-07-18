import React from "react";
import styles from "../css/ExcursionCard.module.css";

/**
 * Componente para mostrar un detalle específico de una excursión (ej. dificultad, tiempo).
 * @param {object} props - Las propiedades del componente.
 * @param {React.ElementType} props.IconComponent - El componente de icono a renderizar (ej. FiBarChart).
 * @param {string} props.text - El texto a mostrar junto al icono.
 * @returns {React.ReactElement}
 */
function ExcursionDetailItem({ IconComponent, text }) {
	return (
		<div className={styles.detailItem}>
			{/* Renderiza el componente de icono que se le pasa como prop */}
			<IconComponent className={styles.detailIcon} />
			<span>{text}</span>
		</div>
	);
}

export default ExcursionDetailItem;