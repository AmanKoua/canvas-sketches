const canvasSketch = require('canvas-sketch');
const canvasMath = require("canvas-sketch-util/math");

const canvasWidth = 1080;
const canvasHeight = canvasWidth;

const pyrWidth = canvasWidth/4;
const pyrHeight = canvasHeight/3;
const pyrDepth = canvasHeight/2;
const center = canvasWidth/3;

const settings = {
  dimensions: [ canvasWidth, canvasHeight ],
  animate: true,
  fps:60
};

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
    context.translate(canvasWidth/4,canvasHeight/4);
    context.beginPath();
    context.moveTo(this.x,this.y);
    context.arc(this.x,this.y,Math.pow(2,this.z/400),0,Math.PI*2);
    context.closePath();
    context.stroke();
    context.restore();
  }

}

const vertices = [
  new Vertex(center+pyrWidth,0,center), // front right corner
  new Vertex(center-pyrWidth,0,center), // front left corner
  new Vertex(center+pyrWidth,0,center+pyrDepth), // back right corner
  new Vertex(center-pyrWidth,0,center+pyrDepth), // back left corner
  new Vertex(center,pyrHeight,center+(pyrDepth/2)), // Tip of pyramid
]

const vertices2 = [
  new Vertex(center+pyrWidth,pyrHeight*2,center), // front right corner
  new Vertex(center-pyrWidth,pyrHeight*2,center), // front left corner
  new Vertex(center+pyrWidth,pyrHeight*2,center+pyrDepth), // back right corner
  new Vertex(center-pyrWidth,pyrHeight*2,center+pyrDepth), // back left corner
  new Vertex(center,pyrHeight,center+(pyrDepth/2)), // Tip of pyramid
]

const edges = [
  // base square edges
  [0,1],[1,3],[3,2],[2,0],
  // base vertices to tip
  [0,4],[1,4],[2,4],[3,4]
]

const sketch = () => {
  return ({ context, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    for(let e of edges) {

      let v1 = vertices[e[0]];
      let v2 = vertices[e[1]];

      context.save();

      context.translate(canvasWidth/10,canvasHeight/8)
      context.beginPath();
      context.moveTo(v1.x,v1.y);
      context.lineTo(v2.x,v2.y);
      context.stroke();
      context.closePath();

      context.restore();


      // 2nd pyramid
      // v1 = vertices2[e[0]];
      // v2 = vertices2[e[1]];

      // context.save();

      // context.translate(canvasWidth/10,canvasHeight/8)
      // context.beginPath();
      // context.moveTo(v1.x,v1.y);
      // context.lineTo(v2.x,v2.y);
      // context.stroke();
      // context.closePath();

      // context.restore();
    }

    for(let i = 0; i < vertices.length; i++){
        let v = vertices[i];
        let radians = canvasMath.degToRad(1);
        v.rotateX(radians, canvasWidth/2, canvasHeight/2);
        v.rotateY(radians, canvasWidth/2, canvasHeight/2);
        v.rotateZ(radians, canvasWidth/2, canvasHeight/2);
    }


    // rotate 2nd pyramid
    // for(let i = 0; i < vertices2.length; i++){
    //   let v = vertices2[i];
    //   let radians = canvasMath.degToRad(1);
    //   v.rotateX(radians, canvasWidth/2, canvasHeight/2);
    //   v.rotateY(radians, canvasWidth/2, canvasHeight/2);
    //   v.rotateZ(radians, canvasWidth/2, canvasHeight/2);
    // }

  };
};

canvasSketch(sketch, settings);