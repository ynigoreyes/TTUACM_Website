FROM node:8

WORKDIR /app

COPY . /app

COPY package.json /app

ARG session_secret
ARG db
ARG email_username
ARG email_password
ARG google_clientID
ARG google_client_secret
ARG GCalAPIKey
ARG github_clientID
ARG github_client_secret
ARG facebook_clientID
ARG facebook_client_secret
ARG facebook_client_token
ARG PORT=8080


ENV session_secret=${session_secret}
ENV db=${db}
ENV email_username=${email_username}
ENV email_password=${email_password}
ENV google_clientID=${google_clientID}
ENV google_client_secret=${google_client_secret}
ENV GCalAPIKey=${GCalAPIKey}
ENV github_clientID=${github_clientID}
ENV github_client_secret=${github_client_secret}
ENV facebook_clientID=${facebook_clientID}
ENV facebook_client_secret=${facebook_client_secret}
ENV facebook_client_token=${facebook_client_token}
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD [ "npm", "run", "app-prod" ]