var express = require('express');
var fs = require('fs');
var router = express.Router();

function Word(word) {

    this.word = word;
    this.count = 1;

    var self = this;

    self.updateCount = function () {
        self.count++;
    };

    self.getCount = function () {
        return self.count;
    };

    return self;
}

function compare(a, b) {
    return a.count - b.count;
}

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('exercise2', {showForm: true});
});

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

router.post('/', function (req, res, next) {
    var n, thresh;
    var words = [];

    fs.readFile('page.txt', "utf8", function (err, data) {
        if (err) {
            return next(error);
        }

        var dateStart = new Date();
        n = req.body.n;
        thresh = req.body.thresh;

        data = data.replaceAll('\n\n', '');

        var tmpWords = data.split(' ');

        // n
        tmpWords.forEach(function (word, key) {
            var exist = null;
            // n^2
            words.forEach(function (w, index) {
                if (w.word === word && word.length > 0 && word !== '') {
                    exist = w;
                    return false;
                }
            });

            if (!exist) {
                words.push(new Word(word));
            }
            else {
                exist.updateCount();
            }
        });

        var tmpSorted = words.sort(compare);
        tmpSorted.reverse();

        // n^2+n
        var sorted = [];
        tmpSorted.forEach(function (word) {
            if (word.getCount() >= thresh) {
                console.log('w', word, word.word, word.count);
                sorted.push(word);
            }
        });

        sorted = sorted.slice(0, n);

        res.render('exercise2', {
            showForm: false,
            words: sorted,
            n: n,
            thresh: thresh,
            text: data,
            dateDiff: Math.abs(new Date() - dateStart) / 60 + 's'
        });
    });
});

module.exports = router;
