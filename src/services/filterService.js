const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

/**
 * Obtiene los filtros de una categoría específica.
 * @param {string} filterName - El nombre de la categoría de filtro (ej. "area").
 * @returns {Promise<string[]>} Un array con los valores del filtro.
 */
export const fetchFilters = async (filterName) => {
	const url = `${API_BASE_URL}/filters?type=${filterName}`;
	/** @type {RequestInit} */
	const options = {
		method: "GET",
		mode: "cors",
		headers: { "Content-Type": "application/json" },
	};

	const response = await fetch(url, options);
	if (!response.ok) {
		throw new Error(
			`Error HTTP ${response.status} al cargar filtros de ${filterName}`
		);
	}
	return response.json();
};