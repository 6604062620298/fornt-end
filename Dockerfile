# Use Node.js 18 for the build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files and build the Next.js app
COPY . .
RUN npm run build

# Production stage to run the Next.js app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built files from the previous stage
COPY --from=build /app ./

# Expose port 3000
EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "run", "start"]