import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    // Establecemos 'base' a './' para que las rutas en el index.html
    // generado en /dist sean relativas (./assets/...) en lugar de absolutas (/assets/...)
    // Esto soluciona problemas de carga en Hostinger si el proyecto no se sirve desde reiz exacta.
    base: './',
});
