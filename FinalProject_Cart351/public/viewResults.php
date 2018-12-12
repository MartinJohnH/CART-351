<?php
// put required html mark up

// place body content here ...
class MyDB extends SQLite3
   {
      function __construct()
      {
          $this->open('../db/vocalTag.db');
      }
   }

try
{
   $db = new MyDB();

   $sql_select='SELECT * FROM vocalTagCollection';
   //$sql_select_2 = "SELECT * FROM vocalTagCollection WHERE creationDate >=Date('2002-01-01') AND artist = 'Sarah'";;
   // the result set
   $result = $db->query($sql_select);
   if (!$result) die("Cannot execute query.");
   while($row = $result->fetchArray(SQLITE3_ASSOC))
   {
     $myJSONObj2 = json_encode($row).",";
     echo $myJSONObj2;

}
}
catch(Exception $e)
{
   die($e);
}
?>
