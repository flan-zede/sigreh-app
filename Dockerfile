FROM node:14.1-alpine AS builder

WORKDIR /opt/web
COPY package.json package-lock.json ./
RUN npm install --production && ng build --aot --prod
ENV PATH="./node_modules/.bin:$PATH"
COPY . ./

ENV NODE_ENV=production
CMD [ "npm", "start" ]