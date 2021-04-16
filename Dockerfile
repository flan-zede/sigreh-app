FROM node:12.18-alpine as node
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
RUN npm run build --aot --prod
COPY . .

FROM nginx:1.17.5
COPY default.conf.template /etc/nginx/conf.d/default.conf.template
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node  /usr/src/app/dist/sigreh /usr/share/nginx/html 
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'