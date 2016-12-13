echo "hi"
if(!empty($_GET['query'])){
  $query = (string)$_GET['query'];
  $array = array();
  // $request  = $db->query("SELECT `description`, `name` FROM `prefix_name` WHERE `description` LIKE '%". $db->real_escape_string($query) . "%' OR `name` LIKE '%". $db->real_escape_string($query) . "%' LIMIT 0, 10");
  $request  = $db.medicine.find();
  while($data =$db->fetch_assoc($request)){
    $array[] = $data['name'];
  }

  echo "['".implode("','", $array)."']";
}
exit();
