FROM php:8.4-fpm-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache \
    nginx \
    nodejs \
    npm \
    python3 \
    py3-pip \
    curl \
    zip \
    unzip \
    git \
    libpng-dev \
    libzip-dev \
    oniguruma-dev

# Extensiones PHP necesarias para Laravel
RUN docker-php-ext-install pdo pdo_mysql mbstring zip gd bcmath opcache

# Asegurar que shell_exec no esté deshabilitado (necesario para yt-dlp)
RUN echo "disable_functions =" > /usr/local/etc/php/conf.d/yt-dlp.ini

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Instalar yt-dlp con pip (ignorar aviso de entorno externo en Alpine)
RUN pip3 install --break-system-packages yt-dlp

# Configurar Nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Directorio de trabajo
WORKDIR /var/www/html

# Copiar composer files primero para aprovechar cache de Docker
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copiar package.json y compilar assets
COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

# Permisos de Laravel
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Script de inicio
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]
