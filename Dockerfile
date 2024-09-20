# docker compose -f docker-compose.dev.yml up --build
# docker compose -f docker-compose.dev.yml down

# Node base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the application port
EXPOSE 8080