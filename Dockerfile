# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN yarn build

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["node", "dist/index.js"]