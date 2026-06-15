FROM nginx:alpine

# Remove default nginx config and content
RUN rm /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/credica.conf

# Copy static site files
COPY index.html /usr/share/nginx/html/
COPY join-code.html /usr/share/nginx/html/
COPY card.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY tokens.css /usr/share/nginx/html/
COPY page.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY privacy.html /usr/share/nginx/html/
COPY terms.html /usr/share/nginx/html/
COPY about.html /usr/share/nginx/html/
COPY business.html /usr/share/nginx/html/
COPY pricing-data.js /usr/share/nginx/html/
COPY enterprise.html /usr/share/nginx/html/
COPY tutorial.html /usr/share/nginx/html/
COPY pricing.html /usr/share/nginx/html/
COPY i18n.js /usr/share/nginx/html/
COPY i18n-data.js /usr/share/nginx/html/
COPY credica_logo.png /usr/share/nginx/html/
COPY credica-mark.svg /usr/share/nginx/html/
COPY credica-wordmark.png /usr/share/nginx/html/
COPY og-image.png /usr/share/nginx/html/
COPY credica_full.png /usr/share/nginx/html/
COPY favicon-16.png /usr/share/nginx/html/
COPY favicon-32.png /usr/share/nginx/html/
COPY apple-touch-icon.png /usr/share/nginx/html/
COPY robots.txt /usr/share/nginx/html/
COPY sitemap.xml /usr/share/nginx/html/
COPY auth/ /usr/share/nginx/html/auth/
COPY .well-known/ /usr/share/nginx/html/.well-known/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
