FROM node:10
WORKDIR /app
COPY package*.json ./
RUN npm install

WORKDIR /app/client
COPY package*.json ./client/
RUN npm install
RUN npm run build

WORKDIR /app
COPY . .
EXPOSE 80
RUN npm run start
#CMD ["export", "NODE_ENV=production"]
#CMD ["node", "-r", "dotenv/config", "server/index.js"]
