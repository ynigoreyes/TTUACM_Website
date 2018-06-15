FROM node:9

WORKDIR /app

COPY . /app

EXPOSE 8080

RUN npm install --silent --prod

RUN npm run build

CMD [ "npm", "run", "app" ]

# Command to run image in a container:

# docker build -t acmtexastech/acmttu-web .
# docker run [-d for detached] -p 80:8080 acmtexastech/acmttu-web