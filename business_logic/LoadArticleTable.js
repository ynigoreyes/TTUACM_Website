var AWS = require('aws-sdk');
var fs = require('fs');

AWS.config.loadFromPath('./config.json');

AWS.config.update({
    region: "us-east-2",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing articles into DynamoDB.");

var allArticles = JSON.parse(fs.readFileSync('articles.json', 'utf8'));
allArticles.forEach(function(article) {
    var params = {
        TableName: "Articles",
        Item: {
            "ArticleDate": article.ArticleDate,
            "ArticleName": article.ArticleName,
            "body": article.body
        }
    };

    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add article:", article.ArticleName, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded:", article.ArticleName);
        }
    });
});
