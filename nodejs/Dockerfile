# Use an official Node runtime as a parent image
FROM node:22

# Set the working directory in the container
WORKDIR /var/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the application code
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3003

# Define the command to run the app
CMD ["node", "index.js"]
