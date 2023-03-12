# Build stage
FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Run stage
FROM nginx:1.22-alpine
COPY --from=build /app/www /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]