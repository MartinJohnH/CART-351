let isButtonClicked = false;
let soundUploaded = false;
let canvasCtx;
let audioCtx, voiceSelect, source, stream, analyser, drawVisual;

$(document).ready(function() {
  let canvas = document.getElementById('soundWaveCanvas');
  canvasCtx = canvas.getContext('2d');

  $(".plus_button").on('click', function () {
    isButtonClicked = !isButtonClicked;
    if(isButtonClicked){
      onOpen();
      function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        } else {
          x.innerHTML = "Geolocation is not supported by this browser.";
        }
      }
      function showPosition(position) {
        document.getElementById("geoLocLat").value = position.coords.latitude;
        document.getElementById("geoLocLong").value = position.coords.longitude;
        console.log(document.getElementById("geoLocLat").value);
        console.log(document.getElementById("geoLocLong").value);
      }
      getLocation();
    }else{
       onClose();
    }
  });

  let counter = 0;
  let isMicOn = false;
  let isPlayButtonEnabled = false;
  let isCheckButtonEnabled = false;

  $(".micro_Container").click(function () {
    isMicOn = true;
    counter++;

    $(".micro_Container")[0].style.backgroundColor = "rgba(106, 188, 59, 1)";
    $("#micro_icon")[0].style.backgroundImage="url(../vocaltag/images/icon_micro2.svg)";
    $("#micro_icon")[0].style.opacity= 1;

    $(".upload_icon")[0].style.backgroundImage="url(../vocaltag/images/icon_upload2.svg)";
    document.getElementById("button2").className = "button2";
    $(".play_icon")[0].style.backgroundImage="url(../vocaltag/images/icon_play.svg)";
    $(".play_icon")[0].style.opacity= 0.35;

    $(".check_icon")[0].style.backgroundImage="url(../vocaltag/images/icon_check.svg)";
    $(".check_icon")[0].style.opacity= 0.35;
    document.getElementById("button3").className = "button3";

    document.getElementById("micro_icon").className = "micro_icon2";
    document.getElementById("completeContainer").className = "completeContainer2";

    if(counter === 1){
      setTimeout(function () {
        isMicOn = false;
        counter = 0;
        isPlayButtonEnabled = true;
        document.getElementById('button2').style.pointerEvents = "auto";
        //document.getElementById("completeContainer").className = "completeContainer";
        document.getElementById("micro_icon").className = "micro_icon";
        document.getElementById("button2").className = "button21";

        $(".micro_Container")[0].style.backgroundColor = "rgba(20, 20, 20, 0.25)";
        $("#micro_icon")[0].style.opacity= 0.35;

        $(".play_icon")[0].style.backgroundImage="url(../vocaltag/images/icon_play2.svg)";
        $(".play_icon")[0].style.opacity= 1;

      }, 3000);

    }

  });
  let files = null;
  function handleFileSelect(e) {
    let FileSize = e.target.files[0].size/ 1024;
    if (FileSize > 600) {
            alert('File size exceeds the maximum');
    } else {
      console.log("files selected");
      soundUploaded = true;
      files = e.target.files;
      isPlayButtonEnabled = true;
      document.getElementById('button2').style.pointerEvents = "auto";
      document.getElementById("button2").className = "button21";
      $(".upload_icon")[0].style.backgroundImage="url(../vocaltag/images/icon_upload2.svg)";
      $(".micro_Container")[0].style.backgroundColor = "rgba(20, 20, 20, 0.25)";
      $("#micro_icon")[0].style.backgroundImage="url(../vocaltag/images/icon_micro2.svg)";
      $("#micro_icon")[0].style.opacity= 0.35;
      $(".play_icon")[0].style.backgroundImage="url(../vocaltag/images/icon_play2.svg)";
      $(".play_icon")[0].style.opacity= 1;
    }
  }
  if (document.getElementById("uploadFile") != null){
    document.getElementById("uploadFile").addEventListener('change', handleFileSelect, false);
  }


  $("#button2").click(function () {
    console.log(isPlayButtonEnabled);
    if(isPlayButtonEnabled){
        console.log("play button clicked");
        if(files != null){
          let audioPrev = document.getElementById('vocalTagPrev');
          let file = files[0];
          audioPrev.src = URL.createObjectURL(file)
          audioPrev.play();
          console.log(files[0]);
        }

        $(".play_icon")[0].style.opacity= 1;
        $("#button2")[0].style.backgroundColor = "rgba(106, 188, 59, 1)";
        $(".play_icon")[0].style.backgroundImage="url(../vocaltag/images/icon_play3.svg)";
        $(".check_icon")[0].style.backgroundImage="url(../vocaltag/images/icon_check.svg)";
        $(".check_icon")[0].style.opacity= 0.35;
        document.getElementById("button3").className = "button3";

        setTimeout(function () {
          isCheckButtonEnabled = true;
          document.getElementById('button3').style.pointerEvents = "auto";
          $(".submit_Container")[0].style.display = "block";
          document.getElementById("button3").className = "button31";
          $(".play_icon")[0].style.backgroundImage="url(../vocaltag/images/icon_play.svg)";
          $("#button2")[0].style.backgroundColor = "";
          $(".play_icon")[0].style.opacity= 0.35;
          $(".check_icon")[0].style.backgroundImage="url(../vocaltag/images/icon_check2.svg)";
          $(".check_icon")[0].style.opacity= 1;
        }, 3000);
    }
  });
  $("#button3").click(function () {
    if(isCheckButtonEnabled){
      $(".plus_button").click();
    }
  });

  $(".micro_Container").mouseover(function(){
    if(isMicOn){
      $(".micro_Container")[0].style.backgroundColor = "rgba(106, 188, 59, 1)";
      $("#micro_icon")[0].style.opacity= 1;
    }else{
      $(".micro_Container")[0].style.backgroundColor = "rgba(20, 20, 20, 0.5)";
    }
  });

  $(".micro_Container").mouseleave(function(){
    if(isMicOn){
      $(".micro_Container")[0].style.backgroundColor = "rgba(106, 188, 59, 1))";
    }else{
      $(".micro_Container")[0].style.backgroundColor = "rgba(20, 20, 20, 0.25)";
    }
  });

});

