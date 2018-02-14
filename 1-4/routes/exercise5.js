var express = require('express');
var request = require("request");
var iconv = require('iconv-lite');
var charset = require('charset');
var htmlToText = require('html-to-text');
var router = express.Router();
var jschardet = require("jschardet");
var math = require('mathjs');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('exercise5', {
        showForm: true
    });
});

router.post('/', function (req, res, next) {

    res.render('exercise5', {
        showForm: false,
        query: req.body.query,
        result: ''
    });x



});

module.exports = router;
