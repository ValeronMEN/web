var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Express' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Express' });
});

router.post('/', function(req, res) {
    var login = req.body.login;
    var password = req.body.password;
    console.log("User sent: login: "+login+"; password: "+password);

    //res.send(login + ' ' + password);
    res.render('index', { title: 'Express' });
});

router.post('/signup', function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var regPassword1 = req.body.regPassword1;
    var regPassword2 = req.body.regPassword2;
    var sex = req.body.sex;
    console.log("User sent: firstname: "+firstname+"; lastname: "+lastname+"; email: "+email+"; password1: "+regPassword1+"; password2: "+regPassword2+"; sex: "+sex);

    if(regPassword1!==regPassword2){
      //error
    }

    //res.send(login + ' ' + password);
    res.render('index', { title: 'Express' });
});

module.exports = router;
