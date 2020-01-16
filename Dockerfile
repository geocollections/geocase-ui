FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["cd", "client/"]
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


EXPOSE 80
CMD ["export", "NODE_ENV=production"]
CMD ["node", "-r", "dotenv/config", "server/index.js"]
