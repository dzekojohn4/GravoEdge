# Stage 1: Build the react app
FROM node:18 AS build

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies with legacy peer deps option
RUN npm install --legacy-peer-deps || true

# Copy the rest of the application source code
COPY . .

# Build the app (if there are build commands in the package.json)
RUN npm run build

# Stage 2: Serve the built app using nginx
FROM nginx:alpine

# Copy the built files from the previous stage to the nginx container
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the port Nginx will listen to
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]