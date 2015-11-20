'use strict';
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var environment = process.env.NODE_ENV;

console.log('Starting up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

switch (environment) {
case 'production':
  console.log('** PRODUCTION **');
  console.log('Serving from ./build/');
  //process.chdir('./../../');
  app.use('/', express.static('./build/'));
  break;
default:
  console.log('** DEV **');
  console.log('Serving from ./src/client/ and ./');
  app.use('/', express.static('./src/client/'));
  app.use('/', express.static('./'));
}

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});