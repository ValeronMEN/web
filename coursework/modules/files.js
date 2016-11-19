var glob = require('glob');
var fs = require('fs');

module.exports.deleteFile = function(filename){
  glob(filename, function(err,files){
       if (err) throw err;
       files.forEach(function(item,index,array){
            //console.log(item + " found");
       });

       // Delete files
       files.forEach(function(item,index,array){
            fs.unlink(item, function(err){
                 if (err) throw err;
                 console.log(item + " deleted");
            });
       });
  });
}
