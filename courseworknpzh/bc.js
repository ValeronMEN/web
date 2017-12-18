const express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

const app = express();

app.use(bodyParser);
app.use(bodyParser.urlencoded({extended:true));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req,res){
  res.send('Hello');
});
app.listen(3000, function(){
  console.log("server on 3000");
});
