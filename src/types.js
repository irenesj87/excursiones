/**
 * Este archivo centraliza las definiciones de tipos de JSDoc para el proyecto.
 * Esto proporciona IntelliSense y verificación de tipos en editores como VSCode.
 * El `export {}` al final es para asegurar que el archivo sea tratado como un módulo.
 */

/**
 * @typedef {object} User
 * @property {string} name
 * @property {string} surname
 * @property {string} mail
 * @property {string} phone
 * @property {(string | number)[]} excursions
 */

/**
 * @typedef {object} LoginState
 * @property {boolean} login
 * @property {User | null} user
 * @property {string | null} token
 */

/**
 * @typedef {object} ThemeState
 * @property {'light' | 'dark'} mode
 */

/**
 * @typedef {object} FilterState
 * @property {string[]} area
 * @property {string[]} difficulty
 * @property {string[]} time
 */

/**
 * @typedef {object} RootState
 * @property {LoginState} loginReducer
 * @property {ThemeState} themeReducer
 * @property {FilterState} filterReducer
 */

/**
 * @typedef {object} Excursion
 * @property {number | string} id
 * @property {string} name
 * @property {string} area
 * @property {string} description
 * @property {string} difficulty
 * @property {string} time
 */

export {};