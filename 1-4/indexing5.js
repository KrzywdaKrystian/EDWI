var elasticsearch = require('elasticsearch');
var elasticManager = require('./elasticManager.js');
var Promise = require('bluebird');

var log = console.log.bind(console);

var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

function closeConnection() {
    client.close();
}

elasticManager.createIndex(client, 'mojIndex999');

function waitForIndexing() {
    log('Wait for indexing ....');
    return new Promise(function(resolve) {
        setTimeout(resolve, 2000);
    });
}

