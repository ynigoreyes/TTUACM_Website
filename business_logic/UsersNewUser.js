var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

AWS.config.update({
    region: 'us-east-2',
    endpoint: 'http://localhost:8000'
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = 'Users';

var email =
