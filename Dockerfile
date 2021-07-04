FROM node:12.9.1-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --production=false

COPY . .

RUN yarn build

EXPOSE 4000

CMD ["node", "dist/server.js"]