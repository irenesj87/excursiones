import { createSlice } from "@reduxjs/toolkit";

// Estado inicial de los filtros. Cada categoría es un array vacío.
/**
 * @typedef {Object} FilterState
 * @property {string[]} area - Filtros de zona seleccionados.
 * @property {string[]} difficulty - Filtros de dificultad seleccionados.
 * @property {string[]} time - Filtros de tiempo seleccionados.
 */

/**
 * @type {FilterState} - Estado inicial de los filtros. Cada categoría es un array vacío.
 */
const initialState = {
	area: [],
	difficulty: [],
	time: [],
};

export const filterSlice = createSlice({
	name: "filters",
	initialState,
	reducers: {
		/**
		 * Añade o quita un valor de un tipo de filtro específico.
		 * Si el valor ya existe en el array, lo quita.
		 * Si no existe, lo añade.
		 * @param {FilterState} state - El estado actual de los filtros.
		 * @param {{payload: {filterType: string, value: string}}} action - La acción con el tipo y valor del filtro.
		 */
		toggleFilter: (state, action) => {
			const { filterType, value } = action.payload;

			// Comprobamos si filterType es una clave válida en nuestro estado para evitar errores.
			// Esto satisface al linter (Sonar) y hace el reducer más robusto.
			if (Object.prototype.hasOwnProperty.call(state, filterType)) {
				const filterArray = state[filterType];
				const index = filterArray.indexOf(value);

				if (index === -1) {
					// Si el filtro no está en el array, lo añadimos.
					filterArray.push(value);
				} else {
					// Si el filtro ya está, lo eliminamos.
					filterArray.splice(index, 1);
				}
			}
		},
		/**
		 * Limpia todos los filtros seleccionados, reseteando el estado al inicial.
		 * @param {typeof initialState} state - El estado actual.
		 */
		clearAllFilters: (state) => {
			state.area = [];
			state.difficulty = [];
			state.time = [];
		},
	},
});

// Exportamos las acciones para que puedan ser usadas en los componentes.
export const { toggleFilter, clearAllFilters } = filterSlice.actions;

export default filterSlice.reducer;