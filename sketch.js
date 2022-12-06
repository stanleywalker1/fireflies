// variable to hold a reference to our A-Frame world
let world;
let state = 0;
let img, song, test;
let fly = 500;
let previousTime = 0;

// array to hold some particles
let particles = [];

function setup() {
	// no canvas needed
	noCanvas();

	// construct the A-Frame world
	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
	world = new World('VRScene');

	// set the world background color
	world.setBackground(0, 0, 0);

	var jar = new Cylinder({
		x: 0 , y:-2, z:-5,
		height:.75,
		radius: 0.4,
		red:255, green: 255, blue:255,
		opacity: 0.2
	});
	world.add(jar);

	let sky = new Sky({
		asset: 'sky'	
	});
	world.add(sky);

	// for (var i = 0; i < fly; i++) {
	// 	var temp = new Particle(0, -1.7, -5);
	// 	particles.push(temp);
	// }


}

function bugAmount(val) {
	// update the variable with the current value of this slider
	fly = int( val.value );

// 	let currentTime = millis();
//   	if (currentTime - previousTime > fly) {
//     // // Add an object to the array
//     // myArray.push(new Object());
//     // previousTime = currentTime;

// 	var temp = new Particle(0, -1.7, -5);
// 	particles.push(temp);
// 	previousTime = currentTime;
//   }





	// for (var i = 0; i < fly; i++) {
	// var temp = new Particle(0, -1.7, -5);
	// particles.push(temp);
	// }

  }



function draw() {

   gamePlay();

}

function gamePlay(){
	let currentTime = millis();
  	if (currentTime - previousTime > fly) {
		var temp = new Particle(0, -1.7, -5);
		particles.push(temp);
		previousTime = currentTime;
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

		// make the boxes shrink a little bit
		var boxScale = this.myBox.getScale();
		this.myBox.setScale( boxScale.x-0.001, boxScale.y-0.001, boxScale.z-0.001);

		// if we get too small we need to indicate that this box is now no longer viable
		if (boxScale.x <= 0) {
			// remove the box from the world
			world.remove(this.myBox);
			return "gone";
		}
		else {
			return "ok";
		}
	}
}

// function windowResized() {
// 	sketchWidth = document.getElementById("p5").offsetWidth;
// 	sketchHeight = document.getElementById("p5").offsetHeight;
// 	canvas.resize(sketchWidth, sketchHeight);  
//  }
