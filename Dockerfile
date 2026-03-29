FROM nginx:alpine

# Remove default nginx config and content
RUN rm /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/credica.conf

# Copy static site files
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY page.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY privacy.html /usr/share/nginx/html/
COPY terms.html /usr/share/nginx/html/
COPY support.html /usr/share/nginx/html/
COPY business.html /usr/share/nginx/html/
COPY i18n.js /usr/share/nginx/html/
COPY i18n-data.js /usr/share/nginx/html/
COPY credica_logo.png /usr/share/nginx/html/
COPY credica_full.png /usr/share/nginx/html/
COPY favicon-16.png /usr/share/nginx/html/
COPY favicon-32.png /usr/share/nginx/html/
COPY apple-touch-icon.png /usr/share/nginx/html/
COPY robots.txt /usr/share/nginx/html/
COPY sitemap.xml /usr/share/nginx/html/
COPY lang/ /usr/share/nginx/html/lang/
COPY auth/ /usr/share/nginx/html/auth/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
