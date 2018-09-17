let canvas;
let walkersOrigin;
let walkersArray = [200];
let numberOfWalkers = 200;
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(240);
  //declaring new walkers and placing them into an array (walkersArray)
  for(let i = 0; i < numberOfWalkers; ++i){
   walkersOrigin = new Walkers();
   walkersArray[i] = walkersOrigin;
  }
}
function draw() {
  for(let i = 0; i < numberOfWalkers; ++i){
    walkersArray[i].show();
    walkersArray[i].step();
  }
}
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
//declaring an object called  Walkers
let Walkers = function() {
    //declaring attributes
    this.grayValue = Math.random() * (240 - 215) + 215;
    this.redValue = this.grayValue, this.greenValue = this.grayValue, this.blueValue = this.grayValue, this.alphaValue = 200;
    this.num1 = Math.nrand(), this.num2 = Math.nrand();
    this.standardDeviation = 333;
    this.mean = windowWidth / 2;
    this.x = this.standardDeviation * this.num1 + this.mean;
    this.y = this.standardDeviation * this.num2 + this.mean;
    //sets the colour value of the Walkers
    this.setColour = function(red, green, blue, alpha) {
      this.redValue = red;
      this.greenValue = green;
      this.blueValue = blue;
      this.alphaValue = alpha;
    };
    //declaring a random number between 1 and 15
    //modifying the value of 15, changes the probability of different colour Walkers being generated
    this.randomValue = Math.random() * (12 - 1) + 1;
    //the colour of the Walker depends on random number: (gray, red, orange)
    if(Math.round(this.randomValue) === 1 ){
      this.setColour(240, 240, 240, 222);
    }else if(Math.round(this.randomValue) === 2){
      this.setColour(240, 150, 175, 100);
    }else if(Math.round(this.randomValue) === 3){
      this.setColour(254, 197, 126, 75);
    }
    //declaring the show function that will decide the look of a Walker, colour, size and positon
    Walkers.prototype.show = function() {
      noStroke();
      fill(this.redValue, this.greenValue, this.blueValue, this.alphaValue);
      let size = Math.nrand() * random(2,5);
      ellipse(this.x, this.y, size, size);
    };
    //declaring the step function that will decide in which direction the Walker will take
    Walkers.prototype.step = function() {
      this.x += Math.nrand() * random(2,5);
      this.y += Math.nrand() * random(2,5);
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
