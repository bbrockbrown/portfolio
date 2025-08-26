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

  // Function to get proper viewport dimensions using modern viewport units
  const getViewportDimensions = () => {
    // Use visualViewport API for most accurate mobile viewport
    if (window.visualViewport) {
      return {
        width: window.visualViewport.width,
        height: window.visualViewport.height
      };
    }
    
    // Fallback: use window dimensions
    return {
      width: window.innerWidth || p5.windowWidth,
      height: window.innerHeight || p5.windowHeight
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
    
    // Adaptive pixel density for better mobile performance
    const isMobile = window.innerWidth <= 768;
    p5.pixelDensity(isMobile ? 1 : Math.min(2, window.devicePixelRatio || 1));
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
    p5.background(20, 20, 20);
  };

  // Handle window resize for mobile viewport changes
  const handleResize = () => {
    const viewport = getViewportDimensions();
    
    // Only resize on significant changes to prevent mobile UI issues
    if (initialViewport) {
      const widthDiff = Math.abs(viewport.width - initialViewport.width);
      const heightDiff = Math.abs(viewport.height - initialViewport.height);
      const isMobile = window.innerWidth <= 768;
      
      // More responsive thresholds: mobile needs smaller threshold for keyboard/orientation
      const threshold = isMobile ? 50 : 100;
      if (widthDiff < threshold && heightDiff < threshold) {
        return; // Skip resize for small changes
      }
    }
    
    p5.image(viewport.width, viewport.height);
    cols = p5.floor(viewport.width / scl);
    rows = p5.floor(viewport.height / scl);
    flowfield = new Array(cols * rows);
    
    // Update the reference viewport
    initialViewport = { ...viewport };
  };

  // Handle window resize for both desktop and mobile
  p5.windowResized = () => {
    const isMobile = window.innerWidth <= 768;
    const delay = isMobile ? 500 : 300; // Longer delay for mobile to prevent choppy resizing
    debouncedResize(handleResize, delay)();
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
      let hu = p5.map(n, 0, 1, 0, 360); // Deep blue range for better text readability
      p5.stroke(hu, 0, 200, 15);       
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
