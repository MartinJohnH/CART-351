<?php
//original php code found http://clab.concordia.ca/introduction-to-php/ and http://clab.concordia.ca/intro-to-sql-lite/
//Modified the code to adapt it to my website
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

}
catch(Exception $e)
{
    die($e);
}
//check if there has been something posted to the server to be processed
if($_SERVER['REQUEST_METHOD'] == 'POST')
{
// need to process
 $loc1 = $_POST['a_geo_loc_lat'];
 $loc2 = $_POST['a_geo_loc_long'];

 if($_FILES)
  {
    if(!file_exists($_FILES['filename']['tmp_name']) || !is_uploaded_file($_FILES['myfile']['tmp_name'])){
      $fname = $_FILES['filename']['name'];
      move_uploaded_file($_FILES['filename']['tmp_name'], "sounds/".$fname);
      $soundWithPath= "sounds/".$fname;
    }
      if(isset($_FILES['recordeSound']) and !$_FILES['recordeSound']['error']){
        $fname = $_FILES['recordeSound']['name'];
        move_uploaded_file($_FILES['recordeSound']['tmp_name'], "sounds/" .$fname.".wav");
        $soundWithPath= "sounds/".$fname.".wav";
      }

    //This is common practice to avoid malicious sql injection attacks.
    $loc_lat_es = $db->escapeString($loc1);
    $loc_long_es = $db->escapeString($loc2);
    // the file name with correct path
    $queryInsert ="INSERT INTO vocalTagCollection(geoLocLat, geoLocLong, sound)VALUES ('$loc_lat_es','$loc_long_es','$soundWithPath')";
    // again we do error checking when we try to execute our SQL statement on the db
    $ok1 = $db->exec($queryInsert);
    //note:: error messages WILL be sent back to JQUERY success function .....
    if (!$ok1) {
        die("Cannot execute statement.");
        exit;
    }
   //send back success...

   $sql_select='SELECT * FROM vocalTagCollection';
   //$sql_select_2 = "SELECT * FROM vocalTagCollection WHERE creationDate >=Date('2002-01-01') AND artist = 'Sarah'";;
   // the result set
   $result = $db->query($sql_select);
   if (!$result) die("Cannot execute query.");

   $res = array();
   $i=0;
   while($row = $result->fetchArray(SQLITE3_ASSOC))
   {
     // note the result from SQL is ALREADy ASSOCIATIVE
     $res[$i] = $row;
     $i++;
   }//end while
   // endcode the resulting array as JSON
   $myJSONObj = json_encode($res);
   echo $myJSONObj;
    exit;

  }//FILES
}//POST
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="author" content="Martin-John Hearty">
<meta name="description" content="A Vocal Tag is a short, personalized, sound clip that you record, upload, and share. Create Yours!">
<meta name="keywords" content="vocal, tag, audio, drop, beat, clip, voice, recording, sounds">
<meta name="title" content="Vocal Tag - Short, Personalized, Sound Clips">

<meta property="og:title" content="Vocal Tag">
<meta property="og:type" content="website">
<meta property="og:description" content="A Vocal Tag is a short, personalized, sound clip that you record, upload and share. Create Yours!">
<meta property="og:url" content="https://hybrid.concordia.ca/m_hearty/vocaltag/">
<meta property="og:site_name" content="Vocal Tag">

