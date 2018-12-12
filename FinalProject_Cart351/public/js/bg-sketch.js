let test;
let blobs;
let arrayLength = 0;
let soundList =[];
let sound;

function displayResponse(theResult){
  test = theResult;
  blobs = [test.length];
  arrayLength = test.length;
  for (let i = 0; i < test.length; ++i) {
    let circle = new Circle(test[i].sound, test[i].latitude, test[i].longitude);
    soundList.push(loadSound(test[i].sound));
    blobs[i] = circle;
  }

}
function displayResponse2(theResult){
  test = theResult;
  arrayLength = test.length;
  console.log(test[test.length-1].sound);
  let circle = new Circle(test[test.length-1].sound, test[test.length-1].latitude, test[test.length-1].longitude);
  soundList.push(loadSound(test[test.length-1].sound));
  blobs.push(circle);
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(15, 13, 109);
  //blobs = [test.length];
}
function draw(){
    //background(15, 13, 109);
  if(!isButtonClicked){
    for (let i = 0; i < arrayLength; ++i) {
      blobs[i].mouseHover(mouseX, mouseY, i);
    }
  }
}

function windowResized() {
  background(15, 13, 109);
	resizeCanvas(windowWidth, windowHeight);
  $.ajax({
      type: "GET",
      url: "viewResults.php",
      success: function (response) {
      let res = response.slice(0, -1);
      res = '['+res+']';
      let parsedJSON = JSON.parse(res);
      displayResponse(parsedJSON);
     },
     error:function(){
    console.log("error occurred");
  }
  });
}
//declaring an object called Walkers
let Circle = function(fN, xpos, ypos) {
    //declaring attributes
    this.x =  random(100,windowWidth-100);
    this.y =  random(100,windowHeight-100);
    this.size = 300;
    this.fileName = fN;
    stroke(76, 6, 111, 120);
    fill(111, 6, 111, 100);
    ellipse(this.x, this.y, this.size, this.size);

    Circle.prototype.mouseHover = function(px, py, index) {
      let d = dist(px, py, this.x, this.y);
      if(d < (this.size/2) && d > ((this.size/2)-15) ){
        soundList[index].playMode('restart');
        soundList[index].play();
        return true;
      }
      return false;
    };
};

//The following function was written by Meredith Dodge. Code found at: https://www.meredithdodge.com/2012/05/30/a-great-little-javascript-function-for-generating-random-gaussiannormalbell-curve-numbers
//The function returns a generated random number following a Gaussian distribution
Math.nrand = function() {
	var x1, x2, rad, y1;
	do {
		x1 = 2 * this.random() - 1;
		x2 = 2 * this.random() - 1;
		rad = x1 * x1 + x2 * x2;
	} while(rad >= 1 || rad == 0);
	var c = this.sqrt(-2 * Math.log(rad) / rad);
	return x1 * c;
};
