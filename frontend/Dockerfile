# Dockerfile.nginx

# Stage 1: Build the React app
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn
COPY src/ ./src/
COPY public/ ./public/
RUN yarn build

# Stage 2: Set up Nginx to serve the built app
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY spotnet.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

