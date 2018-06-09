FROM node:9

WORKDIR /app

COPY . /app

ENV NODE_ENV=prod

EXPOSE 80

CMD [ "npm", "run", "app-prod" ]