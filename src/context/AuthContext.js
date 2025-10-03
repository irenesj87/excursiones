import React, { createContext, useContext } from "react";

/**
 * @typedef {object} AuthContextType
 * @property {boolean} isAuthCheckComplete - Indica si la comprobación de autenticación inicial ha finalizado.
 */

/**
 * Contexto para proporcionar el estado de la comprobación de autenticación a los componentes anidados.
 * @type {React.Context<AuthContextType | undefined>}
 */
export const AuthContext = createContext(undefined);

/** Hook personalizado para acceder fácilmente al AuthContext. */
export const useAuthContext = () => {
	const context = useContext(AuthContext);

	// Esta comprobación asegura que el hook solo se use dentro de un AuthProvider.
	// Si 'context' es 'undefined', significa que falta el Provider en el árbol de componentes.
	if (context === undefined) {
throw new Error("useAuthContext debe ser usado dentro de un AuthContext.Provider");
	}

	return context;
};
	