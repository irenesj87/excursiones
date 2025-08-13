import { memo } from "react";
import styles from "../css/ExcursionCard.module.css";

/**
 * Componente para mostrar un detalle específico de una excursión (ej. dificultad, tiempo).
 * @param {object} props - Las propiedades del componente.
 * @param {React.ElementType} [props.IconComponent] - El componente de icono a renderizar.
 * @param {string} props.text - El valor del detalle a mostrar (ej. "Media", "4h").
 * @param {string} props.label - Etiqueta descriptiva para accesibilidad y tooltips (ej. "Dificultad").
 * @param {React.ReactNode} [props.children] - Nodos hijos para renderizar contenido personalizado en lugar del texto.
 * @returns {React.ReactElement}
 */
function ExcursionDetailItemComponent({
	IconComponent,
	text,
	label,
	children,
}) {
	// Si no hay texto ni hijos para mostrar, no renderizamos nada.
	if (!text && !children) {
		return null;
	}

	// Crea un texto de título completo para el tooltip del navegador.
	const title = label && text ? `${label}: ${text}` : text || label;

	return (
		<div className={styles.detailItem} title={title}>
			{/* El icono es decorativo y se oculta a los lectores de pantalla. */}
			{IconComponent && (
				<IconComponent className={styles.detailIcon} aria-hidden="true" />
			)}
			{/* La etiqueta se muestra solo a los lectores de pantalla para dar contexto. */}
			{label && <span className="visually-hidden">{`${label}: `}</span>}
			{children || <span>{text}</span>}
		</div>
	);
}

const ExcursionDetailItem = memo(ExcursionDetailItemComponent);
export default ExcursionDetailItem;
