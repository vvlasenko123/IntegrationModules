FROM node:20-alpine AS build
WORKDIR /app

COPY frontend/integration-modules/package.json frontend/integration-modules/package-lock.json ./frontend/integration-modules/
WORKDIR /app/frontend/integration-modules
RUN npm ci

COPY frontend/integration-modules/ ./
RUN npm run build


FROM nginx:1.27-alpine AS runtime

COPY frontend/integration-modules/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/integration-modules/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]