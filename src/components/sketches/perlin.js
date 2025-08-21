export default function sketch(p5) {
  var inc = 0.1;
  var scl = 10;
  var cols, rows;
  var zoff = 0;
  var fr;
  var particles = [];
  var flowfield;
  var steps = 0;

  p5.setup = () => {
    p5.pixelDensity(5)
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    cols = p5.floor(p5.windowWidth / scl);
    rows = p5.floor(p5.windowHeight / scl);
    fr = p5.createP('');

    flowfield = new Array(cols * rows);

    for (var i = 0; i < 1000; i++) {
      particles[i] = new Particle();
    }
    p5.background(51);
  };

  p5.draw = () => {
    if (steps === 3000) return;
    var yoff = 0;
    for (var y = 0; y < rows; y++) {
      var xoff = 0;
      for (var x = 0; x < cols; x++) {
        var index = x + y * cols;
        var angle = p5.noise(xoff, yoff, zoff) * p5.TWO_PI * 4;
        var v = p5.constructor.Vector.fromAngle(angle);
        v.setMag(1);
        flowfield[index] = v;
        xoff += inc;
        p5.stroke(0, 50);
      }
      yoff += inc;

      zoff += 0.000003;
    }

    for (var i = 0; i < particles.length; i++) {
      particles[i].follow(flowfield);
      particles[i].update();
      particles[i].edges();
      particles[i].show();
    }

    steps++;
  };

  class Particle {
    constructor() {
      this.pos = p5.createVector(p5.random(p5.windowWidth), p5.random(p5.windowHeight));
      this.vel = p5.createVector(0, 0);
      this.acc = p5.createVector(0, 0);
      this.maxspeed = 4;
      this.prevPos = this.pos.copy();
    }

    update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxspeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }

    follow(vectors) {
      var x = p5.floor(this.pos.x / scl);
      var y = p5.floor(this.pos.y / scl);
      var index = x + y * cols;
      var force = vectors[index];
      this.applyForce(force);
    }

    applyForce(force) {
      this.acc.add(force);
    }

    show() {
      let n = p5.noise(this.pos.x * 0.005, this.pos.y * 0.005, zoff * 2);
      let hu = p5.map(n, 0, 1, 0, 360);  
      p5.stroke(200, hu, 100, 25);       
      p5.strokeWeight(1);
      p5.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
      this.updatePrev();
    }

    updatePrev() {
      this.prevPos.x = this.pos.x;
      this.prevPos.y = this.pos.y;
    }

    edges() {
      if (this.pos.x > p5.windowWidth) {
        this.pos.x = 0;
        this.updatePrev();
      }
      if (this.pos.x < 0) {
        this.pos.x = p5.windowWidth;
        this.updatePrev();
      }
      if (this.pos.y > p5.windowHeight) {
        this.pos.y = 0;
        this.updatePrev();
      }
      if (this.pos.y < 0) {
        this.pos.y = p5.windowHeight;
        this.updatePrev();
      }
    }
  }
}
