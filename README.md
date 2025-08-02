# Proyecto de Excursiones

Aplicación web desarrollada con React para la visualización y gestión de excursiones. Permite a los usuarios registrarse, iniciar sesión, ver un listado de excursiones y apuntarse a ellas.

## Puesta en Marcha

Para ejecutar este proyecto, es necesario tener en funcionamiento tanto el **backend** (servidor de datos) como el **frontend** (esta aplicación).

### Requisitos Previos

- **Node.js (v16 o superior):** Es el entorno de ejecución para JavaScript. `npm` (Node Package Manager) se instala automáticamente con Node.js.

  - **Recomendado:** Descarga el instalador "LTS" desde la página oficial de Node.js.

- **Git:** Es el sistema de control de versiones utilizado para clonar los repositorios.

  - **Recomendado:** Descárgalo desde la página oficial de Git.

- **Nodemon (Opcional pero recomendado):** Herramienta que reinicia el servidor automáticamente al detectar cambios en los archivos, agilizando el desarrollo.
  ```bash
  npm install -g nodemon
  ```

Una vez instalados, puedes verificar que todo está correcto abriendo una terminal y ejecutando los siguientes comandos. Deberían mostrarte sus respectivas versiones:

```bash
node -v
npm -v
git --version
nodemon -v
```

### 1. Configuración del Backend (`testserver`)

El servidor es responsable de gestionar los datos de usuarios y excursiones.

1.  **Clona el repositorio del servidor.**
    _Si aún no lo has hecho, descarga o clona el repositorio `testserver`._

2.  **Abre una terminal** en el directorio raíz de `testserver`.

3.  **Instala las dependencias:**

    ```bash
    npm install
    ```

4.  **Inicia el servidor:**
    _El servidor se ejecutará en `http://localhost:3001`._
    ```bash
    npm start
    ```
    > **Nota:** Mantén esta terminal abierta mientras trabajas con la aplicación.

### 2. Configuración del Frontend (`excursiones`)

Esta es la aplicación de React que interactúa con el usuario.

1.  **Abre una nueva terminal** en el directorio raíz de `excursiones` (este proyecto).

2.  **Instala las dependencias:**

    ```bash
    npm install
    ```

3.  **Inicia la aplicación:**
    _La aplicación se abrirá automáticamente en `http://localhost:3000`._
    ```bash
    npm start
    ```

Ahora la aplicación frontend debería estar conectada al backend y funcionando correctamente en tu navegador.

## Scripts Disponibles

En el directorio `excursiones`, puedes ejecutar los siguientes comandos:

- `npm start`: Inicia la aplicación en modo de desarrollo.
- `npm test`: Lanza el corredor de pruebas.
- `npm run build`: Compila la aplicación para producción.
