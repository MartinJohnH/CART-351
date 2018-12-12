let audioBlob, audioUrl;
let audioR = null;
let fileNumber = 0;

//original code found here: https://github.com/mdn/web-dictaphone
//I modified the code to adapt it to my website

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {
    // First get ahold of the legacy getUserMedia, if present
    let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    // Some browsers just don't implement it - return a rejected promise with an error
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }
    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}

$(document).ready(function() {
  let audioPrev2;
  let canvas = document.getElementById('soundWaveCanvas');
  canvasCtx = canvas.getContext('2d');
  $(".plus_button").on('click', function () {
    if(isButtonClicked){
      // set up forked web audio context, for multiple browsers
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      voiceSelect = document.getElementById("voice");

      analyser = audioCtx.createAnalyser();
      analyser.minDecibels = -60;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.85;

      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      if (navigator.mediaDevices.getUserMedia) {
         console.log('getUserMedia supported.');
         let constraints = {audio: true}
         navigator.mediaDevices.getUserMedia (constraints)
            .then(
              function(stream) {
                 source = audioCtx.createMediaStreamSource(stream);
                 source.connect(analyser);
                 console.log(stream);

                 audioPrev2 = document.getElementById('vocalTagPrev');
                 audioPrev2.src = URL.createObjectURL(stream)
                 visualize();
            })
            .catch( function(err) { console.log('The following gUM error occured: ' + err);})
      } else {
         console.log('getUserMedia not supported on your browser!');
      }
    }
  });
  $(".micro_Container").on('click', function () {
    startRecording();
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      const audioChunks = [];
      mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", () => {
      stopRecording();
      audioBlob = new Blob(audioChunks, {type: 'audio/wav'});
      audioUrl = URL.createObjectURL(audioBlob);
      audioR = new Audio(audioUrl);
      console.log(audioBlob);
    });

    setTimeout(() => {
      mediaRecorder.stop();
    }, 3000);
  });
  });

  $("#button2").click(function () {
    if(audioR != null){
      audioR.play();
    }
  });

  function visualize() {
    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    analyser.fftSize = 1024;
    let bufferLength = analyser.fftSize;
    let dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    let draw = function() {

      drawVisual = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgba(43, 27, 105, 40)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.lineWidth = 1;
      canvasCtx.setLineDash([2, 2]);
      canvasCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      canvasCtx.beginPath();

      let sliceWidth;
      let mq = window.matchMedia( "(max-width: 475px)" );
      if (mq.matches) {
        sliceWidth = WIDTH * 2.0 / bufferLength
      }else{
        sliceWidth = WIDTH * 5.0 / bufferLength;
      }
      let x = 0;

      for(let i = 0; i < bufferLength; i++) {

        let v = dataArray[i] / 128.0;
        let y;
        mq = window.matchMedia( "(max-width: 475px)" );
        if (mq.matches) {
          y = v * HEIGHT/1.12;
        }
        else {
           y = v * HEIGHT/2;
        }
        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      canvasCtx.lineTo(WIDTH, HEIGHT/2);
      canvasCtx.stroke();
    };
    draw();
  }
});
