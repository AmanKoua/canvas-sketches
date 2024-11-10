const canvasSketch = require('canvas-sketch');

const HEIGHT = 1000;
const WIDTH = 1000;
const maxSpeed = 10;
const ROWS = 10;
const COLS = 10;
const ROW_HEIGHT = HEIGHT / ROWS;
const COL_WIDTH = WIDTH / COLS;

const settings = {
  dimensions: [ WIDTH, HEIGHT ],
  animate:true,
  fps:60
};

const sketch = () => {

  const points = [];

  for(let row = 0; row < ROWS; row++){

    points.push([]);

    for(let col = 0; col < COLS; col++){

      const point = new Point(
        maxSpeed/(row+col),
        maxSpeed/(row+col),
        (col*COL_WIDTH) + (COL_WIDTH / 2),
        (row*ROW_HEIGHT) + (ROW_HEIGHT / 2),
        row,
        col
      )

      points[row].push(point);

    }
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for(let row = 0; row < ROWS; row++){

        context.save()

        context.beginPath();
        context.moveTo(0, (ROW_HEIGHT * row))
        context.lineTo(WIDTH, ROW_HEIGHT * row)
        context.closePath();
        context.stroke();

        context.restore();

    }

    for(let col = 0; col < COLS; col++){

      context.save()

      context.beginPath();
      context.moveTo((COL_WIDTH * col), 0)
      context.lineTo((COL_WIDTH * col), HEIGHT)
      context.closePath();
      context.stroke();

      context.restore();
    }

    for(let row = 0; row < ROWS; row++){
      for(let col = 0; col < COLS; col++){
        points[row][col].move();
        points[row][col].draw(context);

        if(row == ROWS -1 || col == COLS -1){
          continue;
        }

        context.save();

        context.beginPath();
        context.moveTo(points[row][col].x,points[row][col].y);
        context.lineTo(points[row][col+1].x,points[row][col+1].y);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.moveTo(points[row][col].x,points[row][col].y);
        context.lineTo(points[row+1][col].x,points[row+1][col].y);
        context.stroke();
        context.closePath();

        context.restore();

      }
    }

  };
};

class Point {

  constructor(speedX,speedY,x,y,row,col){
    this.speedX = speedX;
    this.speedY = speedY;
    this.x = x;
    this.y = y;
    this.polarityX = 1;
    this.polarityY = 1;
    this.row = row;
    this.col = col;
  }

  move(){
    this.x += this.speedX * this.polarityX;
    this.y += this.speedY * this.polarityY;

    if(this.y <= this.row*ROW_HEIGHT || this.y >= (this.row+1)*ROW_HEIGHT){
      this.polarityY *= -1;
    }

    if(this.x <= this.col*COL_WIDTH || this.x >= (this.col+1)*COL_WIDTH){
      this.polarityX *= -1;
    }
  }

  draw(context){

    context.save();
    context.beginPath();

    context.fillStyle ="black";
    context.arc(this.x,this.y,3,0,Math.PI * 2);
    context.fill();

    context.closePath();  
    context.restore();

  }

}

canvasSketch(sketch, settings);