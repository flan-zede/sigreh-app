FROM node:14.1-alpine AS builder

WORKDIR /opt/web
COPY package.json package-lock.json ./
RUN npm install --production

ENV PATH="./node_modules/.bin:$PATH"

COPY . ./
RUN ng build --aot --prod

ENV NODE_ENV=production
CMD [ "npm", "start" ]