FROM node:9.11-alpine

WORKDIR /app

COPY . /app

# ENV Vars to be passed in by compose: This is mainly used by Travis CI
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
ARG sslPath

RUN npm install --prod --silent
RUN npm install @angular/cli@1.7.4 --silent
RUN npm rebuild node-sass
RUN npm run build:prod
RUN npm uninstall @angular/cli
RUN npm prune

EXPOSE 443

CMD [ "npm", "run", "app-prod" ]
