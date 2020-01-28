FROM node:12

RUN mkdir -p /opt/apps/geocase-prototype

# App root
WORKDIR /opt/apps/geocase-prototype
# Copy project files
COPY . .

# Client
WORKDIR /opt/apps/geocase-prototype/client
RUN npm install
RUN npm run build
RUN npm prune --production

# Server
WORKDIR /opt/apps/geocase-prototype
RUN npm install
EXPOSE 8000
CMD ["npm", "run", "start"]
