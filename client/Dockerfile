FROM node:lts-alpine

RUN mkdir -p /var/src/allmende-client
WORKDIR /var/src/allmende-client
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ENV NODE_ENV=production
# RUN rm -rf node_modules src
# RUN npm install --only=production

EXPOSE 5050
ENTRYPOINT ["npm", "run","preview"]