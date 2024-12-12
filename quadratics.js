const canvasSketch = require('canvas-sketch');
const colorMap = require('colormap');

const WIDTH = 1080;
const HEIGHT = 1080;

const settings = {
  dimensions: [WIDTH, HEIGHT],
  animate: true,
  fps:60
};

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
})

let mouseX = 0;
let mouseY = 0;
const COLS = 30;

// Colors array of length numShades
let colors = colorMap({
  colormap:"rainbow-soft", // favs ['cool', 'spring', 'autumn', 'winter', 'bone', 'copper', 'bluered', 'blackbody', 'electric', 'warm', 'rainbow-soft', 'cubehelix']
  nshades:COLS,
});

const sketch = () => {

  const WIDTH_SLICE = WIDTH / COLS;

  const controlPoint = new Point();
  const lines = [];
  const lines2 = [];

  for(let i = 0; i < COLS; i++){
    lines.push(new Line(new Point(), new Point()))
  }

  for(let i = 0; i < COLS; i++){
    lines2.push(new Line(new Point(), new Point()))
  }

  return ({ context, width, height, frame }) => {
    
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    controlPoint.x = ((WIDTH * Math.sin(frame/20)) + WIDTH / 2) + mouseX * 2;
    controlPoint.y = mouseY * 5;

    // controlPoint.x += mouseX * 1;
    // controlPoint.y += mouseY * 1;

    /*

      V3 - Newest and coolest (arguably lol)

    */
    for(let i = 0; i < COLS; i++){

      const line = lines[i];
      const pointA = lines[i].pointA;
      const pointB = lines[i].pointB;

      const modX = (40 * i) * Math.cos(frame/20);
      const modY = (60 * i) * Math.sin(frame/20);
      const altModY = (50 * i ) * Math.sin(frame/40);

      pointA.x = (i * WIDTH_SLICE) + WIDTH_SLICE / 2;
      pointA.x += modX;

      pointA.y =  (HEIGHT /8);
      pointA.y += modY;

      pointB.x = (i * WIDTH_SLICE) + WIDTH_SLICE / 2;
      pointB.x += modY;

      pointB.y =  HEIGHT - (HEIGHT /8);
      pointB.y -= altModY;

      context.save();

      context.translate(200,200);
      context.scale(.4,.4);

      context.beginPath();
      context.moveTo(pointA.x, pointA.y);
      context.quadraticCurveTo(controlPoint.x, controlPoint.y,pointB.x, pointB.y);
      context.closePath();

      // context.globalCompositeOperation ="xor"; // xor
      context.globalAlpha = .2;
      context.fillStyle = colors[i];
      context.lineWidth= 5;
      context.strokeStyle = "black";

      context.fill();
      context.stroke();

      context.restore();

    }

    /*
      V2 - The same, but kinda different. Still cool
    */

    // for(let i = 0; i < COLS; i++){

    //   const pointA = lines2[i].pointA;
    //   const pointB = lines2[i].pointB;


    //   // const modX = (40 * i) * Math.cos(frame/20);
    //   const modX = Math.pow((40 * i), Math.cos(frame/20));

    //   const modY = (60 * i) * Math.sin(frame/20);
    //   const altModY = (50 * i ) * Math.sin(frame/40);

    //   pointA.x = (i * WIDTH_SLICE) + WIDTH_SLICE / 2;
    //   pointA.x += modX;
    //   pointA.x += 500; 

    //   pointA.y =  (HEIGHT /8);
    //   pointA.y += modY;
    //   pointA.y += 500; 

    //   pointB.x = (i * WIDTH_SLICE) + WIDTH_SLICE / 2;
    //   pointB.x += modY;

    //   pointB.y =  HEIGHT - (HEIGHT /8);
    //   pointB.y -= altModY;

    //   context.save();

    //   context.translate(200,200);
    //   context.scale(.4,.4);

    //   context.beginPath();
    //   context.moveTo(pointA.x, pointA.y);
    //   context.quadraticCurveTo(controlPoint.x, controlPoint.y,pointB.x, pointB.y);
    //   context.closePath();

    //   // context.globalCompositeOperation ="xor"; // xor
    //   context.globalAlpha = .2;
    //   context.fillStyle = colors[i];
    //   context.lineWidth= 5;
    //   context.strokeStyle = "black";

    //   context.fill();
    //   context.stroke();

    //   context.restore();

    // }

    /*
      ORIGINAL IDEA. KINDA COOL
    */

    // for(let i = 0; i < COLS; i++) {

    //   let startX = i * (WIDTH / COLS) * Math.cos(frame/20);
    //   let startY = 300 * (i / 3) * Math.sin(frame/20);
    //   let destX = i * (WIDTH / COLS) * Math.sin(frame/30) + 500;
    //   let destY =  HEIGHT - 50 * (i/1) * Math.cos(frame/20);

    //   context.save();

    //   context.translate(400,200);
    //   context.scale(.4,.4);

    //   context.beginPath();
    //   context.moveTo(startX,startY);
    //   context.quadraticCurveTo(controlPoint.x, controlPoint.y,destX,destY);
    //   context.closePath();

    //   // context.globalCompositeOperation ="xor"; // xor
    //   context.globalAlpha = 1;
    //   context.fillStyle = colors[i];
    //   context.lineWidth= 5;
    //   context.strokeStyle = "black";

    //   context.fill();
    //   context.stroke();

    //   context.restore();

    // }

  };
};

class Point {

  constructor(){
    this.x = 0;
    this.y = 0;
  }

}

class Line {

  constructor(pointA, pointB){
    this.pointA = pointA;
    this.pointB = pointB;
  }

}

canvasSketch(sketch, settings);
