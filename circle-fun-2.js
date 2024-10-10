const canvasSketch = require('canvas-sketch');
const canvasMath = require("canvas-sketch-util/math");
const colorMap = require("colormap");


const width = 1024;
const height = 1024;
let increment = 10;
let rotationSpeedDivider = 5860; // Hardcoded as starting point OR constant point
// 7440,7280,7250,7190,6210,6050,5860,5830,2040,1510,1330,1270,1240,1080,1050,1030,890,860,800,730,690,620,560,530,370,340,180,150,90 // these values all share the same properties!

const settings = {
  dimensions: [ width, height ],
  animate: true,
  fps:50,
};

const sketch = ({ context, width, height }) => {

  const circleCount = 900;
  const mod = 50; // 50
  const widthSlice = width / circleCount;
  const circles = [];
  const points = [];

  for(let i = 0; i < circleCount;i++){
    let c = new Circle(widthSlice * i);
    circles.push(c);
    points.push(new Point(0,0,c))
  }

  // set rotation speed divider to mouse position
  // document.addEventListener("mousemove", (e)=>{
  //   rotationSpeedDivider = e.clientX * 10;
  //   console.log(rotationSpeedDivider);
  // })

  const colors = colorMap({
    colormap:'jet', // jet, cubehelix,viridis
    nshades:350,
  });

  document.addEventListener("mousedown", (e)=>{
    console.log(e);


    if(e.which == 1){
      rotationSpeedDivider+=increment;
    } 

    console.log(rotationSpeedDivider);

  })

  document.addEventListener("keypress", (e)=>{
    if(e.key == "z"){
      rotationSpeedDivider -= 10;
      console.log(rotationSpeedDivider);
    }
  })

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for(let i = 0; i < circles.length; i++){

      // let degree = frame + ( i * ( mod*Math.sin(frame/rotationSpeedDivider) ) ); // option 1. rotation is dependent on frame and rotation speed divider
      // let degree = frame + ( i * ( mod*Math.sin(rotationSpeedDivider) ) ); // option 2. rotation is dependent only on rotation speed divider
      let degree = (frame) + ( i * ( (mod + (0.3 * Math.sin(frame/100)))*Math.sin(rotationSpeedDivider) ) ); // option 3. Cool when mod value is hardcoded to an "interesting" value

      points[i].deg = canvasMath.degToRad(degree);
      points[i].draw(context);

      if(i < 1){
        continue;
      }

      context.save();
      context.translate(width/2,height/2);

      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(points[i-1].x, points[i-1].y); // Very cool if disabled
      context.lineTo(points[i].x, points[i].y); // Standard behavior
      // context.quadraticCurveTo(500*Math.sin(canvasMath.degToRad(frame*2)),0,points[i].x, points[i].y) // alternative to lineTo and moveTo

      // context.strokeStyle="black";
      // context.strokeStyle = colors[ // makeshift distance formula
      //   (Math.floor(Math.abs(points[i].y-points[i-1].y))  + Math.floor(Math.abs(points[i].x-points[i-1].x)))
      // ];
      // let dist = Math.sqrt(Math.pow(points[i].x-points[i-1].x,2)+Math.pow(points[i].y-points[i-1].y,2)); // not very interesting!
      // let dist = Math.sqrt(Math.pow(points[i].x-points[i-1].x,2)+Math.pow(points[i].y-points[i-1].y,1)); // cooler dist formula modification!
      // context.strokeStyle = colors[ // makeshift distance formula
      //   Math.floor(dist)
      // ];

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

  constructor(x,y,circle){
    this.x = x;
    this.y = y;
    this.circle = circle;
    this.deg = 0;
  }

  draw(context){

    this.x = (this.circle.diameter / 2) * Math.cos(this.deg);
    this.y = (this.circle.diameter / 2) * Math.sin(this.deg);

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