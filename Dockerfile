FROM nginx:1.27-alpine

# Remove default nginx config and content.
# The echo token busts the BuildKit layer cache for all COPY steps below — bump
# it whenever a newly-added static file isn't showing up (Zeabur was replaying
# cached COPY layers and dropping card.html). 20260615-2
RUN rm /etc/nginx/conf.d/default.conf && rm -rf /usr/share/nginx/html/* && echo "cachebust 20260615-2"

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/credica.conf

# Copy static site files. Use globs for html/css/js so newly-added pages
# (e.g. card.html) are never missed by a forgotten per-file COPY line — the
# previous per-file list silently dropped card.html and 404'd the share link.
COPY *.html /usr/share/nginx/html/
COPY *.css /usr/share/nginx/html/
COPY *.js /usr/share/nginx/html/
COPY credica_logo.png credica-mark.svg credica-wordmark.png og-image.png credica_full.png /usr/share/nginx/html/
COPY favicon-16.png favicon-32.png apple-touch-icon.png /usr/share/nginx/html/
COPY robots.txt sitemap.xml /usr/share/nginx/html/
COPY auth/ /usr/share/nginx/html/auth/
COPY .well-known/ /usr/share/nginx/html/.well-known/
COPY tutorial-thumbs/ /usr/share/nginx/html/tutorial-thumbs/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
