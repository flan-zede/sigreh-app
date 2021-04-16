FROM node:12.18-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
CMD ["npm", "start"]


FROM node:14.1-alpine AS builder
ENV NODE_ENV=production

WORKDIR /opt/web
COPY package.json package-lock.json ./
RUN npm install

RUN npm run build --aot --prod
COPY . ./


CMD [ "npm", "start" ]

### STAGE 1: Build ###
FROM node:14.1-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build:prod

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/sigreh /usr/share/nginx/html