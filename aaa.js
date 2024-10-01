const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080,1080 ],
  animate:true,
  fps:100,
};

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
})

let mouseX = 0;
let mouseY = 0;

const sketch = ({ context, width, height }) => {

  let count = 30;
  let segWidth = width / count;
  let segHeight = height / count;
  let pairs = [];

  let mod = height * 2;

  for (let i = 0; i < count; i++){
    let p1 = new Point(segWidth * i, 0);
    let p2 = new Point(0, segHeight * i);
    pairs.push({
      p1,
      p2
    })
  }

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    let xDest;
    let yDest;

    for(let i = 0; i < pairs.length; i++){
      
      pairs[i].p1.draw(context);
      pairs[i].p2.draw(context);  

      xDest = -Math.abs(Math.cos(math.degToRad(frame))*width) + width;
      yDest = -Math.abs(Math.sin(math.degToRad(frame))*height) + height;

      // visualize x and y dest
      context.moveTo(xDest,yDest);
      context.arc(xDest,yDest,10,0,Math.PI * 2);
      context.stroke();
      
      context.save();

      context.beginPath();
      context.moveTo(pairs[i].p1.x,pairs[i].p1.y);
      // context.lineTo(pairs[i].p2.x,pairs[i].p2.y);
      context.quadraticCurveTo(xDest,yDest,pairs[i].p2.x,pairs[i].p2.y);
      context.globalCompositeOperation ="source-over"; // xor
      context.fillStyle="black";
      // context.fill();
      context.stroke();
      context.closePath();

      context.restore();

    }

  };
};

class Point {

  constructor(x,y){
    this.x = x;
    this.y = y;
  }

  draw(context){
    context.save();

    context.moveTo(this.x,this.y);
    context.beginPath();
    context.lineWidth = 5;
    context.fillStyle="black";
    context.arc(this.x,this.y,5,0,Math.PI * 2);
    context.fill();
    context.closePath();
    context.stroke();

    context.restore();
  }

}

canvasSketch(sketch, settings);
