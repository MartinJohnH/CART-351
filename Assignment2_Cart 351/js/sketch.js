let soundList = [];
let alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "space"];
let speechRec;
let reverb, filter, cVerb;
let redArray = [15, 71, 85, 31, 48];
let greenArray = [45, 116, 141, 52, 78];
let blueArray = [39, 103, 147, 55, 99];

//this function is called before setup
function preload() {
  //laod all 27 sounds of the alphabet
  for (let i = 0; i < alphabet.length; ++i){
    soundList.push(loadSound(`sounds/${alphabet[i]}.mp3`));
  }
  //create a convolver node ... (sample)
  cVerb = createConvolver(`sounds/echo.mp3`);
}


function setup() {
  let title = document.getElementById('title');
  let instructions = document.getElementById('instructions');
  createCanvas(windowWidth, windowHeight);

   if (!('webkitSpeechRecognition' in window)) {
    instructions.innerHTML = "Type into the computer";
    let keyboardInput = "";

    document.onkeypress = function (e) {
      if (keyCode !== 13){
        keyboardInput = keyboardInput + e.key;
      }
      else{
        characterToSound(keyboardInput + "$");
        keyboardInput = "";
      }
    }
  }else{
    instructions.innerHTML = "Speak into the computer";
    //speech recognition using the p5.speech.js library
    let language = navigator.language || 'en-US';
    speechRec = new p5.SpeechRec(language);
    speechRec.onResult = inputResult;
    speechRec.onEnd = stoppedRecording;
    let continuous = true;
    let interimResults = false;
    speechRec.start(continuous, interimResults);
    //words from the user input
    function inputResult() {
      if(speechRec.resultValue) {
        //userInput contains all the words a user says and adds a '$' at the end to signify the end of the input
        let voiceInput = speechRec.resultString + '$';
        characterToSound(voiceInput);
      }
    }
    //continues listening after recoder stopped
    function stoppedRecording(){
      speechRec.start(continuous, interimResults);
    }
  }
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

let xPosition = Math.floor((Math.random() * window.innerWidth) + 1);
let yPosition = Math.floor((Math.random() * window.innerHeight) + 1);
let size = 30;
let red = 15;
let green = 45;
let blue = 39;

function characterToSound(userInput){
  //document.body.style.backgroundColor = "#030502";
  instructions.style.opacity = 0;
  title.style.opacity = 0;
  setTimeout(() => instructions.innerHTML="", title.innerHTML="" , 1500);
  //k is the index of how many characters in the userInput String
  let k = 0;
  //loop throught the userInput and play one note/letter
  function myLoop() {
    setTimeout(function() {
      let character = userInput.charAt(k).toLowerCase();
      //console.log('play sound: ' + character);
      newRipplePos = false;
      //switch statment decides which sound should be played
      switch (character) {
        case 'a':
          playNewSound(0);
          break;
        case 'b':
          playNewSound(1);
          break;
        case 'c':
          playNewSound(2);
          break;
        case 'd':
          playNewSound(3);
          break;
        case 'e':
          playNewSound(4);
          break;
        case 'f':
          playNewSound(5);
          break;
        case 'g':
          playNewSound(6);
          break;
        case 'h':
          playNewSound(7);
          break;
        case 'i':
          playNewSound(8);
          break;
        case 'j':
          playNewSound(9);
          break;
        case 'k':
          playNewSound(10);
          break;
        case 'l':
          playNewSound(11);
          break;
        case 'm':
          playNewSound(12);
          break;
        case 'n':
          playNewSound(13);
          break;
        case 'o':
          playNewSound(14);
          break;
        case 'p':
          playNewSound(15);
          break;
        case 'q':
          playNewSound(16);
          break;
        case 'r':
          playNewSound(17);
          break;
        case 's':
          playNewSound(18);
          break;
        case 't':
          playNewSound(19);
          break;
        case 'u':
          playNewSound(20);
          break;
        case 'v':
          playNewSound(21);
          break;
        case 'w':
          playNewSound(22);
          break;
        case 'x':
          playNewSound(23);
          break;
        case 'y':
          playNewSound(24);
          break;
        case 'z':
          playNewSound(25);
          break;
        case ' ':
          playNewSound(26);
          newRipplePos = true;
          break;
        //'$' represents the end of the user input
        case '$':
          playNewSound(27);
          newRipplePos = true;
          break;
        //the default will be called for non alphabetic characters
        default:
          playNewSound(26);
      }
      if(character !== ' ' && character !== '$' ){
        let newRipple = new ripple(xPosition, yPosition, red, green, blue, k);
      }else{

        let pickRandomColour = Math.floor(Math.random()*((redArray.length-1)-0+1)+0);
        red = redArray[pickRandomColour];
        green = greenArray[pickRandomColour];
        blue = blueArray[pickRandomColour];

        let tempXPos = (Math.floor(Math.random() * 800) - 400);
        let tempYPos = (Math.floor(Math.random() * 800) - 400);

        if(tempXPos <= 150 && tempXPos >= 0){
          tempXPos += 200;
        }else if(tempXPos >= -150 && tempXPos <= 0){
          tempXPos -= 200;
        }

        if(tempYPos <= 150 && tempYPos >= 0){
          tempYPos += 200;
        }else if(tempYPos >= -150 && tempYPos <= 0){
          tempYPos -= 200;
        }

        if((xPosition + tempXPos) >= window.innerWidth || (xPosition + tempXPos) < 0){
          tempXPos = tempXPos * -1;
        }

        if((yPosition + tempYPos) >= window.innerHeight || (yPosition + tempYPos) < 0){
          tempYPos = tempYPos * -1;
        }

        xPosition += tempXPos;
        yPosition += tempYPos;
      }
      
      if(red <= 200 && green <=200 && blue <=200){
        red += 20;
        green += 20;
        blue += 20;
      }
      //when the number of characters of an input becomes longer than a multiple of 7 characters
      if (k % 5 === 0 && k !== 0) {
        for (let i = 0; i < alphabet.length; ++i) {
          soundList[i].amp(0.2); //reduce the volume of the looping sounds
        }
      }
      if (k % 7 === 0 && k !== 0) {
        for (let i = 0; i < alphabet.length; ++i) {
          soundList[i].amp(0); //reduce the volume of the looping sounds
        }
      }
      k++;
      if (k < userInput.length) {
        myLoop();
      }
    } ,1500) // <- this value controls how many seconds dealy is inbetween each sound in ms
  }
  myLoop();
}

// boolean that controls which speaker the sound comes out (left or right)
let togglePan = false;
function playNewSound(index) {
  //the sound is a space or non alphabetic character
  if (index === 26) {
    for (let i = 0; i < alphabet.length; ++i) {
      soundList[i].amp(0.1);
    }
  }
  //'$' represents the end of the user input
  if (index === 27) {
    for (let i = 0; i < alphabet.length; ++i) {
      soundList[i].amp(0);
      soundList[i].disconnect();
    }
    return;
  }
  filter = new p5.LowPass();
  soundList[index].disconnect();
  soundList[index].connect(filter);
  //process the sound through convolution
  cVerb.process(filter);

  //play mode is set to 'sustain' to allow sounds to overlap
  soundList[index].playMode('sustain');
  //determines which sounds are associated with vowels
  if (index === 0 || index === 4 || index === 8 || index === 14 || index === 20 || index === 24) {
    //determines if the sound plays to the right ear or the left one
    togglePan = !togglePan;
    if (togglePan) {
      soundList[index].pan(-0.75);
    }else{
      soundList[index].pan(0.75);
    }
    soundList[index].amp(0.75);
    soundList[index].loop();
  //determines which sounds are associated with consonants
  }else{
    soundList[index].pan(0);
    soundList[index].amp(1);
    soundList[index].play();
  }
}
