import { memo, useCallback } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "./ExcursionDetailItem.module.css";

/** @typedef {object} ExcursionDetailItemProps
 * @property {React.ElementType} [IconComponent] - El componente de icono a renderizar.
 * @property {string} [text] - El valor del detalle a mostrar (ej. "Media", "4 horas").
 * @property {string} label - Etiqueta descriptiva para accesibilidad y tooltips (ej. "Dificultad").
 * @property {React.ReactNode} [children] - Nodos hijos para renderizar contenido personalizado en lugar del texto.
 */

/**
 * Componente para mostrar un detalle específico de una excursión (ej. dificultad, tiempo).
 * @param {ExcursionDetailItemProps} props - Las propiedades del componente.
 * @returns {React.ReactElement}
 */
function ExcursionDetailItemComponent({
	IconComponent,
	text,
	label,
	children,
}) {
	/**
	 * Renderiza el Tooltip para el detalle de la excursión.
	 * Se memoiza con `useCallback` para evitar que se recree en cada renderizado.
	 * @param {object} props - Propiedades inyectadas por OverlayTrigger.
	 * @returns {React.ReactElement}
	 */
	const renderTooltip = useCallback(
		(props) => (
			<Tooltip id={`tooltip-${label}`} {...props}>
				{`${label}: ${text}`}
			</Tooltip>
		),
		[label, text]
	);

	// Si no hay texto ni hijos para mostrar, no renderizamos nada.
	// Esta comprobación se hace DESPUÉS de los hooks para cumplir las reglas de los hooks.
	if (!text && !children) {
		return null;
	}

	const isInteractive = text && label;

	const itemContent = (
		<>
			{IconComponent && (
				<IconComponent
					className={styles.detailIcon}
					aria-hidden="true"
					data-testid="detail-item-icon"
				/>
			)}
			{label && <span className="visually-hidden">{`${label}: `}</span>}
			{children || <span>{text}</span>}
		</>
	);

	// Solo mostramos el tooltip si tenemos `text` y `label` para un contenido completo.
	// Si se usan `children`, se deshabilita el tooltip por defecto para evitar inconsistencias.
	if (isInteractive) {
		return (
			<OverlayTrigger placement="top" overlay={renderTooltip}>
				{/* Usamos un botón para la semántica y accesibilidad nativa. */}
				<button
					type="button"
					className={`${styles.detailItem} ${styles.detailItemButton}`}
				>
					{itemContent}
				</button>
			</OverlayTrigger>
		);
	}

	// Si no es interactivo, usamos un <div> simple.
	return <div className={styles.detailItem}>{itemContent}</div>;
}

const ExcursionDetailItem = memo(ExcursionDetailItemComponent);
export default ExcursionDetailItem;