function onOpen(){
  document.getElementById("inner_grid").className = "nested_grid2";
  document.getElementById("main_grid").className = "grid_container2";
  document.getElementById("headerLeft").className = "headerLeft2";
  document.getElementById("headerRight").className = "headerRight2";
  document.getElementById("arch").className = "arch2";
  document.getElementById("plus_symbol").className = "plus_symbol2";

  $(".title")[0].style.display = "none";

  $(".header_instructions")[0].style.display = "block";
  $(".sound_wave_container")[0].style.display = "block";
  $("#completeContainer")[0].style.display = "block";
  $(".overlay_bg")[0].style.display = "block";
  $(".plus_button_area2")[0].style.display = "block";

  $(".micro_Container")[0].style.display = "grid";
  $(".upload_Container")[0].style.display = "grid";

  $(".play_icon")[0].style.display = "block";
  $(".check_icon")[0].style.display = "block";
}

function onClose(){
  isPlayButtonEnabled = false;
  isCheckButtonEnabled = false;
  isMicOn = false;
  counter = 0;
  document.getElementById('button2').style.pointerEvents = "none";
  document.getElementById('button3').style.pointerEvents = "none";

  document.getElementById("inner_grid").className = "nested_grid";
  document.getElementById("main_grid").className = "grid_container";
  document.getElementById("headerLeft").className = "headerLeft";
  document.getElementById("headerRight").className = "headerRight";
  document.getElementById("arch").className = "arch";
  document.getElementById("plus_symbol").className = "plus_symbol3";
  document.getElementById("completeContainer").className = "completeContainer";

  document.getElementById("button2").className = "button2";
  document.getElementById("button3").className = "button3";

  $(".submit_Container")[0].style.display = "none";
  $(".title")[0].style.display = "block";

  $(".header_instructions")[0].style.display = "none";
  $(".sound_wave_container")[0].style.display = "none";
  $("#completeContainer")[0].style.display = "none";
  $(".overlay_bg")[0].style.display = "none";
  $(".plus_button_area2")[0].style.display = "none";

  $(".micro_Container")[0].style.display = "none";
  $(".upload_Container")[0].style.display = "none";
  $(".play_icon")[0].style.display = "none";
  $(".check_icon")[0].style.display = "none";

  $(".micro_Container")[0].style.backgroundColor = "rgba(20, 20, 20, 0.25)";
  $("#micro_icon")[0].style.backgroundImage="url(../vocaltag/images/icon_micro.svg)";
  $("#micro_icon")[0].style.opacity= 1;
  $(".upload_icon")[0].style.backgroundImage="url(../vocaltag/images/icon_upload.svg)";
  $(".play_icon")[0].style.backgroundImage="url(../vocaltag/images/icon_play.svg)";
  $(".play_icon")[0].style.opacity= 0.35;

  $(".check_icon")[0].style.backgroundImage="url(../vocaltag/images/icon_check.svg)";
  $(".check_icon")[0].style.opacity= 0.35;
}
