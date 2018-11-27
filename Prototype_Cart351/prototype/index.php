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
}
catch(Exception $e)
{
    die($e);
}
//check if there has been something posted to the server to be processed
if($_SERVER['REQUEST_METHOD'] == 'POST')
{
// need to process
 $loc = $_POST['a_geo_loc'];
 if($_FILES)
  {
    //echo "file name: ".$_FILES['filename']['name'] . "<br />";
    //echo "path to file uploaded: ".$_FILES['filename']['tmp_name']. "<br />";
   $fname = $_FILES['filename']['name'];
   move_uploaded_file($_FILES['filename']['tmp_name'], "sounds/".$fname);
    //echo "done";
    // NEW:: add into our db ....
    //The data from the text box is potentially unsafe; 'tainted'.
    //We use the sqlite_escape_string.
    //It escapes a string for use as a query parameter.
    //This is common practice to avoid malicious sql injection attacks.
    $loc_es =$db->escapeString($loc);
    // the file name with correct path
    $soundWithPath= "sounds/".$fname;
    // for the new column
    //$time = date("Y-m-d",time());
    $queryInsert ="INSERT INTO vocalTagCollection(geoLoc, sound)VALUES ('$loc_es','$soundWithPath')";
    // again we do error checking when we try to execute our SQL statement on the db
    $ok1 = $db->exec($queryInsert);
    //note:: error messages WILL be sent back to JQUERY success function .....
    if (!$ok1) {
        die("Cannot execute statement.");
        exit;
    }
   //send back success...

   echo "success";
   exit;
    //package the data and echo back...
    $myPackagedData=new stdClass();
    $myPackagedData->location = $loc ;
    $myPackagedData->fileName = $fname ;
     // Now we want to JSON encode these values to send them to $.ajax success.
    $myJSONObj = json_encode($myPackagedData);
    echo $myJSONObj;
    exit;

  }//FILES
}//POST
?>
<!DOCTYPE html>
<html>
<head>
<title>Vocal Tag</title>
<link rel="stylesheet" type="text/css" href="css/main.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="js/main.js"></script>
<script language="javascript" type="text/javascript" src="js/audio.js"></script>
<script language="javascript" type="text/javascript" src="js/bg-sketch.js"></script>
</head>
<body style="background-color: #060647">
  <!-- NEW for the result -->
<div id = "result"></div>

<div class= "formContainer">
  <!--form done using more current tags... -->
  <form id="insertGallery" action="" enctype ="multipart/form-data">
    <!-- group the related elements in a form -->
    <fieldset>
      <input id="geoLoc" type = "text" size="24" maxlength = "40" name = "a_geo_loc" required>
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
          <a id="about" href="#">about</a>
        </div>

        <div id="inner_grid" class="nested_grid">
          <div class="title">
            <h1>VOCAL TAG</h1>
            <h4>zoom and drag to explore sounds</h4>
          </div>
          <div class="header_instructions">
            <h1>Create Yours</h1>
            <p>Create an up to 5 second sound which is in harmony with your personality. <br>Use any form of sound you like.</p>
          </div>
          <div class="button1">
            <div class="micro_Container">
              <div id="micro_icon" class="micro_icon"></div>
            </div>
            <div class="upload_Container">
              <div class="upload_icon"></div>
              <input id="uploadFile" type ="file" name = 'filename' accept="audio/*" size=10 required/>
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
    $("#insertGallery").submit(function(event) {
       //stop submit the form, we will post it manually. PREVENT THE DEFAULT behaviour ...
      event.preventDefault();
      console.log("button clicked");
      let form = $('#insertGallery')[0];
      let data = new FormData(form);
      $.ajax({
              type: "POST",
              enctype: 'multipart/form-data',
              url: "index.php",
              data: data,
              processData: false,//prevents from converting into a query string
              contentType: false,
              cache: false,
              timeout: 600000,
              success: function (response) {
             },
             error:function(){
               console.log("error occurred");
             }
      });
   });
   // validate and process form here
    function displayResponse(theResult){
      let container = $('<div>').addClass("outer");
      let title = $('<h3>');
      $(title).text("Results from user");
      $(title).appendTo(container);
      let contentContainer = $('<div>').addClass("content");
      for (let property in theResult) {
        console.log(property);
        if(property ==="fileName"){
          let img = $("<img>");
          $(img).attr('src','images/'+theResult[property]);

          $(img).appendTo(contentContainer);
        }
        else{
          let para = $('<p>');
          $(para).text(property+"::" +theResult[property]);
          $(para).appendTo(contentContainer);
        }

      }
      $(contentContainer).appendTo(container);
      $(container).appendTo("#result");
    }

});
</script>
</body>
</html>
