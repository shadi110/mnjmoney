# Use Nginx to serve static files
FROM nginx:alpine

# Copy your landing page files to Nginx
COPY . /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Nginx starts automatically