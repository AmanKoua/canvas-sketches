const canvasSketch = require('canvas-sketch');
const canvasMath = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const colorMap = require("colormap");

const colorList = ['jet', 'hsv', 'hot', 'cool', 'spring', 'summer', 'autumn', 'winter', 'bone', 'copper', 'greys', 'YIGnBu', 'greens', 'YIOrRd', 'bluered', 'RdBu', 'picnic', 'rainbow', 'portland', 'blackbody', 'earth', 'electric', 'viridis', 'inferno', 'magma', 'plasma', 'warm', 'cool', 'rainbow-soft', 'bathymetry', 'cdom', 'chlorophyll', 'density', 'freesurface-blue', 'freesurface-red', 'oxygen', 'par', 'phase', 'salinity', 'temperature', 'turbidity', 'velocity-blue', 'velocity-green', 'cubehelix'];
const favColors = ['cool', 'spring', 'autumn', 'winter', 'bone', 'copper', 'bluered', 'blackbody', 'electric', 'warm', 'rainbow-soft', 'cubehelix'];

let colorIdx = 0;
let isUsingFavs = false;

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  fps:35
};

const sketch = ({ context, width, height }) => {

  const circle = new Circle(0,0,width/2,0,Math.PI * 2);
  const segmentCount = 15;
  const pointPairs = [];
  const numShades = 150;

  // Colors array of length numShades
  let colors = colorMap({
    colormap:"warm", // favs ['cool', 'spring', 'autumn', 'winter', 'bone', 'copper', 'bluered', 'blackbody', 'electric', 'warm', 'rainbow-soft', 'cubehelix']
    nshades:numShades,
  });

  // Initialzie each 4 point segment. Random color, and gradient are initialized here
  for(let i = 0; i < segmentCount; i++){ 

    let temp = {
      p1: new Point(Math.random() * width, Math.random() * height, circle),
      p2: new Point(Math.random() * width, Math.random() * height, circle),
      p3: new Point(Math.random() * width, Math.random() * height, circle),
      p4: new Point(Math.random() * width, Math.random() * height, circle),
      color: colors[Math.floor(Math.random() * colors.length) % (numShades)],
      gradient:getRandomGradient(context,colors,15,width,height),
    };

    pointPairs.push(temp);

  }

  window.addEventListener("mousedown", (e) =>{

    // which field mapping = 1:left click, 3 right click:
  
    if(e.which == 1 && colorIdx != colorList.length -1){
      colorIdx++;
    } else if (e.which == 3 && colorIdx > 0){
      colorIdx--;
    } else {
      colorIdx = 0;
      isUsingFavs = !isUsingFavs;
    }

    if(isUsingFavs){
      console.log("---- Using favorite colors ! ----")
      console.log(favColors[colorIdx]);
      colors = colorMap({
        colormap:favColors[colorIdx],
        nshades:numShades,
      })
    } else{
      console.log("---- Not using favorite colors ! ----")
      console.log(colorList[colorIdx]);
      colors = colorMap({
        colormap:colorList[colorIdx],
        nshades:numShades,
      })
    }

    for(let i = 0; i < pointPairs.length; i++){
      pointPairs[i].gradient = getRandomGradient(context,colors,15,width,height)
    }
    
  })

  return ({ context, width, height }) => {

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    // Unused circle (for now). Initial idea was to have points bounce within the circle
    // context.save();
    // context.translate(width/2,height/2);
    // circle.draw(context);
    // context.restore();

    let p1;
    let p2;
    let p3;
    let p4;

    for(let i = 0; i < pointPairs.length; i++){

      p1 = pointPairs[i].p1;
      p2 = pointPairs[i].p2;
      p3 = pointPairs[i].p3;
      p4 = pointPairs[i].p4;

      // Update point positions
      p1.updatePosition();
      p2.updatePosition();
      p3.updatePosition();
      p4.updatePosition();

      // Draw points
      // p1.draw(context);
      // p2.draw(context);
      // p3.draw(context);
      // p4.draw(context);

      /*
        Draw curves / lines
      */
      context.save();
      context.beginPath();

      context.lineWidth = 10;
      context.strokeStyle = "black";
      // context.moveTo(p1.x, p1.y);
      // context.lineTo(p2.x, p2.y)
      // context.lineTo(p3.x, p3.y);
      // context.lineTo(p4.x, p4.y);
      // context.lineTo(p1.x, p1.y);

      context.quadraticCurveTo(p1.x,p1.y,p2.x,p2.y);
      context.quadraticCurveTo(p3.x,p3.y,p4.x,p4.y);
      context.quadraticCurveTo(p4.x,p4.y,p1.x,p1.y);

      // context.fillStyle=pointPairs[i].color;
      context.fillStyle=pointPairs[i].gradient;
      context.stroke();
      context.globalCompositeOperation = "exclusion"; // difference,"exclusion"
      context.fill()

      context.closePath();
      context.restore();

    }

  };
};

const getRandomGradient = (context,colors,stepCount,width,height) => {

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length) % (colors.length)];
  }

  const grad=context.createLinearGradient(0,0, width,height);

  for(let i = 0; i < stepCount; i++){
    grad.addColorStop(i/stepCount, getRandomColor());
  }

  return grad;
}

class Circle {

  constructor(x, y, radius, startAngle, endAngle){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
  }

  draw(context){

    context.save();

    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "black";
    context.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
    context.closePath();
    context.stroke();

    context.restore();

  }

}

class Point {

  constructor(x,y,circle){
    this.circle = circle;
    this.x = x;
    this.y = y;
    this.xSpeed = 1 +Math.random() * 10;
    this.ySpeed = 1 + Math.random() * 10;
    this.xPolarity = 1;
    this.yPolarity = 1;
  }

  draw(context){
    context.save();

    context.moveTo(this.x,this.y);
    context.beginPath();
    context.lineWidth = 3;
    context.arc(this.x,this.y,7,0,Math.PI * 2);
    context.fill();
    context.closePath();
    context.stroke();

    context.restore();
  }

  updatePosition(){
    this.x += this.xSpeed * this.xPolarity;
    this.y += this.ySpeed * this.yPolarity;

    if(this.x > this.circle.radius * 2 || this.x < 0){
      this.xPolarity *= -1;
    }

    if(this.y > this.circle.radius * 2 || this.y < 0){
      this.yPolarity *= -1;
    }
  }

}

canvasSketch(sketch, settings);