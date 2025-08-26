import { memo, useCallback } from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import styles from "../ExcursionCard/ExcursionCard.module.css";

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
	/**
	 * Renderiza el Tooltip para el detalle de la excursión.
	 * Se memoiza con `useCallback` para evitar que se recree en cada renderizado.
	 * @param {object} props - Propiedades inyectadas por OverlayTrigger.
	 * @returns {React.ReactElement}
	 */
	const renderTooltip = useCallback(
		(props) => {
			const tooltipText = label && text ? `${label}: ${text}` : text || label;
			// No renderiza el tooltip si no hay texto que mostrar.
			if (!tooltipText) return <></>;
			return (
				<Tooltip id={`tooltip-${label}`} {...props}>
					{tooltipText}
				</Tooltip>
			);
		},
		[label, text]
	);

	// Si no hay texto ni hijos para mostrar, no renderizamos nada.
	if (!text && !children) {
		return null;
	}

	return (
		<OverlayTrigger placement="top" overlay={renderTooltip}>
			<div className={styles.detailItem}>
				{IconComponent && (
					<IconComponent className={styles.detailIcon} aria-hidden="true" />
				)}
				{label && <span className="visually-hidden">{`${label}: `}</span>}
				{children || <span>{text}</span>}
			</div>
		</OverlayTrigger>
	);
}

const ExcursionDetailItem = memo(ExcursionDetailItemComponent);
export default ExcursionDetailItem;