<title>Vocal Tag</title>
<link rel="stylesheet" type="text/css" href="css/main.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/p5.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/addons/p5.sound.min.js"></script>
<script src="https://cdn.rawgit.com/mattdiamond/Recorderjs/08e7abd9/dist/recorder.js"></script>
<script language="javascript" type="text/javascript" src="js/main.js"></script>
<script language="javascript" type="text/javascript" src="js/audio.js"></script>
<script language="javascript" type="text/javascript" src="js/audio2.js"></script>
<script language="javascript" type="text/javascript" src="js/bg-sketch.js"></script>
</head>
<body style="background-color: #060647">

  <div class= "formContainer">
    <form id="insertGallery" action="" enctype ="multipart/form-data">
      <fieldset>
        <input id="geoLocLat" type = "text" size="24" maxlength = "40" name = "a_geo_loc_lat">
        <input id="geoLocLong" type = "text" size="24" maxlength = "40" name = "a_geo_loc_long">

        <div id="main_grid" class="grid_container">

          <div id="headerLeft" class="headerLeft">
            <div class="empty_header"></div>
            <div class="empty_headerR"></div>
            <div class="empty_headerL"></div>
            <a id="logo" href="./">V/T</a>
          </div>

          <div class="headerMid">
            <div id="arch" class="arch">
              <div class="empty_header"></div>
              <div class="empty_header2"></div>
              <div class="empty_headerR"></div>
              <div class="empty_headerL"></div>
              <div class="empty_headerR2"></div>
              <div class="empty_headerL2"></div>
              <div class="plus_button">
                <div id="plus_symbol" class="plus_symbol"></div>
              </div>
              <div class="plus_button_area"></div>
              <div class="plus_button_area2"></div>
            </div>
          </div>

          <div id="headerRight" class="headerRight">
            <div class="empty_header"></div>
            <div class="empty_headerR"></div>
            <div class="empty_headerL"></div>
            <a id="about" href="about.html">about</a>
          </div>

          <div id="inner_grid" class="nested_grid">
            <div class="title">
              <h1>VOCAL TAG</h1>
              <h4>hover over circles to explore sounds</h4>
            </div>
            <div class="header_instructions">
              <h1>Create Yours</h1>
              <p>Create an up to 3 second sound which is in harmony with your personality. <br>Use any form of sound you like.</p>
            </div>
            <div class="button1">
              <div class="micro_Container">
                <div id="micro_icon" class="micro_icon"></div>
              </div>
              <div class="upload_Container">
                <div class="upload_icon"></div>
                <input id="uploadFile" type ="file" name = 'filename' accept="audio/*" size=10/>
                <audio id="vocalTagPrev" controls></audio>
              </div>
            </div>
            <div id="button2" class="button2">
              <div class="play_icon"></div>
            </div>
            <div id="button3" class="button3">
              <div class="check_icon"></div>
              <div class="submit_Container">
                <input type = "submit" name = "submit" value = "submit my info" id ="buttonS" />
              </div>
            </div>
            <div class="sound_wave_container">
              <canvas id="soundWaveCanvas">
            </div>
            <div id="completeContainer" class="completeContainer"></div>
          </div>

          <div class="overlay_bg"></div>
          <div class="footer"></div>
        </div>
      </fieldset>
    </form>
  </div>
  <script>
  $(document).ready (function(){
    $.ajax({
        type: "GET",
        url: "viewResults.php",
        success: function (response) {
        if(response.length !== 0){
          let res = response.slice(0, -1);
          res = '['+res+']';
          let parsedJSON = JSON.parse(res);
          displayResponse(parsedJSON);
        }
       },
       error:function(){
      console.log("error occurred");
    }
    });
      $("#insertGallery").submit(function(event) {
        var filename = new Date().getTime();
         //stop submit the form, we will post it manually. PREVENT THE DEFAULT behaviour ...
        event.preventDefault();
        console.log("button clicked");
        let form = $('#insertGallery')[0];
        let data = new FormData(form);
        if(!soundUploaded){
          data.append('recordeSound', audioBlob2, filename);
        }
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "index.php",
            data: data,
            processData: false, //prevents from converting into a query string
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (response) {
            //use the JSON .parse function to convert the JSON string into a Javascript object
            let parsedJSON = JSON.parse(response);
            displayResponse2(parsedJSON);
           },
           error:function(){
          console.log("error occurred");
        }
      });
     });

  });
  </script>

</body>
</html>
