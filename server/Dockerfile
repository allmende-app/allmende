FROM node:16-alpine AS builder

RUN mkdir -p /var/src/allmende-server
WORKDIR /var/src/allmende-server
COPY . .
RUN npm install
RUN npm run build
# ENV NODE_ENV=production
# RUN rm -rf node_modules src
# RUN npm install --only=production

EXPOSE 3000
ENTRYPOINT ["node", "dist/index.js"]

