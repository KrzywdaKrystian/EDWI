var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('exercise1', { text: 'Napisać program służący do pobierania treści witryn internetowych. Program powinien przyjmować dane w postaci adresu strony, którą chcemy pobrać. Pobrane dane powinny zostać zapisane w pliku *.html tak, aby można go było później wykorzystać do innych zadań.' +
  'Przetworzyć zapisany plik *.html usuwając z niego wszystkie znaczniki html, usuwając znaki przestankowe i zamieniając wszystkie wielkie litery na małe. Wynik zapisać w pliku *.txt' });
});

module.exports = router;
