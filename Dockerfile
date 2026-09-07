FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=80
COPY --from=build --chown=node:node /app/.output ./.output
USER node
EXPOSE 80
CMD ["node", ".output/server/index.mjs"]
