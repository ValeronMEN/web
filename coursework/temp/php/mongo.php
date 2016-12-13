<?php
echo "hi hi";
$m = new MongoClient();
$db = $m->selectDB('medicine');
$collection = new MongoCollection($db, 'drugs');

// recherche les documents dont l'identifiant est entre 5 < x < 20
//$rangeQuery = array('x' => array( '$gt' => 5, '$lt' => 20 ));

$cursor = $collection->find(); //$rangeQuery
foreach ($cursor as $doc) {
    var_dump($doc);
    echo "hi";
}
?>
