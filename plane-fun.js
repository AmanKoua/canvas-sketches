const canvasSketch = require('canvas-sketch');
const canvasMath = require("canvas-sketch-util/math");
const colorMap = require("colormap");


let isLocked = false;
let centerZ = 0;
let centerY = 0;
let centerX = 0;
let rotationXPrev = 0;
let rotationYPrev = 0;
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
  const widthSlice = (width/1.4) / circleCount;
  const circles = [];
  const points = [];

  for(let i = 0; i < circleCount;i++){
    let c = new Circle(widthSlice * i);
    circles.push(c);
    points.push(new Point(0,0,0,c)) // Z harcoded to const atm
  }

  // set rotation speed divider to mouse position
  // document.addEventListener("mousemove", (e)=>{
  //   rotationSpeedDivider = e.clientX * 10;
  //   console.log(rotationSpeedDivider);
  // })

  // Set centerZ to mouse position
  // document.addEventListener("mousemove", (e)=>{
  //   centerY = e.clientX;
  //   console.log(centerY);
  // })

  const colors = colorMap({
    colormap:'jet', // jet, cubehelix,viridis
    nshades:350,
  });

  document.addEventListener("mousedown", (e)=>{

    isLocked = !isLocked;

    // if(e.which == 1){
    //   rotationSpeedDivider+=increment;
    // } 

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

      // Frame + 2000 to skip the boring intro
      // option 1. rotation is dependent on frame and rotation speed divider
      let degree = frame + ( i * ( mod*Math.sin((frame+2000)/rotationSpeedDivider) ) );

      //  option 2. rotation is dependent only on rotation speed divider
      // let degree = frame + ( i * ( mod*Math.sin(rotationSpeedDivider) ) );

      // option 3. Cool when mod value is hardcoded to an "interesting" value
      // let degree = (frame) + ( i * ( (mod + (0.3 * Math.sin(frame/100)))*Math.sin(rotationSpeedDivider) ) );

      points[i].deg = canvasMath.degToRad(degree);

      if(!isLocked){
        points[i].updatePosition();
      } else {

        // points[i].updatePosition();

        points[i].rotateX(
          canvasMath.degToRad(3 + rotationXPrev),
          centerY, 
          centerZ
          );


        // rotationXPrev += 2;

        points[i].rotateY(
          canvasMath.degToRad(1.4 + rotationYPrev),
          centerX, 
          centerZ
        );

        // rotationYPrev += 1.4;

      }

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
      // context.quadraticCurveTo(0,0,points[i].x, points[i].y) // alternative to lineTo and moveTo

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

  updatePosition(){
    // Moves the x and y axes around in a spiraling circle
    // This maps onto the 2d plane only, and ignores any 3d rotation
    this.x = (this.circle.diameter / 2) * Math.cos(this.deg);
    this.y = (this.circle.diameter / 2) * Math.sin(this.deg);
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