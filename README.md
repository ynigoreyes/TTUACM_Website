# TTUACM Website

Setting up the environment:

  1)  Download nodejs from <https://nodejs.org/en/>

  2)  Clone repo

  3) MongoDB is also a requirement to work on this website

  3)  To start the website in a browser cd into the directory and type "npm start" without quotes then type in your browser "localhost" without quotes

  4)  To test the server, type "npm test"

  5)  To test the client, type "ng test" and navigate to localhost:4200

TODO:

  1) SSL Certs

  2) Facebook Auth

  3) UI clean up

  4) Events Page/Google Calendar Set up

Contributing:

  You can find all controllers and routes in their respective directories.
  <br>
  <br>
  The frontend framework of choice is Angular which can be found in the /site-src directory

  If port 80 doesn't work for you, you may change the port in /bin/www (line 15)

      var port = normalizePort(process.env.PORT || '80');
