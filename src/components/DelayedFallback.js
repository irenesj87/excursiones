import React, { useState, useEffect } from "react";

/**
 * Componente que evita el parpadeo de los mensajes de carga cuando la carga es muy rápida.
 * @param {object} props - Las propiedades del componente.
 * @param {React.ReactNode} props.children - El contenido a mostrar dentro del fallback (ej. un Spinner).
 * @param {number} [props.delay=300] - Tiempo en milisegundos que se esperará antes de mostrar `children`.
 * @param {string} [props.className=""] - Clases CSS para el div contenedor.
 * @returns {React.ReactElement | null} El componente que renderiza el contenido con retraso, o null.
 */
const DelayedFallback = ({ children, delay = 300, className = "" }) => {
	/**
	 * Variable de estado booleana que controla si el contenido de "children" debe mostrarse o no. Inicialmente, está a false
	 * por lo que ese contenido está oculto.
	 */
	const [show, setShow] = useState(false);

	/**
	 * useEffect que se ejecutará después de que el componente se renderice por primera
	 */
	useEffect(() => {
		// Comprobación de seguridad. Si el delay es 0 o negativo, mostrar inmediatamente.
		if (delay <= 0) {
			setShow(true);
			return;
		}
		/**
		 * setTimeout(): Función de JavaScript que ejecuta un código después de un tiempo determinado. En este caso, se le dice
		 * espera los milisegundos que te diga el delay y después ejecuta setShow(true).
		 */
		const timer = setTimeout(() => {
			setShow(true);
		}, delay);
		/**
		 * Función de limpieza de useEffect: Se ejecuta si el componente desaparece (se desmonta) antes que el temporizador termine.
		 * clearTimeout(timer): Cancela el temporizador pendiente.
		 * Hacer esto es importante porque, por ejemplo, si la carga termina en 200ms, que es más rápido que el delay de 300ms, el
		 * componente DelayedFallback será reemplzado por el contenido real. Sin esta línea, el temporizador seguiría activo e intentaría
		 * actualizar el estado de un componente que ya no existe, lo que causaría un error en React.
		 */
		return () => clearTimeout(timer);
	}, [delay]);

	/**
	 * El componente siempre renderiza un div. A este div se le aplica el className que se le haya pasado. Esto es importante 
	 * porque permite que el div ocupe su espacio en el layout desde el principio, evitando que la página "salte" cuando 
	 * parezca el contenido.
	 * {show ? children : null}: Esta es una expresión ternaria.
	 * Si show es true (porque el temporizador ha terminado), se renderiza el children (el texto o el spinner).
	 * Si show es false (porque el temporizador aún no ha terminado), se renderiza null dentro del div, por lo que el div
	 * sigue ocupando su espacio en el layout.
	 * ACTUALIZACIÓN: Renderizar `null` causa que el div, aunque esté en el DOM, tenga una altura de 0 si es un flex-item
	 * con `flex-grow: 1` y sin contenido. Esto provoca un colapso del layout.
	 * La solución es renderizar un espacio sin ruptura (`&nbsp;`) durante el retraso. Esto le da al div un contenido
	 * mínimo, permitiéndole ocupar el espacio asignado por flexbox y evitando el "salto" del layout.
	 */
	return <div className={className}>{show ? children : <>&nbsp;</>}</div>;
};

export default DelayedFallback;
