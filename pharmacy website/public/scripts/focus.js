function buying(obj){
  var sobj = obj.style;
  obj.style.background = "red";
  var a = getSize();
  if (a != 0 && a != null){
    document.getElementById("basketSize").innerHTML = a;
    document.getElementById("circle").style.visibility = "visible"
  }
  setTimeout(
     function(){
     obj.style = sobj;
   }, 500
  );
}
