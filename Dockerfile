# Use official Node.js LTS image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the NestJS project
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Expose port (change if your app listens on a different port)
EXPOSE 3005

# Start the app
CMD ["node", "dist/main"]
