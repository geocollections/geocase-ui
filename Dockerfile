FROM node:10
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 80
CMD ["export", "NODE_ENV=production"]
CMD ["export", "PORT=80"]
CMD ["node", "-r", "dotenv/config", "server/index.js"]
