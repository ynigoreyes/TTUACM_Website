# TTUACM Website

Setting up the environment:

  1)  Download nodejs from https://nodejs.org/en/
  
  2)  Clone repo
  
  3)  To start the website in a browser cd into the directory and type "npm start" without quotes then type in your browser "localhost" without quotes
  
Contributing:
  
  All front end HTML files can be found in /views they are .jade files because express uses a template building system where HTML and js can be written in the same document
  
  Images can be found in /public/images
  
  Stylesheets can be found in /public/stylesheets
  
  Javascripts can be found in /public/javascripts
  
  To add a new page to the server use /routes/index.js
  
  Database logic and models can be found in /business_logic
  
  If port 80 doesn't work for you, you may change the port in /bin/www (line 15)
    
      var port = normalizePort(process.env.PORT || '80');
