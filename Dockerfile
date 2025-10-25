FROM php:8.4.8-apache
RUN a2enmod proxy_http
ADD ./extra.conf /etc/apache2/conf-available/extra.conf
RUN a2enconf extra.conf
ADD ./html /var/www/html/tlh_editor/0.10.31
