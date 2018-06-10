FROM node:9

WORKDIR /app

COPY . /app

ENV NODE_ENV=prod

EXPOSE 8080

CMD [ "npm", "run", "app-prod" ]

# Command to run image in a container:

# docker build -t acmttu .
# docker run [-d for detached] -p 80:8080 acmttu