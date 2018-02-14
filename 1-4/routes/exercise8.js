var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('exercise8', {
        showForm: true
    });
});

router.post('/', function (req, res, next) {
    res.render('exercise8', {
        showForm: false
    });
});

module.exports = router;
