var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

AWS.config.update({
    region: 'us-east-2',
    endpoint: 'http://localhost:8000'
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName: 'Articles',
    KeySchema: [
        { AttributeName: 'ArticleID', KeyType: 'HASH' },
        { AttributeName: 'ArticleName', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
        { AttributeName: 'ArticleID', AttributeType: 'N' },
        { AttributeName: 'ArticleName', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
    }
});
