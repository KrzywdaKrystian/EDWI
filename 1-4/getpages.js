var fs = require('fs');
var http = require('http');

let filename = '/Users/krystiankrzywda/projects/nodejs/eksplo/sitestoparse.txt';

let pages = [];
let i = 0;
let dirIndex = 0;
fs.readFile(filename, 'utf8', function(err, data) {

    if (err) throw err;

    let dataSplit = data.split('\n');

    dataSplit.forEach(function (page) {
        if(page.split(',')[1]){
            pages.push(page.split(',')[1]);
        }
    });

    console.log(pages.length, pages[0], pages[pages.length-1]);

    getContent(pages[i]);
});

function getContent(host) {

    let options = {
        host: host,
        path: '/'
    };

    let request = http.request(options, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {

            fs.writeFile("pages/"+i+'.txt', data, function(err) {
                if(err) {
                    return console.log(err);
                }

                console.log(host + " : The file was saved!");
                i++;
                if(i < 5) {
                    getContent(pages[i]);
                }
            });

        });
    });
    request.on('error', function (e) {
        console.log(e.message);
    });
    request.end();

}

