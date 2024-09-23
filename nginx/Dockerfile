# Dockerfile for nginx
FROM nginx:latest

# Install Certbot and necessary dependencies
RUN apt-get update && apt-get install -y certbot python3-certbot-nginx

# Copy the nginx configuration to the container
COPY ./nginx /etc/nginx/user_conf.d

# Expose the necessary ports
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

