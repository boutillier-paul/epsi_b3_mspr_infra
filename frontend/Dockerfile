# # Build stage
# FROM node:18.10.0-alpine AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build
# 
# # Run stage
# FROM nginx:1.22-alpine
# COPY --from=build /app/www /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 8080
# CMD ["nginx", "-g", "daemon off;"]


# Utilise l'image officielle de Node.js en tant que base
FROM node:18.10.0-alpline

# Crée un dossier de travail
WORKDIR /app

# Copie les fichiers package.json et package-lock.json dans le dossier de travail
COPY package*.json ./

# Installe les dépendances de l'application
RUN npm install

# Installe Angular CLI
RUN npm install -g @angular/cli

# Copie tous les fichiers de l'application dans le dossier de travail
COPY . .

# Expose le port 4200 utilisé par l'application Angular
EXPOSE 8080

# Définit la commande par défaut pour démarrer l'application
CMD ["npm", "start"]