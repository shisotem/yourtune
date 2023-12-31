# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Install sox and mp3 support
RUN apt-get update && apt-get install -y sox libsox-fmt-mp3

# Bundle app source
COPY . .

# Compile TypeScript to JavaScript
RUN npx tsc

# Create uploads directory
RUN mkdir uploads

# Make port 80 available to the world outside this container
EXPOSE 80

# Run the app when the container launches
CMD ["node", "dist/index.js"]