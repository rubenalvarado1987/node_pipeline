"use strict";
const express = require("express");
const http = require("http");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;
const host = process.env.ROOTPATH || "localhost:" + port;

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'database-1.ce17alfb0vwr.sa-east-1.rds.amazonaws.com',
  user     : 'admin',
  password : 'Gsx400..',
  port     : 3306,
  database : "test",

});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});

app
  .use(
    helmet({
      frameguard: {
        action: "deny"
      }
    })
  )
  .use(helmet.noCache())
  .use(helmet.xssFilter())
  .use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'none'"],
        scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
        imgSrc: ["'self' data:"],
        connectSrc: ["'self'", host],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'"]
      }
    })
  )
  .use(
    cors({
      origin: host
    })
  )
  .use(bodyParser.urlencoded({ extended: false }));
/* .use((req, res, next) => {
    if (req.url === "/apps/se-personas/" || req.url === "/apps/se-personas") {
      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
      res.header("Pragma", "no-cache");
      res.header("Expires", 0);
    }
    next();
  })
  .use(
    "/apps/se-personas",
    express.static(path.join(__dirname, "/dist/se-personas-app"))
  )
  .use(methodOverride()); */


app.all("/", (req, res, next) => {
  // Just send the index.html for other files to support HTML5Mode
  res.sendFile("index.html", {
    root: path.join(__dirname, "/")
  });
});

app.get('/personas', function(req, res) {
  
  connection.query('SELECT * FROM persona', function (error, results, fields) {
    if (error) throw error;
    console.log('personas: ', results);
    res.json(results);
  });
});

const server = http.createServer(app);
server.listen(port, err => {
  if (err) {
    throw err;
  }
  console.log(
    `From Server: App iniciada exitósamente y corriendo en puerto: ${port}`
  );
});


//connection.end();
