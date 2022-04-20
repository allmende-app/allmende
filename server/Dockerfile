FROM node:16-alpine AS builder

WORKDIR /var/src/allmende-server
COPY package.json .
COPY src src
COPY tsconfig.json .
RUN npm install

FROM builder
RUN npm run build
RUN rm -rf node_modules src tsconfig.json
RUN npm install --only=prod
RUN npm install -g pm2

ENV NODE_ENV production

EXPOSE 3000

ENTRYPOINT [ "pm2-runtime", "dist/index.js" ]



