var express = require('express');
var request = require('request');
var cheerio = require('cheerio');


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

    var url = req.body.url;
    var currentLevel = 0;
    var maxLevel = req.body.n;

    var index = 0;
    var arr = [];
    var defaultAddresses = null;

    function clearUrl(url) {
        url = url.replace('http://', '');
        url = url.replace('http:\\\\', '');
        url = url.replace('https://', '');
        url = url.replace('https:\\\\', '');

        let slashIndex = url.indexOf('/');
        if(slashIndex > -1) {
            url = url.substr(0, slashIndex);
        }
        url = url.replaceAll(' ', '');

        return url;
    }


    function getPage(parent, url, currentLevel) {
        index++;

        request.get({
            uri: url,
            encoding: null
        }, function (error, response, body) {
            if (error) {
                index--;
                return;
            }

            var $ = cheerio.load(body);

            let ip = null;
            let url2 = clearUrl(url);

            dns.lookup(url2, function onLookup(err, addresses, family) {
                if(err) {
                    console.log(err);
                }


                ip = addresses;
                console.log(index, addresses, url2);

                $ = cheerio.load(body);
                links = $('a');

                currentLevel++;

                $(links).each(function (i, link) {
                    var text = $(link).text();
                    var href = $(link).attr('href');

                    if(href && href.length > 0 && href.charAt(0) !== '#') {
                        arr.push({
                            level: currentLevel,
                            text: text,
                            href: href,
                            parent: parent ? parent.name : null,
                            ip: ip,
                            hostAsMain: defaultAddresses == ip
                        });

                        if(currentLevel < maxLevel) {
                            getPage(
                                {
                                    name: url
                                },
                                href,
                                currentLevel)
                            ;
                        }
                    }



                });
                index--;
            });



        });
    }

    url2 = clearUrl(url);

    dns.lookup(url2, function onLookup(err, addresses, family) {
        if(err) {
            console.log(err);
            return false;
        }
        defaultAddresses = addresses;
        console.log('default', defaultAddresses);
        console.log('--------');
        getPage(null, url, currentLevel);

    });



    var timeout;

    function waitForAll() {

        if(index === 0) {
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
