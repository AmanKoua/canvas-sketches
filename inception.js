const canvasSketch = require('canvas-sketch');
const canvasMath = require("canvas-sketch-util/math");

const width = 1080;
const height = 1080;

const settings = {
  dimensions: [ width, height ],
  animate: true,
  fps: 60,
};

const sketch = () => {

  const numPoints = 70;
  const points = [];
  const circle = new Circle(width);

  for(let i = 0 ; i < numPoints; i++){
    points.push(new Point(0,0,0,circle));
  }

  return ({ context, frame }) => {

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for(let i = 0; i < numPoints; i++){
      points[i].x = Math.cos(canvasMath.degToRad(frame * (i / 100))) * points[i].circle.diameter / 2 ;
      points[i].y = Math.sin(canvasMath.degToRad(frame * (2 - (i / 100)))) * points[i].circle.diameter / 2;
      points[i].draw(context);

      if(i == 0){
        continue;
      }

      context.save();

      context.translate(width/2,height/2);
      context.beginPath();
      context.moveTo(points[i-1].x, points[i-1].y);
      context.lineTo(points[i].x, points[i].y);
      context.stroke();
      context.closePath();

      context.restore();


    }

  };
};

class Circle {

  constructor(diameter){
    this.diameter = diameter;
    this.x = 0;
    this.y = 0;
  }

  draw(context){
    context.save();
    context.translate(width/2,height/2);
    context.moveTo(this.x,this.y);
    context.beginPath();
    
    context.lineWidth = 1;
    context.arc(this.x,this.y,this.diameter/2,0,Math.PI*2);
    context.stroke();

    context.closePath();
    context.stroke();
    context.restore();
  }

}

class Point {

  constructor(x,y,z,circle){
    this.x = x;
    this.y = y;
    this.z = z;
    this.x3 = 0;
    this.y3 = 0;
    this.z3 = 0;
    this.circle = circle;
    this.deg = 0;
  }

  rotateX(degree,centerY,centerZ){
    let dy = this.y - centerY;
    let dz = this.z - centerZ;
    let y = dy * Math.cos(degree) - dz * Math.sin(degree);
    let z = dy * Math.sin(degree) + dz * Math.cos(degree);
    this.y = y + centerY;
    this.z = z + centerZ;
  }

  rotateZ(degree,centerX,centerY){
    let dx = this.x - centerX; // dist from center X
    let dy = this.y - centerY; // dist from center Y
    let x = dx * Math.cos(degree) - dy * Math.tan(degree);
    let y = dx * Math.sin(degree) + dy * Math.cos(degree);
    this.x = x + centerX; // The circle is rotated about the center of the canvas
    this.y = y + centerY;
  }

  rotateY(degree,centerX,centerZ){
    let dx = this.x - centerX;
    let dz = this.z - centerZ;
    let x = dz * Math.sin(degree) + dx * Math.cos(degree);
    let z = dz * Math.cos(degree) - dx * Math.sin(degree);
    this.x = x + centerX;
    this.z = z + centerZ;
  }

  draw(context){
    context.save();
    context.translate(width/2,height/2);
    context.moveTo(this.circle.x,this.circle.y);
    context.beginPath();

    context.lineWidth = 4;
    context.arc(this.x,this.y,1,0,Math.PI*2);
    context.stroke();

    context.closePath();
    context.stroke();
    context.restore();
  }

}

canvasSketch(sketch, settings);
