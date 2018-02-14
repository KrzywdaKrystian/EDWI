var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var urlLib = require("url");
var dnsSync = require('dns-sync');
var dns = require('dns');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('exercise4', {
        url: 'http://pduch.kis.p.lodz.pl/',
        showForm: true
    });
});

router.post('/', function (req, res, next) {

    let url = req.body.url;
    var index = 0;
    var arr = [];
    var logs = '';
    var maxLevel = req.body.n;

    console.log('MAX_LEVEL', maxLevel);
    var defaultAddresses = null;

    function getPage(url, currentLevel, parent) {
        index++;

        request.get({
            uri: url,
            encoding: null
        }, function (err, response, body) {
            if (err) {
                console.log(err);
                index--;
                return;
            }

            var location = urlLib.parse(url);
            var pathname = location.protocol + '//' + location.hostname + '/';

            $ = cheerio.load(body);
            links = $('a');

            // console.log('start forEach');
            $(links).each(function (i, link) {

                var href = link.attribs.href;

                if(href && href.length > 1 && href.substring(0, 6) !== 'mailto') {
                    // console.log(href);
                    if(href.substring(0,4) === 'http') {
                        // console.log(currentLevel, (parent ? parent + ' ' : '') + href);
                        href = href.replace('http:\\\\', 'http://');
                        href = href.replace('https:\\\\', 'https://');
                        logs += (currentLevel + ' ' + (parent ? parent + ' ' : '') +  href + '\n');

                        // moze być ten sam serwer
                        var currentDNS = checkDns(pathname);
                        arr.push({
                            text: $(link).text(),
                            href: href,
                            dnsAddress: currentDNS,
                            pathname: pathname,
                            parent: parent,
                            hostAsMain: currentDNS  === defaultAddresses
                        });
                        if(currentLevel < maxLevel) {
                            getPage(href, currentLevel + 1, url);
                        }
                    }
                    else if(href.charAt(0) !== '#'){
                        // console.log(currentLevel, (parent ? parent + ' ' : '') + href);
                        logs += (currentLevel + ' ' + (parent ? parent + ' ' : '') + ' ' + pathname + href + '\n');


                        // ten sam serwer
                        arr.push({
                            text: pathname + $(link).text(),
                            href: pathname + href,
                            dnsAddress: defaultAddresses,
                            pathname: pathname,
                            parent: parent,
                            hostAsMain: true
                        });
                        if(currentLevel < maxLevel) {
                            getPage(pathname + href, currentLevel + 1, url);
                        }
                    }

                }

            });
            index--;
        });

    }

    defaultAddresses = checkDns(url);
    getPage(url, 1);

    var timeout;

    function checkDns(url) {
        url = url.replace('http://', '');
        url = url.replace('https://', '');
        url = url.replaceAll('/', '');

        return dnsSync.resolve(url);
    }

    function waitForAll() {

        if(index === 0) {
            console.log('wyswietl');
            fs.writeFile("test.txt", logs, function(err) {
                if(err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });

            res.render('exercise4', {
                showForm: false,
                results: arr
            });
        }
        else {
            timeout = setTimeout(waitForAll, 500);
        }
    }

    timeout = setTimeout(waitForAll, 500);

});

module.exports = router;
