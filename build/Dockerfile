FROM node:23-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
# This allows Docker to cache the npm install step if these files don't change
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your Express app listens on
EXPOSE 3000

# Define the command to run when the container starts
CMD ["npm", "start"]
