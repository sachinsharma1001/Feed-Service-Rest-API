# Use NodeJS base image
FROM sachinsharma1001/feed-service-rest-api:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Bind the port that the image will run on
EXPOSE 8084

# Define the Docker image's behavior at runtime
CMD ["npm", "run", "dev"]
