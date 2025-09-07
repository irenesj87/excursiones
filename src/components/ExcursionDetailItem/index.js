import { memo, useCallback } from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
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
		(props) => {
			// Construye el texto del tooltip, priorizando el formato "label: text".
			const tooltipContent =
				label && text ? `${label}: ${text}` : text || label;

			// Si no hay contenido para el tooltip, no se renderiza.
			// OverlayTrigger no mostrará nada si el overlay es null o un fragmento vacío,
			// por lo que se retorna un fragmento para ser explícitos.
			if (!tooltipContent) {
				return <></>;
			}
			return (
				<Tooltip id={`tooltip-${label}`} {...props}>
					{tooltipContent}
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
					<IconComponent
						className={styles.detailIcon}
						aria-hidden="true"
						data-testid="detail-item-icon"
					/>
				)}
				{label && <span className="visually-hidden">{`${label}: `}</span>}
				{children || <span>{text}</span>}
			</div>
		</OverlayTrigger>
	);
}

const ExcursionDetailItem = memo(ExcursionDetailItemComponent);
export default ExcursionDetailItem;
