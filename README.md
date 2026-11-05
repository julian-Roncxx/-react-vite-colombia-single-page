# Explora Colombia – React + Vite (Single Page)

Tablero de una sola vista que consume la API pública [API Colombia](https://api-colombia.com/api/v1).
aqui encontraremos un desarrollo de l tablero "Explora Colombia", donde el usuario podrá filtrar departamentos en tiempo real y desplegar el detalle completo (ciudades y datos clave) dentro de una Card expandible o un Modal.
## Instalación y ejecución local del entorno de explora colombia 

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto http://localhost:5173).

## Decisiones técnicas

- **Una sola vista, sin router.** Todo vive en `App.jsx`; el detalle se muestra en un Modal para no cambiar de página.
- **Hooks:** `useState` para filtro y departamento seleccionado; `useEffect` para las peticiones; `useMemo` para el filtrado.
- **Custom hook `useDepartments`:** aísla la carga de datos (loading, error, reintento) de la UI.
- **Capa de API (`api.js`):** un único `request()` con `fetch` + `async/await` que lanza error si `res.ok` es falso, así los errores HTTP se tratan igual que los de red.
- **Asincronía segura:** `AbortController` en cada `useEffect` evita actualizar estado de componentes desmontados o respuestas de peticiones antiguas.
- **Filtrado reactivo:** se calcula en cada pulsación, ignorando mayúsculas y tildes (`Cordoba` encuentra `Córdoba`). No hay peticiones por cada tecla: la lista se descarga una vez.
- **Modal:** carga las ciudades al abrir (`/Department/{id}/cities`), muestra "Cargando…", error o lista vacía, y se cierra con la X, clic fuera o la tecla Esc. Bloquea el scroll del fondo y tiene `role="dialog"`.
- **Estados de UI:** loading, error con botón *Reintentar*, y vacío cuando el filtro no coincide.
- **Estilos:** CSS plano, responsive, con foco visible y respeto a `prefers-reduced-motion`.

## Estructura

```
src/
  api.js               # llamadas a la API
  useDepartments.js    # hook de datos
  DepartmentModal.jsx  # modal con detalle y ciudades
  App.jsx              # vista única: filtro + grilla
  App.css
```

## Capturas

> Agrega aquí tus capturas (carpeta `screenshots/`):
> 1. Listado completo
> 2. Filtro aplicado
> 3. Modal abierto con ciudades
> 4. Estado de error / carga
