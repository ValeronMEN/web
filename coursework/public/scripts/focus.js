function buying(obj){
  var sobj = obj.style;
  obj.style.background = "red";
  setTimeout(
     function(){
     obj.style = sobj;
   }, 500
  );
}
