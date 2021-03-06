<?php

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
   echo ("Opened or created vocal tag data base successfully<br \>");
   $theQuery = 'CREATE TABLE vocalTagCollection (pieceID INTEGER PRIMARY KEY NOT NULL, geoLocLat TEXT, geoLocLong TEXT, sound TEXT)';
   $ok = $db ->exec($theQuery);
   // make sure the query executed
   if (!$ok)
      die($db->lastErrorMsg());
   // if everything executed error less we will arrive at this statement
   echo "Table vocalTagCollection created successfully<br \>";
}
catch(Exception $e)
{
   die($e);
}
?>
