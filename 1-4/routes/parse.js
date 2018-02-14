var express = require('express');
var router = express.Router();
var request = require("request");
var fs = require('fs');
var iconv = require('iconv-lite');
var charset = require('charset');
var htmlToText = require('html-to-text');

router.post('/', function(req, res, next) {

    request.get({
            uri:  req.body.link,
            encoding: null
    }, function(error, response, body){
        if( error )
            return next(error);

        enc = charset(res.headers, body);
        enc = enc || jschardet.detect(body).encoding.toLowerCase();

        fs.writeFile("page.html", body, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The page was saved!");

            body = iconv.decode(body, enc);

            // strip html
            body = htmlToText.fromString(body, {
                wordwrap: false,
                ignoreHref: true,
                ignoreImage: true
            });
            // body = striptags(body);
            // lowercase
            body = body.toLowerCase();
            // remove punctuation marks
            body = body.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");


            fs.writeFile("page.txt", body, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The page ax txt was saved!");

                res.render('parse', { uri: req.body.link, result: body });
            });

        });

    });

});

module.exports = router;
