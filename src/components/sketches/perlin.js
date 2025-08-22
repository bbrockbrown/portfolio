export default function sketch(p5) {
  var inc = 0.1;
  var scl = 10;
  var cols, rows;
  var zoff = 0;
  var fr;
  var particles = [];
  var flowfield;
  var steps = 0;
  var randomSeed;
  var lastResizeTime = 0;
  var initialViewport = null;

  // Function to get proper viewport dimensions
  const getViewportDimensions = () => {
    if (window.visualViewport) {
      return {
        width: window.visualViewport.width,
        height: window.visualViewport.height
      };
    }
    // Fallback: use document.documentElement for better mobile support
    return {
      width: document.documentElement.clientWidth || p5.windowWidth,
      height: document.documentElement.clientHeight || p5.windowHeight
    };
  };

  // Debounced resize function to prevent choppy re-renders
  const debouncedResize = (callback, delay = 300) => {
    return (...args) => {
      const now = Date.now();
      if (now - lastResizeTime > delay) {
        lastResizeTime = now;
        callback(...args);
      }
    };
  };

  p5.setup = () => {
    // Set a new random seed each time setup runs
    randomSeed = Math.floor(Math.random() * 100000);
    p5.randomSeed(randomSeed);
    p5.noiseSeed(randomSeed);
    
    p5.pixelDensity(5)
    // Get proper viewport dimensions for mobile
    const viewport = getViewportDimensions();
    initialViewport = { ...viewport }; // Store initial viewport for comparison
    p5.createCanvas(viewport.width, viewport.height);
    cols = p5.floor(viewport.width / scl);
    rows = p5.floor(viewport.height / scl);
    fr = p5.createP('');

    flowfield = new Array(cols * rows);

    for (var i = 0; i < 1000; i++) {
      particles[i] = new Particle();
    }
    p5.background(51);
  };

  // Handle window resize for mobile viewport changes
  const handleResize = () => {
    const viewport = getViewportDimensions();
    
    if (initialViewport) {
      const widthDiff = Math.abs(viewport.width - initialViewport.width);
      const heightChange = viewport.height - initialViewport.height;
      
      // Only resize if:
      // 1. Width changed significantly (rotation, split screen, etc.)
      // 2. Height INCREASED (browser UI hidden, more space available)
      // Skip resizing when height decreases (browser UI appearing)
      if (widthDiff < 50 && heightChange <= 0) {
        return; // Skip resize for width unchanged + height same/smaller
      }
    }
    
    p5.resizeCanvas(viewport.width, viewport.height);
    cols = p5.floor(viewport.width / scl);
    rows = p5.floor(viewport.height / scl);
    flowfield = new Array(cols * rows);
    
    // Update the reference viewport
    initialViewport = { ...viewport };
  };

  p5.windowResized = debouncedResize(handleResize, 500);

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
      const viewport = getViewportDimensions();
      this.pos = p5.createVector(p5.random(viewport.width), p5.random(viewport.height));
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
      const viewport = getViewportDimensions();
      if (this.pos.x > viewport.width) {
        this.pos.x = 0;
        this.updatePrev();
      }
      if (this.pos.x < 0) {
        this.pos.x = viewport.width;
        this.updatePrev();
      }
      if (this.pos.y > viewport.height) {
        this.pos.y = 0;
        this.updatePrev();
      }
      if (this.pos.y < 0) {
        this.pos.y = viewport.height;
        this.updatePrev();
      }
    }
  }
}
