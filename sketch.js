// variable to hold a reference to our A-Frame world
let world;
let state = 0;
let img, song, test;
let fly = 500;
let previousTime = 0;

// array to hold some particles
let particles = [];
let canvasParticles = [];
let container;

function preload(){
	song = loadSound("media/uganda-night.mp3");
}

function setup() {
	// no canvas needed
	// noCanvas();
	let canvasName = createCanvas(512,512).id();
	background(60);

	// construct the A-Frame world
	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
	world = new World('VRScene');

	// set the world background color
	world.setBackground(0, 0, 0);

	container = new Container3D({x:0, y:0, z:0});
	world.add(container);

	var jar = new Cylinder({
		x: 0 , y:-2, z:-5,
		height:.75,
		radius: 0.4,
		asset: canvasName,
		dynamicTexture: true,
		dynamicTextureWidth: 512,
		dynamicTextureHeight: 512
		// red:149, green: 243, blue:240,
		// opacity: 0.4
	});
	container.addChild(jar);

	var funnel = new Cone({
		x: 0 , y:-1.25, z:-5,
		height:.5,
		radiusBottom: 0.4, radiusTop: 0.25,
		red:149, green: 243, blue:240,
		opacity: 0.2
	});
	container.addChild(funnel);

	var ring = new Ring({
		x: 0 , y:-2.3, z:-5,
		rotationX: 90,
		radiusInner:0.4,
		radiusOuter: 1,
		side: 'double',
		asset: 'wood',
		opacity: 0.25
	});
	container.addChild(ring);

	sun = new GLTF({
		asset: 'sun',
		x: 0 , y:-1.6, z:-4.65,
		rotationX:0,
		rotationY:180,
		scaleX:0.0015,
		scaleY:0.001,
		scaleZ:0.0015,
	});
	world.add(sun);


	let sky = new Sky({
		asset: 'sky'	
	});
	world.add(sky);
	song.play();
	song.loop();
	console.log('soung playing');
	

	

}

function bugAmount(val) {
	// update the variable with the current value of this slider
	fly = int( val.value );
	


  }




function draw() {
  

   gamePlay();

}

function gamePlay(){
	let currentTime = millis();
  	if (currentTime - previousTime > fly) {
		var temp = new Particle(0, -1.2, -5);
		particles.push(temp);
		previousTime = currentTime;
		fill(255, 255, 144);
		ellipse(random(width), random(height), random(5,30), random(5,30));
  	}
	
	// // draw all particles
	for (var i = 0; i < particles.length; i++) {
		var result = particles[i].move();
		if (result == "gone") {
			particles.splice(i, 1);
			i-=1;
		}
	}
}


// class to describe a particle's behavior
class Particle {

	constructor(x,y,z) {

		// construct a new Box that lives at this position
		this.myBox = new Sphere({
								x:x, y:y, z:z,
								red: 255, green:255, blue:143,
								radius: 0.1
		});

		// add the box to the world
		world.add(this.myBox);

		this.wingBox = new TorusKnot({
							x: x , y:y, z:z,
							radius:0.1,
							radiusTubular: 0.008,
							red:0, green:0, blue:0,
						});
		world.add(this.wingBox);

		

		// keep track of an offset in Perlin noise space
		this.xOffset = random(1000);
		this.zOffset = random(2000, 3000);
	}

	// function to move our box
	move() {
		// compute how the particle should move
		// the particle should always move up by a small amount
		var yMovement = 0.01;

		// the particle should randomly move in the x & z directions
		var xMovement = map( noise(this.xOffset), 0, 1, -0.05, 0.05);
		var zMovement = map( noise(this.zOffset), 0, 1, -0.05, 0.05);

		// update our poistions in perlin noise space
		this.xOffset += 0.01;
		this.yOffset += 0.01;

		// set the position of our box (using the 'nudge' method)
		this.myBox.nudge(xMovement, yMovement, zMovement);
		this.wingBox.nudge(xMovement, yMovement, zMovement);

		// make the boxes shrink a little bit
		var boxScale = this.myBox.getScale();
		this.myBox.setScale( boxScale.x-0.001, boxScale.y-0.001, boxScale.z-0.001);
		this.wingBox.setScale( boxScale.x-0.001, boxScale.y-0.001, boxScale.z-0.001);

		// if we get too small we need to indicate that this box is now no longer viable
		if (boxScale.x <= 0) {
			// remove the box from the world
			world.remove(this.myBox);
			world.remove(this.wingBox);
			return "gone";
		}
		else {
			return "ok";
		}
	}
}
