var express = require('express');
var router = express.Router();

router.get('/register', function(req, res, next) {
  res.render('signup');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/register', function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var sex = req.body.sex;
    console.log("User sent: firstname: "+firstname+"; lastname: "+lastname+"; email: "+email+"; username: "+username+"; password1: "+password+"; password2: "+confirmPassword+"; sex: "+sex);

    //validation
    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('lastname', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors){
      res.render('signup', {errors: errors});
    }else{
      var newUser = new User({
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        sex: sex
      });

      User.createUser(newUser, function(err, user){
        if(err) throw err;
        console.log(user);
      });

      req.flash('success_msg', 'You are registred and now can log in');
      res.redirect('login');
    };
});

module.exports = router;
