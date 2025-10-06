import React, { memo, useCallback, useId } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "./ExcursionDetailItem.module.css";

/**
 * Componente para mostrar un detalle específico de una excursión (ej. dificultad, tiempo).
 * @param {object} props - Las propiedades del componente.
 * @param {React.ComponentType<React.SVGProps<SVGSVGElement>>} [props.IconComponent] - El componente de icono a renderizar.
 * @param {string} [props.text] - El valor del detalle a mostrar (ej. "Media", "4 horas").
 * @param {string} props.label - Etiqueta descriptiva para accesibilidad y tooltips (ej. "Dificultad").
 * @param {React.ReactNode} [props.children] - Nodos hijos para renderizar contenido personalizado en lugar del texto.
 * ¡ADVERTENCIA DE SEGURIDAD! Si el contenido de `children` proviene de una fuente externa (API, usuario),
 * debe ser sanitizado para prevenir ataques XSS.
 * @returns {React.ReactElement} - El elemento React que representa el detalle de la excursión.
 */
function ExcursionDetailItemComponent({
	IconComponent,
	text,
	label,
	children,
}) {
	// Genera un ID único y seguro para la accesibilidad del tooltip.
	// Esto previene vulnerabilidades de inyección de atributos si `label` contiene datos no seguros.
	const tooltipId = useId();

	/**
	 * Renderiza el Tooltip para el detalle de la excursión.
	 * Se memoiza con `useCallback` para evitar que se recree en cada renderizado.
	 * @param {object} props - Propiedades inyectadas por OverlayTrigger.
	 * @returns {React.ReactElement}
	 */
	const renderTooltip = useCallback(
		(props) => (
			<Tooltip id={tooltipId} {...props}>
				{label ? `${label}: ${text}` : text}
			</Tooltip>
		),
		[label, text, tooltipId]
	);

	// Si no hay texto ni hijos para mostrar, no renderizamos nada.
	// Esta comprobación se hace DESPUÉS de los hooks para cumplir las reglas de los hooks.
	if (!text && !children) {
		return null;
	}

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

	// El componente siempre es interactivo y muestra un tooltip.
	return (
		<OverlayTrigger placement="top" overlay={renderTooltip}>
			{/* Usamos un botón para la semántica y accesibilidad nativa. */}
			<button type="button" className={styles.detailItem}>
				{itemContent}
			</button>
		</OverlayTrigger>
	);
}

const ExcursionDetailItem = memo(ExcursionDetailItemComponent);
export default ExcursionDetailItem;
