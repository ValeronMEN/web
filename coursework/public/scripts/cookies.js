function setCookieDrug(value){
  if (null == getCookie("drughere")){ // drughere
    document.cookie = "drug=" + encodeURI(value)+"$1," + "; path=/basket";
    document.cookie = "drughere=" + encodeURI(value)+"$1," + "; path=/drugs/drug";
  }else if(null != getCookie("drughere")){
    var cookieStr = getCookie("drughere");
    var startInd = cookieStr.indexOf(value);
    if (startInd == -1){
      cookieStr = value + "$1," + cookieStr;
      document.cookie = "drug=" + encodeURI(cookieStr) + ";  path=/basket";
      document.cookie = "drughere=" + encodeURI(cookieStr) + ";  path=/drugs/drug";
    }else{
      var subStr = cookieStr.substring(startInd);
      var endInd = subStr.indexOf(",");
      subStr = subStr.substring(0, endInd);
      startInd = subStr.indexOf("$");
      var amount = parseInt(subStr.substring(startInd+1, endInd));
      amount++;
      var newStr = value + "$" + amount + ",";
      cookieStr = cookieStr.replace(subStr+",", newStr);
      document.cookie = "drug=" + encodeURI(cookieStr) + "; path=/basket";
      document.cookie = "drughere=" + encodeURI(cookieStr) + "; path=/drugs/drug";
    }
  }
}

function deleteCookieDrug(value) {
  var cookieStr = getCookie("drug");
  var startInd = cookieStr.indexOf(value);
  var subStr = cookieStr.substring(startInd);
  var endInd = subStr.indexOf(",");
  subStr = subStr.substring(0, endInd);
  startInd = subStr.indexOf("$");
  var amount = parseInt(subStr.substring(startInd+1, endInd));
  amount--;
  if (amount == 0){
    var newStr = cookieStr.replace(subStr+",", "");
    if (null == newStr){
      deleteCookieDrugAll();
    }else{
      document.cookie = "drug=" + encodeURI(newStr) + "; path=/basket";
      document.cookie = "drughere=" + encodeURI(newStr) + "; path=/drugs/drug";
    }
  }else{
    var newStr = value + "$" + amount + ",";
    newStr = cookieStr.replace(subStr+",", newStr);
    document.cookie = "drug=" + encodeURI(newStr) + "; path=/basket";
    document.cookie = "drughere=" + encodeURI(newStr) + "; path=/drugs/drug";
  }
}

function deleteCookieDrugType(value) {
  var cookieStr = getCookie("drug");
  var startInd = cookieStr.indexOf(value);
  var subStr = cookieStr.substring(startInd);
  var endInd = subStr.indexOf(",");
  var newStr = cookieStr.substring(0, startInd) + subStr.substring(endInd+1);
  if (null == newStr){
    document.cookie = "drug=" +  "" + "; path=/basket";
    document.cookie = "drughere=" + "" + "; path=/drugs/drug";
  }else{
    document.cookie = "drughere=" + encodeURI(newStr) + "; path=/drugs/drug";
    document.cookie = "drug=" + encodeURI(newStr) + "; path=/basket";
  }
}

function deleteCookieDrugAll(){
  document.cookie = "drug=" + "" + "; path=/basket; expires=1";
  document.cookie = "drughere=" + "" + "; path=/drugs/drug; expires=1";
}

function getCookie(name) {
	var cookie = " " + document.cookie;
	var search = " " + name + "=";
	var setStr = null;
	var offset = 0;
	var end = 0;
	if (cookie.length > 0) {
		offset = cookie.indexOf(search);
		if (offset != -1) {
			offset += search.length;
			end = cookie.indexOf(";", offset)
			if (end == -1) {
				end = cookie.length;
			}
			setStr = unescape(cookie.substring(offset, end));
		}
	}
	return(setStr);
}