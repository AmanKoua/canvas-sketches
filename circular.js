const canvasSketch = require('canvas-sketch');
const canvasMath = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const colorMap = require("colormap");

const settings = {
  dimensions: [ 800, 800 ],
  animate:true,
  fps:150,
};

const sketch = ({ context, width, height }) => {

  const rows = 50;
  const cols = 50;
  const mod = 50;
  const cw =  width/rows;
  const ch =  height/cols;
  const circles = []; // 2d array of circles
  let mainCircle;
  const points = []; // 2d array of points
  let mouseX;
  let mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY; 
  })

  const colors = colorMap({
    colormap:'jet', // jet, cubehelix,viridis
    nshades:150,
  });

  for(let row = 0; row < rows; row++){

    circles.push([]);
    points.push([]);

    for(let col = 0; col < cols; col++){
      const randColor = colors[Math.floor(Math.random() * colors.length)];
      // const randColor = colors[row +col];
      circles[row].push(new Circle((cw*2) * row, (ch*2) * col, cw, 0, Math.PI * 2));
      points[row].push(new Point(circles[row][col], randColor));
    }
 
  }

  mainCircle = new Circle(width/2,height/2,width/4,0,Math.PI * 2,20,width,height);

  return async ({ context, width, height, frame }) => {

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    /*
      Draw main circle
    */
    // context.save();
    context.beginPath();
    context.globalCompositeOperation ="burn"; // xor
    mainCircle.lmaoDraw(context);
    // // oscillate circle back and forth
    // mainCircle.x = (width / 2) + Math.cos(math.radToDeg(frame / 1500)) * mod;
    // mainCircle.y = (width / 2) + Math.sin(math.radToDeg(frame / 1500)) * mod;
    context.fillStyle = "black";
    context.shadow
    context.fill();
    context.stroke();
    context.clip();
    context.closePath();
    // context.restore();  

    let prevRow = undefined;
    let prevCol = undefined;

    for(let row = 0; row < rows; row++){

      for(let col = 0; col < cols; col++){

        // circles[row][col].draw(context);
        // points[row][col].draw(context);
        points[row][col].initCoors();
        points[row][col].deg = row % 2 == 0 ? frame : -frame;

        if(prevRow == undefined || prevCol == undefined){
          prevRow = row;
          prevCol = col;
          continue;
        }

        if(row == 0){
          continue;
        }

        const prevPoint = points[row - 1][col];
        const point = points[row][col];
        let halfX;
        let halfY;

        if(prevPoint.x < point.x){
          halfX = ((point.x - prevPoint.x) / 2) + prevPoint.x;
        }
        else{
          halfX = ((prevPoint.x - point.x) / 2) + point.x;
        }

        // if(prevPoint.y < point.y){
        //   halfY = ((point.y - prevPoint.y) / 2) + prevPoint.y;
        // }
        // else{
        //   halfY = ((prevPoint.y - point.y) / 2) + point.y;
        // }

        halfY = Math.abs(((prevPoint.y - point.y) / 2)) + Math.min(point.y, prevPoint.y);

        halfX = halfX + mod * Math.cos(math.degToRad(frame));
        halfY = halfY + mod * Math.cos(math.degToRad(frame));

        /*
          Draw points for testing
        */
        // if(row > 1 && row  < 5){

        //   if(col > 1 && col < 5){
        //     context.save();
        //     context.beginPath();
        //     context.lineWidth = 5;
        //     context.strokeStyle = "red";
        //     context.arc(point.x, point.y, 5, 0, Math.PI * 2);
        //     context.closePath();
        //     context.stroke();
        //     context.restore();

        //     context.save();
        //     context.beginPath();
        //     context.lineWidth = 5;
        //     context.strokeStyle = "blue";
        //     context.arc(prevPoint.x, prevPoint.y, 5, 0, Math.PI * 2);
        //     context.closePath();
        //     context.stroke();
        //     context.restore();

        //     context.save();
        //     context.beginPath();
        //     context.lineWidth = 5;
        //     context.strokeStyle = "orange";
        //     context.arc(halfX, halfY, 5, 0, Math.PI * 2);
        //     context.closePath();
        //     context.stroke();
        //     context.restore();
        //   }

        // }

        context.save();

        context.beginPath();
        context.moveTo(prevPoint.x, prevPoint.y);
        context.globalCompositeOperation ="source-over"; // xor
        context.quadraticCurveTo(halfX,halfY,point.x,point.y);
        // context.lineTo(mouseX, mouseY);
        context.fillStyle = point.color;
        context.fill();
        context.stroke();
        context.closePath();

        context.restore();

        prevRow = row;
        prevCol = col;

        // await sleep(0);

      }

    }

  };

};

class Circle {

  constructor(x, y, radius, startAngle, endAngle, speed = 20, cWidth = 500, cHeight = 500){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.speed = speed;
    this.xPolarity = 1;
    this.yPolarity = 1;
    this.cWidth = 500;
    this.cHeight = 500;
    this.xSpeed = Math.floor(Math.random() * speed) + 1;
    this.ySpeed = Math.floor(Math.random() * speed) + 1;

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

  lmaoDraw(context){

    context.save();

    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "black";
    context.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
    context.closePath();
    context.stroke();

    if(this.x >= this.radius*3){
      this.xPolarity = -1;
    } else if (this.x <= this.radius){
      this.xPolarity = 1;
    } 

    if(this.y >= this.radius*3){
      this.yPolarity = -1;
    } else if (this.y <= this.radius){
      this.yPolarity = 1;
    } 

    this.x += this.xSpeed * this.xPolarity;
    this.y += this.ySpeed * this.yPolarity;

    context.restore();

  }

}

class Point {

  constructor(circle, color){
    this.circle = circle;
    this.deg = 0;
    this.x = 0;
    this.y = 0;
    this.color = color;
  }

  getCoors(){
    return {
      x: this.circle.x + (this.circle.radius) * Math.cos(canvasMath.degToRad(this.deg)),
      y: this.circle.y + (this.circle.radius) * Math.sin(canvasMath.degToRad(this.deg))
    }
  }

  draw(context){
    context.save();

    this.x = this.circle.x + (this.circle.radius) * Math.cos(canvasMath.degToRad(this.deg));
    this.y = this.circle.y + (this.circle.radius) * Math.sin(canvasMath.degToRad(this.deg));

    context.moveTo(this.x,this.y);
    context.beginPath();
    context.lineWidth = 0.01;
    context.fillStyle="black";
    context.arc(this.x,this.y,7,0,Math.PI * 2);
    context.fill();
    context.closePath();
    context.stroke();

    context.restore();
  }

  initCoors(){
    this.x = this.circle.x + (this.circle.radius) * Math.cos(canvasMath.degToRad(this.deg));
    this.y = this.circle.y + (this.circle.radius) * Math.sin(canvasMath.degToRad(this.deg));
  }

}

canvasSketch(sketch, settings);
