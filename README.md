# TTUACM Website

Setting up the environment:

  1)  Download nodejs from <https://nodejs.org/en/>

  2)  Clone repo

  3) MongoDB is also a requirement to work on this website
      - Request access for the Mongo Atlas from either Miggy Reyes or Joshua Johnson
      - Testing database is "ttuweb-test" and the production database is "test"
      - <b>DO NOT RUN TEST ON "test" DB AS IT THE TEST WILL CLEAR THE DATABASE</b>

  3)  To start the website in a browser cd into the directory and type "npm run client" without quotes then type in your browser "localhost:{development port chosen}"

  4)  To test the server, type "npm run api-test"

  5)  To test the client (ChromeHeadless), type "npm run client-test"

  6)  To view documentation, type "npm run docs"

  7)  To run app, build Angular using npm run build and then run npm run app(-prod) and navigate to port 8080

Contributing:

  You can find all controllers and routes in their respective directories.
  <br>
  <br>
  The frontend framework of choice is Angular which can be found in the /src directory
