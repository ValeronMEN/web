function setCookie(name, value, options) {
  options = options || {};
  var expires = options.expires;
  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }
  value = encodeURIComponent(value);
  var updatedCookie = name + "=" + value;
  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }
  document.cookie = updatedCookie;
}

router.get('/', function(req, res, next){
  //console.log("Incoming cookies: "+req.cookies.drug);
  if (typeof req.cookies.drug == 'undefined'){
    res.render('basket', {arr: null});
  }
  else{
    var arr = req.cookies.drug.split(",");
    var expected_amount = arr.length;
    var amount = new Array(arr.length).fill(1);
    var drugs = [];
    var control_amount = 0;
    for (let i=0; i<arr.length; i++){
      if (null != arr[i]){
        if (i+1 != arr.length){
          for (let j=i+1; j<arr.length; j++){
            if (arr[i] == arr[j]){
              amount[i]++;
              arr[j] = null;
              amount[j] = 0;
            }
            else if (j+1 == arr.length){
              Drug.getDrugById(arr[i], function(err, drug){
                drugs.push({
                  name: drug.name,
                  volumemass: drug.volumemass,
                  unit: drug.unit,
                  type: drug.type,
                  price: drug.price,
                  image: "/pics/drugs/"+drug.image,
                  amount: amount[i]
                });
                control_amount += amount[i];
                if (i+1 != arr.length){ //check next elements of arr array for null
                  for (let k=i+1; k<arr.length; k++){
                    if (arr[k]!=null){
                      break;
                    }
                    else if(k+1 == arr.length){
                      if (control_amount==expected_amount){
                        console.log("j-k branch "+arr + amount + drugs);
                        res.render('basket', {
                          arr: drugs
                        });
                      }
                    }
                  }
                }else{
                  if (control_amount==expected_amount){
                    console.log("i+1=len (k) branch "+arr + amount + drugs);
                    res.render('basket', {
                      arr: drugs
                    });
                  }
                }
              });
            }
          }
        }else{
          Drug.getDrugById(arr[i], function(err, drug){
            drugs.push({
              name: drug.name,
              volumemass: drug.volumemass,
              unit: drug.unit,
              type: drug.type,
              price: drug.price,
              image: "/pics/drugs/"+drug.image,
              amount: amount[i]
            });
            control_amount += amount[i];
            if (control_amount==expected_amount){
              console.log("i+1=len (j) branch "+arr + amount + drugs);
              res.render('basket', {
                arr: drugs
              });
            }
          });
        }
      }
    }
  }
});

function setCookieDrugPrev (name, value) {
  if (null == getCookie(name + "here")){
    var path = "/basket";
    document.cookie = name + "=" + encodeURI(value) + ((path) ? "; path=" + path : "");
    document.cookie = name + "here" + "=" + encodeURI(value);
  }
  else{
    var path = "/basket";
    var cookieStr = value + "," + getCookie(name + "here");
    document.cookie = name + "=" + encodeURI(cookieStr) + ((path) ? "; path=" + path : "");
    document.cookie = name + "here" + "=" + encodeURI(cookieStr);
    console.log(document.cookie);
  }
}

function setCookieFull (name, value, expires, path, domain, secure) {
      document.cookie = name + "=" + encodeURI(value) +
        ((expires) ? "; expires=" + expires : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}
