FROM node:16-alpine3.14 AS build

RUN apk add g++ make py3-pip

COPY package.json .babelrc ./

RUN npm install

COPY . .

RUN npm run build \
    && npm prune --production

EXPOSE ${PORT}

CMD ["node", "./dist/server.js"]