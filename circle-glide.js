const canvasSketch = require('canvas-sketch');

const WIDTH = 1080;
const HEIGHT = 1080;

const settings = {
  dimensions: [ WIDTH, HEIGHT ],
  animate: true,
  fps: 60
};

const CIRCLE_COUNT = 800;
const circles = [];
const points = [];
const frameOffset = 7000;

const sketch = () => {

  for(let i = 0; i < CIRCLE_COUNT; i++){

    const tempCircle = new Circle(WIDTH / 2, HEIGHT / 2, i / 1.6);
    const tempPoint = new Point(tempCircle);

    circles.push(
      tempCircle
    )

    points.push(tempPoint);
  }

  return ({ context, width, height, frame }) => {

   

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for(let i = 0; i < CIRCLE_COUNT; i++){
      // circles[i].draw(context);
      points[i].deg = i * (((frame / 10000) + frameOffset));
      // points[i].deg = i * (i * frame);
      points[i].draw(context, frame, i);
    }

    for(let i = 0; i < CIRCLE_COUNT - 2; i++){

      context.save();

      context.translate(WIDTH/2, HEIGHT / 2);

      context.beginPath();
      context.moveTo(points[i].x, points[i].y);
      context.lineTo(points[i+1].x,points[i+1].y);
      context.stroke();
      context.closePath();

      context.restore();

    }

  };
};


class Circle {
  constructor(x,y,radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  draw(ctx){

    ctx.save();

      ctx.beginPath();
      ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2);
      ctx.closePath();

      ctx.stroke();

    ctx.restore();

  }

}

class Point {
  constructor(circle){
    this.circle = circle;
    this.x = 0;
    this.y = 0;
    this.deg = 0;
  }

  draw(ctx, frame, idx){

    const coords = this.getCoords(frame, idx);
    this.x = coords[0];
    this.y = coords[1];

    ctx.save();

    ctx.beginPath();
    ctx.arc(coords[0] + WIDTH / 2,coords[1] + HEIGHT / 2,3,0,Math.PI * 2);
    ctx.fillStyle="black";
    ctx.fill();
    ctx.stroke();

    ctx.closePath();


  ctx.restore();
  }

  getCoords(frame , idx){

    const x = Math.cos(this.deg + Math.sin(frame / 40)) * this.circle.radius;
    const y = Math.sin(this.deg + (frame / idx) ) * this.circle.radius;

    return [x,y];
  }

}

canvasSketch(sketch, settings);
