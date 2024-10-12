const canvasSketch = require('canvas-sketch');
const canvasMath = require("canvas-sketch-util/math");

const width = 1080;
const height = width;
const scaleProduct = .06;

const settings = {
  dimensions: [ width+1000, height+1000 ],
  animate:true,
  fps:20
};

const sketch = ({}) => {

  const vertexCount = 400;
  const vertices = [];

  for(let i = 0 - (vertexCount/2); i < vertexCount/2; i++){
    vertices.push(new Vertex(
      scaleX(i),
      scaleY(i),
      scaleZ(i) - i
    ))
  }

  return ({context}) => {

    context.fillStyle = 'white';
    context.fillRect(0, 0, width+1000, height+1000);

    for(let i = 0; i < vertices.length; i++){
      let degree = canvasMath.degToRad(0.7);
      vertices[i].draw(context);
      vertices[i].rotateX(degree,height/2,0); // flip forwards and backwards
      vertices[i].rotateY(degree,height/2,0) // rotate around object
      vertices[i].rotateZ(degree,width/4,height/4) // tilt left and right
    }
  };
};

let scaleX = (val) =>{
  return val + Math.random() * 50;
}

let scaleY = (val) => {
  return Math.pow(val, 2) * scaleProduct;
}

let scaleZ = (val) => {
  return Math.pow(val, 2) * scaleProduct;
}

class Vertex {

  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
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
    context.translate(width/4,height/4);
    context.beginPath();
    context.moveTo(this.x,this.y);
    context.arc(this.x,this.y,Math.pow(2,this.z/400),0,Math.PI*2);
    context.closePath();
    context.stroke();
    context.restore();
  }

}

canvasSketch(sketch, settings);
