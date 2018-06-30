FROM node:9.11-alpine

WORKDIR /app

COPY . /app


# ENV Vars to be passed in by compose
ARG db
ARG session_secret
ARG email_username
ARG email_password
ARG google_clientID
ARG google_client_secret
ARG GCalAPIKey
ARG github_clientID
ARG github_client_secret
ARG facebook_clientID
ARG facebook_client_secret

RUN npm install --prod --silent
RUN npm install @angular/cli@1.7.4 --silent
RUN npm rebuild node-sass
RUN npm run build:dev

EXPOSE 80

CMD [ "npm", "run", "app" ]