var express = require('express');
var request = require("request");
var iconv = require('iconv-lite');
var charset = require('charset');
var htmlToText = require('html-to-text');
var router = express.Router();
var jschardet = require("jschardet");
var math = require('mathjs');
var cheerio = require('cheerio');

function Word(word) {

    this.word = word;
    this.count = 1;
    this.vectors = [];

    var self = this;

    self.updateCount = function () {
        self.count++;
    };

    self.addToCount = function (val) {
        self.count = this.count + val;
    };

    self.getCount = function () {
        return self.count;
    };

    self.setCount = function (count) {
        self.count = count;
    };

    return self;
}

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('exercise3', {
        documents: [
            /*'https://pastebin.com/raw/7maey69G',
            'https://pastebin.com/raw/BjRk6vis',
            'https://pastebin.com/raw/DvK0YxeK',*/

            'https://pl.wikipedia.org/wiki/Zoologia',
            'https://pl.wikipedia.org/wiki/Kolcog%C5%82owy',
            'https://pl.wikipedia.org/wiki/Entomologia',
            'https://pl.wikipedia.org/wiki/Etologia',
            'https://pl.wikipedia.org/wiki/Herpetologia',

            'https://pl.wikipedia.org/wiki/Muzyka_barokowa',
            'https://pl.wikipedia.org/wiki/Antonio_Vivaldi',
            'https://pl.wikipedia.org/wiki/Georg_Friedrich_Händel',
            'https://pl.wikipedia.org/wiki/Aram_Chaczaturian',
            'https://pl.wikipedia.org/wiki/Piotr_Czajkowski',

            'https://pl.wikipedia.org/wiki/Informatyka',
            'https://pl.wikipedia.org/wiki/Przetwarzanie_informacji',
            'https://pl.wikipedia.org/wiki/Programowanie_komputerów',
            'https://pl.wikipedia.org/wiki/Komputer',
            'https://pl.wikipedia.org/wiki/Programowanie_funkcyjne'
        ],
        showForm: true
    });
});

router.post('/', function (req, res, next) {

    // variables
    var documents = [];
    var len = req.body.documents.length;

    // main
    getDocument(0);

    // functions

    function getDocument(i) {
        console.log('document ' + (i + 1) + ' downloading...');

        request.get({
            uri: req.body.documents[i],
            encoding: null
        }, function (error, response, body) {
            if (error) {
                console.log(error);
                return next(error);
            }

            var $ = cheerio.load(body);
            // strip html
            body = htmlToText.fromString($('#bodyContent').text(), {
                wordwrap: false,
                ignoreHref: true,
                ignoreImage: true
            });

            // console.log(body);

            documents.push({
                documentUrl: req.body.documents[i],
                body: body,
                words: countWords(body)
            });

            console.log('document ' + (i + 1) + ' done!');

            i++;

            if (i >= len) {
                var dictionary = buildDictionary(documents);
                res.render('exercise3', {
                    showForm: false,
                    documents: req.body.documents,
                    dictionary: dictionary,
                    similarity: buildSimilarity(documents, dictionary)
                });
            }
            else {
                getDocument(i);
            }

        });
    }

    function countWords(body) {
        var words = [];
        var tmpWords = body.split(' ');

        tmpWords.forEach(function (word, key) {
            var exist = null;
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

        return words;
    }


    function buildDictionary(documents) {

        var words = [];
        documents.forEach(function (document) {
            document.words.forEach(function (word) {

                if (word.word.length > 0 &&
                    word.word.length !== '.' &&
                    word.word.length !== '·' &&
                    word.word.length !== '-' &&
                    word.word.length !== '\t·' &&
                    word.word.length !== '·' &&
                    word.word.length !== '·') {

                    var exist = null;
                    words.forEach(function (w, index) {
                        if (w.word === word.word) {
                            exist = w;
                            return false;
                        }
                    });

                    if (!exist) {
                        exist = new Word(word.word);
                        exist.setCount(word.getCount());
                        words.push(exist);
                    }
                    else {
                        exist.addToCount(word.getCount());
                    }

                }

            });
        });

        let vectors = [];

        for(let i = 0; i < documents.length; i++) {
            vectors[i] = [];
        }

        // sort
        words =  words.sort(function(a, b){
            if(a.word < b.word) return -1;
            if(a.word > b.word) return 1;
            return 0;
        });

        words.forEach(function (word, wordIndex) {
            word.vectors = [];

            documents.forEach(function (document) {
                document.words.forEach(function (word) {

                });
            });

            for(let i = 0; i < documents.length; i++) {
                const vectorObj = checkWordInDocument(word, documents[i]);
                word.vectors.push(vectorObj);
                vectors[i][wordIndex] = (vectorObj.instances/vectorObj.len);
            }


        });

        return {
            words: words,
            vectors: vectors
        };
    }

    function checkWordInDocument(word, document) {

        var ret = 0;
        var len = 0;

        document.words.forEach(function (w) {
            len += w.getCount();
            if(word.word === w.word) {
                ret = w.getCount();
            }
        });

        return {
            val: ret > 0 ? ret / len : 0,
            instances: ret,
            len : len
        };

    }

    function buildSimilarity(documents, dictionary) {
        
        var table = [];
        var vectors = dictionary.vectors;

        function calculateCosinusOfVectors(i, j) {
            let vA = vectors[i];
            let vB = vectors[j];

            let result = 0;
            let aLen = 0;
            let bLen = 0;

            for(let x = 0; x < vA.length; x ++) {
                result += vA[x] * vB[x];
                aLen += vA[x] * vA[x];
                bLen += vB[x] * vB[x];
            }

            let denominator = (Math.sqrt(aLen) * Math.sqrt(bLen));
            return denominator > 0 ? result / denominator : 0 ;
        }

        documents.forEach(function (document, index) {
            var tr = [];

            documents.forEach(function (d, i) {
                if(index > i) {

                    let val = calculateCosinusOfVectors(index, i);

                    let className;

                    if(val < 0.2) {
                        className = 'danger';
                    }
                    else if(val < 0.4) {
                        className = 'warning';
                    }
                    else if(val < 0.6) {
                        className = 'active';
                    }
                    else if(val < 0.8) {
                        className = 'info';
                    }
                    else {
                        className = 'success';
                    }

                    tr.push({
                        val: val,
                        className: className
                    });
                }
                else {
                    tr.push({
                        val: '-',
                        className: ''
                    });
                }
            });

            table.push(tr);

        });

        return table;
    }

});

module.exports = router;
