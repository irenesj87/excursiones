import { useState, useEffect } from 'react';

const DelayedFallback = ({ children, delay = 300, className = "" }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Si el delay es 0 o negativo, mostrar inmediatamente.
    if (delay <= 0) {
      setShow(true);
      return;
    }

    const timer = setTimeout(() => {
      setShow(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Renderizar siempre un div que pueda tomar el className para ocupar espacio.
  // Mostrar el children (el contenido del fallback, ej: "Cargando página...") solo cuando show es true.
  // Si show es false, el div estará vacío pero mantendrá el espacio si className lo define (ej: con min-height, flex-grow).
  return <div className={className}>{show ? children : null}</div>;
};

export default DelayedFallback;