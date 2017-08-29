var AWS = require("aws-sdk");

AWS.config.loadFromPath('./config.json');

AWS.config.update({
    region: 'us-east-2',
    endpoint: 'http://localhost:8000'
});

var db = new AWS.DynamoDB();

var tableName = "Articles";

putItem = function(itemName, itemBody) {
    console.log("Adding new item:", itemName);
    var item = {
        "ArticleDate": { 'N': new Date().getTime().toString() },
        "ArticleName": { 'S': itemName }
    };
    if (itemBody) item.body = { 'S': itemBody };
    db.putItem({
        "TableName": tableName,
        "Item": item
    }, function(err, data) {
        err && console.log(err);
    });
};

putItem("Testing", "Testing Body");
