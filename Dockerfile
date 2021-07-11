FROM node:erbium-alpine3.11

WORKDIR /app

COPY package.json .babelrc ./

RUN npm install

COPY ./src ./src

RUN npm run build

RUN npm prune --production

FROM node:erbium-alpine3.11

USER 1000

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist

EXPOSE 4000

CMD ["node", "./dist/server.js"]