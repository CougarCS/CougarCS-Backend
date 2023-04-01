FROM node:16-alpine3.14 AS build

WORKDIR /app

RUN apk add g++ make py3-pip --no-cache

COPY package.json .babelrc ./

RUN npm install

COPY . .

RUN npm run build \
    && npm prune --production

EXPOSE ${PORT}

CMD ["node", "./dist/server.js"]