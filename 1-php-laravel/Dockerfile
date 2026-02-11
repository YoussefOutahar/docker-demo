FROM php:8.2-apache

# Copy application files to the web server directory
COPY index.php /var/www/html/

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Expose port 80
EXPOSE 80

# Start Apache in the foreground
CMD ["apache2-foreground"]
