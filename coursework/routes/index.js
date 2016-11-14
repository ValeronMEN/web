var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var arr = []; // array of my drugs
  Drug.getDrugs(function(err, drugs){
    if (err){
      throw err;
    }
    for (let i = 0; i < drugs.length; i++){
      let myDrug = drugs[i];
      arr.push({
        "name": myDrug.name,
        "image": '../pics/' + myDrug.image + '.jpg'
      });
    };
    console.log(arr);
    res.render('index', { arr: arr });
  });
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

router.post('/', function(req, res) {
    var login = req.body.login;
    var password = req.body.password;
    console.log("User sent: login: "+login+"; password: "+password);
    res.render('index');
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
    res.render('success');
});

module.exports = router;
