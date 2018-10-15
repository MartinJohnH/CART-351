
function ripple (x, y, r, g, b, k){
  let diameter = 0;
  let alphaValue = 0;
  if(k >= 20){
    k -= 20;
  }
  if(k >= 30){
    k -= 30;
  }

  let transitionCircles = Math.floor(Math.random()*(50-35+1)+35);
  let sizeDifference  = 50
  
  alphaValue = 20 + (k * 10);
  let counter = 0;

  requestAnimationFrame(runAni);
    function runAni(){
      if(counter >= 350){
        counter = 0;
        return;
      }
      noStroke();
      fill(r,g,b, alphaValue);

      ellipse(x, y, diameter, diameter);
      ellipse((x-transitionCircles), y, (diameter-sizeDifference), (diameter-sizeDifference));
      ellipse((x-transitionCircles), (y-transitionCircles), (diameter-(sizeDifference*2)), (diameter-(sizeDifference*2)));
      ellipse((x), (y-transitionCircles), (diameter-(sizeDifference*3)), (diameter-(sizeDifference*3)));
      ellipse((x), (y), (diameter-(sizeDifference*4)), (diameter-(sizeDifference*4)));

      diameter += 8;
      counter++;

    requestAnimationFrame(runAni);
  }
}
