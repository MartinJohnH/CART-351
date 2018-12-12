let audioBlob2;
//tutorial and code found here: https://addpipe.com/blog/using-recorder-js-to-capture-wav-audio-in-your-html5-web-site/ 
//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

let gumStream; //stream from getUserMedia()
let rec; //Recorder.js object
let input; //MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb.
let AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext = new AudioContext; //new audio context to help us record

function startRecording() {
    console.log("recordButton clicked");
    let constraints = { audio: true, video:false };

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
        /* assign to gumStream for later use */
        gumStream = stream;
        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);
        /*
        Create the Recorder object and configure to record mono sound (1 channel)
        Recording 2 channels  will double the file size
        */
        rec = new Recorder(input,{numChannels:1})
        //start the recording process
        rec.record()
        console.log("Recording started");

    }).catch(function(err) {
        console.log("Recording error");
    });
}

function stopRecording() {
    console.log("stopButton clicked");
    //tell the recorder to stop the recording
    rec.stop();
    //stop microphone access
    gumStream.getAudioTracks()[0].stop();
    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink);
}
function createDownloadLink(blob) {
    var url = URL.createObjectURL(blob);
    audioBlob2 = blob;
    console.log("Audio Recorded");
}
