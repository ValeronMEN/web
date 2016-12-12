window.onload = function() {
  var a = getSize();
  if (a != 0 && a != null){
    document.getElementById("basketSize").innerHTML = a;
    document.getElementById("circle").style.visibility = "visible"
  }
}
