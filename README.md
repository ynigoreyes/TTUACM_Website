# TTUACM Website

Setting up the environment:

  1)  Download nodejs from <https://nodejs.org/en/>

  2)  Clone repo

  3) MongoDB is also a requirement to work on this website
      - Request access for the Mongo Atlas from either Miggy Reyes or Joshua Johnson
      - Testing database is "ttuweb-test" and the production database is "test"
      - <b>DO NOT RUN TEST ON "test" DB AS IT THE TEST WILL CLEAR THE DATABASE</b>

  3)  To start the website in a browser cd into the directory and type "npm start" without quotes then type in your browser "localhost:{development port chosen}"

  4)  To test the server, type "npm test"

  5)  To test the client, type "ng test" and navigate to localhost:4200

  6)  To view documentation, type "npm run docs"

Contributing:

  You can find all controllers and routes in their respective directories.
  <br>
  <br>
  The frontend framework of choice is Angular which can be found in the /src directory

  If port 80 doesn't work for you, you may change the port in /bin/www (line 15)

      var port = normalizePort(process.env.PORT || '80');

  A development port environment variable (DEV_PORT) should be declared to run the test suite and the server.

  Port 8080 is the port that is currently set as an OAuth2 api callback endpoint.
  If development port does not match, authentication will fail

  TODO: Make the footer all better
