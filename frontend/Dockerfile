# Stage 1: Build the react app
FROM node:20-alpine AS build

WORKDIR /usr/src/app

WORKDIR /app

COPY . /app

RUN yarn
#build the project for production
RUN yarn build

FROM nginx:alpine
# copy the build folder from react to the root of nginx (www)
COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80
# start nginx
CMD ["nginx", "-g", "daemon off;"]