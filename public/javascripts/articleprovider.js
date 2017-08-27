var articleCounter = 1;

ArticleProvider = function () {};
ArticleProvider.prototype.dummyData = [];

ArticleProvider.prototype.findAll = function (callback) {
    callback(null, this.dummyData)
};

ArticleProvider.prototype.findById = function (id, callback) {
    var result = null;
    for (var i = 0; i < this.dummyData.length; i++) {
        if (this.dummyData[i]._id == id) {
            result = this.dummyData[i];
            break;
        }
    }
    callback(null, result);
};

ArticleProvider.prototype.save = function (articles, callback) {
    var article = null;

    if (typeof(articles.length) == "undefined") articles = [articles];

    for (var i = 0; i < articles.length; i++) {
        article = articles[i];
        article._id = articleCounter++;
        article.created_at = new Date();
        article.created_at = article.created_at.toISOString();
        article.created_at = article.created_at.substr(5, 5) + '-' + article.created_at.substr(0, 4);

        this.dummyData[this.dummyData.length] = article
    }
    callback(null, article);
};

// Dummy Data
new ArticleProvider().save([
    {title: 'Post one', body: 'Body one', author:'Dave'},
    {title: 'Post two', body: 'Body two'},
    {title: 'Post three', body: 'Body three'}
], function (error, articles){});

exports.ArticleProvider = ArticleProvider;
