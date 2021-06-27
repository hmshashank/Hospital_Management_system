FROM node:12

WORKDIR /app

COPY package*.json ./app
COPY settings.json ./app
RUN npm install

COPY . .

EXPOSE 80
CMD ["node", "index.js"]

