function setCookieDrug(value){
  if (null == getCookie("drug")){
    document.cookie = "drug=" + encodeURI(value)+"$1," + "; path=/";
    setSize();
  }else if(null != getCookie("drug") && getSize() < 99){
    var cookieStr = getCookie("drug");
    var startInd = cookieStr.indexOf(value);
    if (startInd == -1){
      cookieStr = value + "$1," + cookieStr;
      document.cookie = "drug=" + encodeURI(cookieStr) + ";  path=/";
      setSize();
    }else{
      var subStr = cookieStr.substring(startInd);
      var endInd = subStr.indexOf(",");
      subStr = subStr.substring(0, endInd);
      startInd = subStr.indexOf("$");
      var amount = parseInt(subStr.substring(startInd+1, endInd));
      amount++;
      var newStr = value + "$" + amount + ",";
      cookieStr = cookieStr.replace(subStr+",", newStr);
      document.cookie = "drug=" + encodeURI(cookieStr) + "; path=/";
      setSize();
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
      document.cookie = "drug=" + encodeURI(newStr) + "; path=/";
      deleteSize(1);
    }
  }else{
    var newStr = value + "$" + amount + ",";
    newStr = cookieStr.replace(subStr+",", newStr);
    document.cookie = "drug=" + encodeURI(newStr) + "; path=/";
    deleteSize(1);
  }
}

function deleteCookieDrugType(value) {
  var cookieStr = getCookie("drug");
  var startInd = cookieStr.indexOf(value);
  var subStr = cookieStr.substring(startInd);
  var endInd = subStr.indexOf(",");
  var newStr = cookieStr.substring(0, startInd) + subStr.substring(endInd+1);
  subStr = subStr.substring(0, endInd);
  startInd = subStr.indexOf("$");
  var amount = parseInt(subStr.substring(startInd+1, endInd));
  if (null == newStr){
    deleteCookieDrugAll();
  }else{
    document.cookie = "drug=" + encodeURI(newStr) + "; path=/";
    deleteSize(amount);
  }
}

function deleteCookieDrugAll(){
  document.cookie = "drug=" + "" + "; path=/; expires=-1";
  deleteSize("All");
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

function setSize(){
  var cookieSize = getCookie('size');
  if (null == cookieSize){
    document.cookie = "size=1; path=/";
  }else{
    var size = parseInt(cookieSize);
    size++;
    document.cookie = "size=" + size + "; path=/";
  }
}

function deleteSize(userSize){
  var cookieSize = getCookie('size');
  if (null == cookieSize){
    document.cookie = "size=0; path=/; expires=-1";
  }else{
    var size = parseInt(cookieSize);
    size -= userSize;
    if (size < 1 || isNaN(userSize)){
      document.cookie = "size=0; path=/; expires=-1";
    }else{
      document.cookie = "size=" + size + "; path=/";
    }
  }
}

function fillSize(userSize){
  document.cookie = "size=0; path=/; expires=-1";
}

function setDeleteConstant(){
  document.cookie = "deleteConst=1; path=/";
}

function removeDeleteConstant(){
  document.cookie = "deleteConst=0; path=/";
}

function checkDeleteConstant(){
  if (getCookie('deleteConst').localeCompare("1") == 0){
    console.log("here");
    document.cookie = "deleteConst=0; path=/; expires=-1";
    deleteCookieDrugAll();
    fillSize();
  }
}

function getSize(){
  var cookieSize = getCookie('size');
  var size = parseInt(cookieSize);
  if (isNaN(size) || size == null){
    return 0;
  }else{
    return size;
  }
}
