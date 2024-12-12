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
const COLS = 20;

// Colors array of length numShades
let colors = colorMap({
  colormap:"cubehelix", // favs ['cool', 'spring', 'autumn', 'winter', 'bone', 'copper', 'bluered', 'blackbody', 'electric', 'warm', 'rainbow-soft', 'cubehelix']
  nshades:COLS,
});

const sketch = () => {

  const controlPoint = new Point();

  return ({ context, width, height, frame }) => {
    
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    controlPoint.y = HEIGHT / 2;
    controlPoint.x = (WIDTH * Math.sin(frame/20)) + WIDTH / 2;

    for(let i = 0; i < COLS; i++) {

      let startX = i * (WIDTH / COLS) * Math.cos(frame/20);
      let startY = 300 * (i / 3) * Math.sin(frame/20);
      let destX = i * (WIDTH / COLS) * Math.sin(frame/30) + 500;
      let destY =  HEIGHT - 50 * (i/1) * Math.cos(frame/20);

      context.save();

      context.translate(400,200);
      context.scale(.4,.4);

      context.beginPath();
      context.moveTo(startX,startY);
      context.quadraticCurveTo(controlPoint.x, controlPoint.y,destX,destY);
      context.closePath();

      // context.globalCompositeOperation ="xor"; // xor
      context.globalAlpha = 1;
      context.fillStyle = colors[i];
      context.lineWidth= 5;
      context.strokeStyle = "black";

      context.fill();
      context.stroke();

      context.restore();

    }

  };
};

class Point {

  constructor(){
    this.x = 0;
    this.y = 0;
  }

}

canvasSketch(sketch, settings);
