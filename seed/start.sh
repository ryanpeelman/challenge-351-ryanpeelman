#!/bin/bash

# We create symlinks of the already installed node_modules and package-lock.json

# We wait for PostgreSQL in the docker-compose to be up and ready to accept connections
sleep 3

# Start the app, have fun
npm run prisma-init
npx prisma db seed
