# ---- Stage 1: Build ----
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies first (layer cache optimization)
# Use npm install instead of npm ci for lockfile v3 compatibility across npm versions
COPY package.json package-lock.json* ./
RUN npm install --prefer-offline

# Copy source and config
COPY . .

# Build for production
RUN npm run build

# ---- Stage 2: Serve with nginx ----
FROM nginx:alpine AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]