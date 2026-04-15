#!/bin/sh
set -e

# Generar APP_KEY si no existe
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Migraciones (si hay DB configurada)
if [ -n "$DB_HOST" ]; then
    php artisan migrate --force
fi

# Limpiar y cachear configuración para producción
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Iniciar PHP-FPM en background
php-fpm -D

# Iniciar Nginx en foreground
nginx -g "daemon off;"
