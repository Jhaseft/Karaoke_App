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
PHP_FPM_CONF=$(php-fpm --ini | grep 'Loaded Configuration' | awk '{print $4}')
echo 'request_terminate_timeout = 120' >> /usr/local/etc/php-fpm.d/www.conf
php-fpm -D

# Iniciar scheduler de Laravel en background
(while true; do php artisan schedule:run --no-interaction; sleep 60; done) &

# Iniciar Nginx en foreground
nginx -g "daemon off;"
