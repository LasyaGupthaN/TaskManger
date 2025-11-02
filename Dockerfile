# Use Node.js LTS version as base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other project files
COPY . .

# Expose the port your app runs on (adjust if not 3000)
EXPOSE 3000

# Start the Node.js app
CMD ["npm", "start"]
