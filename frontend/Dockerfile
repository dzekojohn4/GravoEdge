# Stage 1: Build the react app
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
# Remove --legacy-peer-deps unless absolutely necessary
RUN npm ci --only=production

# Copy the rest of the application source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the built app using nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY ../spotnet.conf /etc/nginx/conf.d/default.conf

# Copy the built files from the previous stage to the nginx container
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the port Nginx will listen to
EXPOSE 80

# Use CMD instead of ENTRYPOINT for more flexibility
CMD ["nginx", "-g", "daemon off;"]