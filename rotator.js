const canvasSketch = require('canvas-sketch');

const WIDTH = 1080;
const HEIGHT = 1080;
const CIRCLE_COUNT = 400;
const FRAME_DIVIDER = 5000;
let FRAME_OFFSET = 7880;
const CIRCLE_SLICE_WIDTH = (WIDTH / 2) / CIRCLE_COUNT;
const circles = [];

const settings = {
  dimensions: [WIDTH, HEIGHT],
  animate: true,
  fps: 60
};

window.onclick = () => {
  FRAME_OFFSET += 1000;
  console.log(FRAME_OFFSET)
}

class Circle {

  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.xDest = 0;
    this.yDest = 0;
    this.radius = radius;
    this.deg = 0;
  }

  draw(ctx) {

    ctx.beginPath();

    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.closePath();

  }

  updateDest(){
    this.xDest = ((Math.cos(this.deg)) * this.radius) + WIDTH / 2;
    this.yDest = ((Math.sin(this.deg)) * this.radius) + HEIGHT / 2;
  }

  drawLine(ctx) {
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, HEIGHT / 2);
    ctx.lineTo(this.xDest, this.yDest)
    ctx.stroke();
    ctx.closePath();
  }

}

const drawToPrevCircle = (ctx, c1, c2) => {

  ctx.beginPath();
  ctx.moveTo(c1.xDest, c1.yDest);
  ctx.lineTo(c2.xDest, c2.yDest)
  ctx.stroke();
  ctx.closePath();

}

const sketch = () => {


  for (let i = 0; i < CIRCLE_COUNT; i++) {
    circles.push(
      new Circle(WIDTH / 2, HEIGHT / 2, i * CIRCLE_SLICE_WIDTH)
    )
  }

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < CIRCLE_COUNT; i++) {
      // circles[i].draw(context)
      circles[i].deg = (FRAME_OFFSET + (70 * Math.sin(frame/100))) / (FRAME_DIVIDER / (i));
      circles[i].updateDest()
      // circles[i].drawLine(context)

      if (i > 0) {
        drawToPrevCircle(context, circles[i-1], circles[i])
      }

    }


  };
};

canvasSketch(sketch, settings);
