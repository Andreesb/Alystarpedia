import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        // Habilitar CORS en el servidor de desarrollo
        cors: true,
        proxy: {
        // Configuración de proxy si necesitas redirigir algunas rutas
        '/api': {
            target: 'https://tibiadata.com', // URL de la API o recurso
            changeOrigin: true,
            secure: false,
        },
        },
    },
});
