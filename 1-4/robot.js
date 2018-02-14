var roboto = require('roboto');
var fs = require('fs');
var html_strip = require('htmlstrip-native').html_strip;

var fooCrawler = new roboto.Crawler({
    startUrls: [
        "https://pl.wikipedia.org/"
    ],
    allowedDomains: [ // optional
        "pl.wikipedia.org",
    ]
});

// Add parsers to the crawler.
// Each will parse a data item from the response
fooCrawler.parseField('title', function(response, $){
    return $('head title').text();
});

// $ is a cherio selector loaded with the response body.
// Use it like you would jquery.
// See https://github.com/cheeriojs/cheerio for more info.
fooCrawler.parseField('body', function(response, $){
    var html = $('body').text();
    return html_strip(html);
});

// response has a few attributes from
// http://nodejs.org/api/http.html#http_http_incomingmessage
fooCrawler.parseField('url', function(response, $){
    return response.url;
});
let i = 0;
// Do something with the items you parse
fooCrawler.on('item', function(item) {
    // item = {
    //    title: 'Foo happened today!',
    //    body: 'It was amazing',
    //    url: http://www.foonews.com/latest
    // }

    fs.writeFile("pages/"+i+'.txt', item.title + '\n' + item.url + '\n' + item.body, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(item.title, item.url);
    });

    i++;

});

fooCrawler.crawl();