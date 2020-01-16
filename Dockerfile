FROM node:10
WORKDIR /app
COPY package*.json ./
RUN npm install

CMD ["cd", "client/"]
COPY package*.json ./
RUN npm install
RUN npm run build
CMD ["cd", ".."]

COPY . .
EXPOSE 80
CMD ["export", "NODE_ENV=production"]
CMD ["node", "-r", "dotenv/config", "server/index.js"]
