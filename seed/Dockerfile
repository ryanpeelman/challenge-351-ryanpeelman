FROM node:19-slim

# Install procps so the watch mode doesn't crash the container on reload
RUN apt-get update && apt-get -y install procps

# Default port for NestJS
EXPOSE 3000

#Temporary folder for node_modules
WORKDIR /opt/app

#Copy everything into docker
COPY . .

# Install dependencies
RUN npm i


# Add node_modules bin to the path
ENV PATH=/opt/app/node_modules/.bin:$PATH

