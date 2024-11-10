const canvasSketch = require('canvas-sketch');
const canvasMath = require("canvas-sketch-util/math");
const colorMap = require("colormap");

const width = 1080;
const height = width;

const settings = {
  dimensions: [ width, height ],
  animate:true,
  fps:60
};

const sketch = () => {

  const frameOffset = 66666666666 ; // 500000, 77777777, 66666666666, 111111111, 22222, 987654321, 2718281828459
  const numShades = 300;
  const circleCount = 1090;
  const circles = [];
  const points = [];
  const sliceWidth = (width / circleCount) + 400000;

  const colors = colorMap({
    // colormap:'jet', // jet, cubehelix,viridis
    nshades:numShades,
  });

  for(let i = 0; i < circleCount; i++){
    let tempCircle = new Circle(sliceWidth / (i));
    circles.push(tempCircle)
    points.push(new Point(tempCircle))
  }

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for(let i = 0; i < circles.length; i++){

      // circles[i].draw(context);

      points[i].deg = canvasMath.degToRad((frame) - (i*(4000*Math.sin((frame + frameOffset)/1000000)))); // 1000000
      points[i].updatePosition()
      points[i].draw(context);

      if(i == 0) {
        continue
      }

      drawLineBetweenPoints(context, colors[(i-(Math.floor(Math.sin(canvasMath.degToRad(frame)) * 950))) % numShades + (numShades/15)], points[i-1], points[i])

    }


  };
};

class Circle {

  constructor(diameter){
    this.diameter = diameter;
    this.deg = 0;
    this.x = 0;
    this.y = 0;
  }

  draw(context){

    context.save();
    context.translate(width/2,height/2);
    context.beginPath();

    context.arc(
      this.x,
      this.y,
      this.diameter/2,
      0,
      Math.PI * 2
    );
    context.strokeStyle="black";
    // context.fillStyle="black";
    // context.fill();
    context.closePath();
    context.stroke();
    context.restore();

  }

}

class Point {

  constructor (circle) {
    this.x = 0;
    this.y = 0;
    this.deg = 0;
    this.circle = circle
  }

  updatePosition(){
    this.x = (this.circle.diameter/2) * Math.cos(this.deg);
    this.y = (this.circle.diameter/2) * Math.sin(this.deg);
  }

  draw(context){

    context.save();
    context.translate(width/2,height/2);
    context.beginPath();

    context.moveTo(this.x,this.y)
    context.strokeStyle="black";
    context.fillStyle="black";
    context.arc(
      this.x,
      this.y,
      3,
      0,
      Math.PI * 2
    )
    context.fill();

    context.closePath();
    context.restore();

  }
}

const drawLineBetweenPoints = (context, color, pointA, pointB) => {

    context.save();
    context.translate(width/2,height/2);
    context.beginPath();

    context.strokeStyle="black";
    context.lineWidth = 3;
    context.moveTo(
      pointA.x,
      pointA.y
    );
    context.lineTo(pointB.x, pointB.y)
    context.strokeStyle = color;
    context.stroke();

    context.closePath();
    context.restore();

}

canvasSketch(sketch, settings);
