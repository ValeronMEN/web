function getArea(){
  var x = document.getElementById("area");
  while (x.firstChild) {
    x.removeChild(x.firstChild);
  }
  var option = document.createElement("option");
  option.text = "Не вибрано";
  option.value = 0;
  x.add(option);

  var y = document.getElementById("city");
  while (y.firstChild) {
    y.removeChild(y.firstChild);
  }
  var option = document.createElement("option");
  option.text = "Не вибрано";
  option.value = 0;
  y.add(option);

  var loop = false;
  var arr = [];
  var e = document.getElementById("region");
  var areaValue = e.options[e.selectedIndex].value;
  if(areaValue == 1){
    arr = ["м. Алушта", "м. Армянськ", "Бахчисарайський р.", "Білогірський р.", "м. Джанкой", "Джанкойський р.","м. Євпаторія","м. Керч","Кіровський р.","Красногвардійський р.","м. Красноперекопськ","Красноперекопський р.","Ленінський р.","Нижньогірський р.","Первомайський р.","Райони Автономної Республіки Крим р.","Роздольненський р.","м. Саки","Сакський р.","м. Сімферополь","Сімферопольський р.","Совєтський р.", "м. Судак", "м. Феодосія", "Чорноморський р.", "м. Ялта"];
    loop = true;
  }else if(areaValue == 26){
    arr = ["Голосіївський р.","Дарницький р.","Деснянський р.","Дніпровський р.","Ленінградський (назва нечинна) р.","Оболонський р.","Печерський р.","Подільський р.","Радянський (назва нечинна) р.","Райони міста Київ р.","Святошинський р.","Солом'янський р.","Старокиївський (назва нечинна) р.","Харківський (назва нечинна) р.","Шевченківський р."];
    loop = true;
  }
  if(loop){
    arr.forEach(function(item, i, arr) {
      var option = document.createElement("option");
      option.text = item;
      option.value = i+1;
      x.add(option);
    });
  }
  return 0;
}

function getCity(){
  var x = document.getElementById("city");
  while (x.firstChild) {
    x.removeChild(x.firstChild);
  }
  var option = document.createElement("option");
  option.text = "Не вибрано";
  option.value = 0;
  x.add(option);

  var loop = false;
  var arr = [];
  var e = document.getElementById("area");
  var cityValue = e.options[e.selectedIndex].value;
  if(cityValue == 1){
    arr = ["сщ. Бондаренкове","с. Верхня Кутузовка","с. Виноградний","с. Генеральське","с. Запрудне","с. Зеленогір'я","с. Ізобільне","с/рада. Ізобільненська","с. Кипарисне","сщ. Лаванда","с. Лаврове","с. Лазурне","с. Лучисте","с/рада. Лучистівська","с. Малий Маяк","с/рада. Маломаяцька","с/рада. Малоріченська","с. Малоріченське","с. Нижнє Запрудне","с. Нижня Кутузовка","смт. Партеніт","сщ/рада. Партенітська","с. Привітне","с/рада. Привітненська","с. Пушкіне","с. Рибаче","сщ. Розовий","сщ. Семидвір'я","с. Сонячногірське","сщ. Утьос","сщ. Чайка"];
    loop = true;
  }
  if(loop){
    arr.forEach(function(item, i, arr) {
      var option = document.createElement("option");
      option.text = item;
      option.value = i+1;
      x.add(option);
    });
  }
  return 0;
}
