# SmartLaw Prototype

Prototipo visual de SmartLaw para presentacion: dashboard, library, obligation detail, workflow, document vault, team y notifications.

## Ejecutar en local

### Opcion A (sin instalar nada)

1. Ejecuta `run-local.bat`
2. Se abrira el prototipo en tu navegador predeterminado

### Opcion B (entorno dev con servidor)

Requisitos: Node.js 18+.

1. Instalar dependencias:
   npm install
2. Arrancar entorno local:
   npm run dev
3. Abrir la URL que aparece en terminal (normalmente http://localhost:5173)

## Build de produccion

1. npm run build
2. npm run preview

## Estructura

- index.html: estructura de pantallas y layout
- styles.css: estilo visual (tema minimal, elegante)
- app.js: datos demo y navegacion entre secciones
