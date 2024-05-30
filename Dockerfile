FROM node:20.6.0-alpine

WORKDIR /app/gigabot
COPY package.json /app/gigabot
RUN npm install
COPY . /app/gigabot


CMD ["npm", "run", "start"]