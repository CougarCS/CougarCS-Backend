FROM node:14.19.0-alpine3.14 AS build

ENV NODE_ENV prod

WORKDIR /app

COPY package.json .babelrc ./

RUN npm install

COPY ./src ./src

RUN npm run build \
    && npm prune --production


FROM node:14.19.0-alpine3.14

WORKDIR /app

RUN chown -R 1000:1000 /app \
    && chmod 755 /app

USER 1000

COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist

EXPOSE ${PORT}

CMD ["node", "./dist/server.js"]