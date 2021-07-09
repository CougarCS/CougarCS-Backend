FROM node:erbium-alpine3.11 AS build

ENV NODE_ENV prod

WORKDIR /app

COPY package.json .babelrc ./

RUN npm install

COPY ./src ./src

RUN npm run build

RUN npm prune --production

FROM node:12.9.1-alpine

USER 1000

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist

EXPOSE 4000

CMD ["node", "./dist/server.js"]
