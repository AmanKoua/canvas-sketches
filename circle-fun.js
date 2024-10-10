const canvasSketch = require('canvas-sketch');
const canvasMath = require('canvas-sketch-util/math');

const cWidth = 1080;
const cHeight = 1080;

const settings = {
  dimensions: [cWidth, cHeight],
  animate:true,
  fps:60,
};

const sketch = ({width, height }) => {

  let currentDist = 0;
  let circleCount = 1;
  const circleDiameter = width / 9; // 9 seems to be the sweet spot. 10's ok, but it's a bit slow
  const circles = [];
  let degree = 0;

  circles.push(new Circle(circleDiameter,0));
  currentDist = circleDiameter/4; // not exactly sure why it works with diameter / 4 ???

  while(currentDist < (height/2)) {
      circleCount++;
      let prevDiamSum = 0;

      for(let i = 0; i < circles.length; i++){ // refactor this to improve startup efficiency
        prevDiamSum += circles[i].diameter;
      }

      circles.push(new Circle(circleDiameter/circleCount, currentDist*2 + (circleDiameter/circleCount)/2))
      currentDist += (circleDiameter/circleCount)/2;
  }

  return ({ context, width, heigh, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    degree = canvasMath.degToRad(frame);

    for(let i = 0; i < circles.length; i++){
      // circles[i].deg = degree; // basic testing
      // circles[i].deg = degree + (i / (1 * Math.sin(frame/1000))); // very cool (but too fast)!
      circles[i].deg = degree + ((i*Math.sin(frame/800))); // my favorite!
      circles[i].draw(context);

      if(i < 1){
        continue;
      }

      // Draw the lines between the points
      context.save();

      context.beginPath();
      context.moveTo(circles[i-1].x,circles[i-1].y);
      context.lineTo(circles[i].x, circles[i].y);
      context.stroke();
      context.closePath();

      context.restore();

    }

  };
};

class Circle {

  constructor(diameter,parentRadius){
    this.diameter = diameter;
    this.parentRadius = parentRadius;
    this.deg = 0;
    this.x = 0;
    this.y = 0;
  }

  draw(context){

    context.save();
    context.moveTo(cWidth/2,cHeight/2);
    context.beginPath();

    this.x = cWidth / 2 + (this.parentRadius * Math.cos(this.deg));
    this.y = cHeight / 2 + (this.parentRadius * Math.sin(this.deg));

    context.arc(
      this.x,
      this.y,
      this.diameter/2,
      0,
      Math.PI * 2
    );
    context.fillStyle="black";
    context.fill();
    context.closePath();
    context.stroke();
    context.restore();

  }

}

canvasSketch(sketch, settings);
