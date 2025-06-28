import React, { useState, useEffect } from "react";

/**
 * Componente que evita el parpadeo de los mensajes de carga cuando la carga de la página es muy rápida
 * @param {React.ReactNode} children: Es el contenido que se mostrará dentro del fallback (por ejemplo, el texto "Cargando página..." o un componente Spinner).
 * @param {number} delay: Tiempo en milisegundos que el componente esperará antes de mostrar "children"
 * @param {string} className: Permite pasar clases CSS al div principal del componente para darle estilo
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
		 * Hacer esto es importante porque, poir ejemplo, si la carga termina en 200ms, que es más rápido que el delay de 300ms, el
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
	 * Si show es false (porque el temporizador aún no ha terminado), se renderiza null, que en React significa "no renderizar nada aquí".
	 */
	return <div className={className}>{show ? children : null}</div>;
};

export default DelayedFallback;
