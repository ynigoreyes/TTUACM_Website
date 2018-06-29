FROM node:9.11-alpine

WORKDIR /app

COPY . /app

RUN npm install --prod --silent
RUN npm install @angular/cli@1.7.4 --silent
RUN npm rebuild node-sass
RUN npm run build:prod

EXPOSE 443

CMD [ "npm", "run", "app-prod" ]