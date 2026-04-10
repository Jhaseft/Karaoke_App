import fs from 'fs';
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

const certPath = 'localhost+1.pem';
const keyPath  = 'localhost+1-key.pem';
const hasHttps = fs.existsSync(certPath) && fs.existsSync(keyPath);

export default defineConfig({
    server: hasHttps ? {
        https: {
            cert: fs.readFileSync(certPath),
            key:  fs.readFileSync(keyPath),
        },
        host: 'localhost',
        port: 5173,
    } : {},
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
});
