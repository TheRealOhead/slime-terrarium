const slimeTypes = {
	'blue': {
		desc: 'The most average type of slime. Nothing special about them. Small chance to create yellow or green offspring',
		color: {
			hue: 217,
			saturation: 96,
			brightness: 73
		},
		growth: {
			scale: 600,
			standardDeviation: 20,
			mean: 100
		},
		mutationChances: [
			['yellow', 1],
			['green', 1],
			['blue', 8]
		]
	},
	'green': {
		desc: 'Similar to blue slimes, but they grow slower. Despie that, they can grow larger than blue slimes',
		color: {
			hue: 125,
			saturation: 65,
			brightness: 63
		},
		growth: {
			scale: 600,
			standardDeviation: 40,
			mean: 100
		},
		mutationChances: [
			['yellow', 1],
			['green', 8],
			['blue', 1]
		]
	},
	'yellow': {
		desc: 'These guys tend to grow all at once',
		color: {
			hue: 62,
			saturation: 65,
			brightness: 63
		},
		growth: {
			scale: 800,
			standardDeviation: 15,
			mean: 100
		},
		mutationChances: [
			['yellow', 8],
			['red', 1],
			['blue', 1]
		]
	},
	'pink': {
		desc: 'These little guys cause other slimes to grow faster',
		color: {
			hue: 321,
			saturation: 65,
			brightness: 63
		},
		growth: {
			scale: 50,
			standardDeviation: 10,
			mean: 20
		},
		mutationChances: [
			['pink', 1]
		],
		sellMultiplier: 0
	},
	'red': {
		desc: 'Red slimes grow very slowly, but seem to be unbounded in their growth',
		color: {
			hue: 0,
			saturation: 65,
			brightness: 63
		},
		growth: {
			scale: 6000,
			standardDeviation: 4000,
			mean: 100
		},
		mutationChances: [
			['red', 3],
			['pink', 1]
		]
	},
}

class Slime {
	static slimes = new Set();
	static lastId = 1;
	static slimesById = {}

	constructor(type, terrarium) {
		Slime.slimes.add(this);

		this.id = Slime.lastId++;
		Slime.slimesById[this.id] = this;

		this.terrarium = terrarium;
		this.terrarium.slimes.add(this);
		this.typeName = type;
		this.type = type = slimeTypes[type];

		this.color = type.color;

		this.mass = this.type.growth.mean;

		this.name = this.chooseName();

		this.position = this.terrarium.getDimensions().multiply(.5);
		this.headPosition = this.position.clone();

		this.velocity = new Vector(0, 0);

		this.grounded = false;

		this.growthRate = 0;

		this.startJumpTimer();

		try {updateSelector()} catch {};
	}

	chooseName() {
		return names[Math.floor(names.length * Math.random())];
	}

	startJumpTimer() {
		this.jumpTimer = 120 + Math.random() * 120;
	}

	getGrowthRate() {
		let growth = this.type.growth;
		return bellCurve(this.mass, growth.scale, growth.standardDeviation, growth.mean) * this.terrarium.growthMultiplier;
	}

	updateGrowthRate() {
		this.growthRate = this.getGrowthRate();
	}

	update() {
		this.updateGrowthRate();
		this.mass += this.growthRate;
	}

	getSellPrice() {
		let multiplier = 1;
		if (this.type.sellMultiplier !== undefined) multiplier = this.type.sellMultiplier;
		return Math.floor(this.mass / 4) * multiplier;
	}

	getBoundingBox() {
		return [
			new Vector(this.position.x - this.mass/2, this.headPosition.y - this.mass/4.5),
			new Vector(this.position.x + this.mass/2, this.position.y + this.mass/3)
		]
	}

	draw() {
		let ctx = this.terrarium.canvas.context;
		let dimensions = this.terrarium.getDimensions();
		let floor = dimensions.y * (3 / 4);
		let boundingBox = this.getBoundingBox();
		let topLeft = boundingBox[0];
		let bottomRight = boundingBox[1];

		// Debug draw bounding box
		//ctx.fillStyle = '#f0f';
		//ctx.fillRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, 1);
		//ctx.fillRect(topLeft.x, topLeft.y, 1, bottomRight.y - topLeft.y);


		// Move
		this.position = this.position.add(this.velocity);

		if (this.position.y < floor) {
			this.grounded = false;

			// Gravity
			this.velocity = this.velocity.add(new Vector(0, .1));
		} else {
			this.grounded = true;

			// Grounded
			this.position.y = floor;

			// Friction
			this.velocity.x *= .95;
		}

		// Jumps
		this.jumpTimer--;
		if (!this.grounded) this.startJumpTimer();
		if (this.jumpTimer <= 0) {
			this.velocity = new Vector(Math.random() * 4 - 2, -5);
			this.startJumpTimer();
		}

		// Bounce against sides of terrarium
		if (this.position.x < 0) {
			this.velocity.x = Math.abs(this.velocity.x);
			this.handleSideHit();
		}
		if (this.position.x > dimensions.x) {
			this.velocity.x = -Math.abs(this.velocity.x);
			this.handleSideHit();
		}
		if (this.position.y < 0) {
			this.velocity.y = Math.abs(this.velocity.y);
			this.handleSideHit();
		}

		// Drawing stuff
		let c = this.color;
		let p = this.position;
		let head = this.headPosition;
		ctx.fillStyle = `hsl(${c.hue}deg,${c.saturation}%,${c.brightness}%)`
		
		let metaballScale = (this.mass / 5);

		for (let y = Math.floor(topLeft.y); y < bottomRight.y; y++) {
			for (let x = Math.floor(topLeft.x); x < bottomRight.x; x++) {
				
				let metaballValue = metaballScale / Math.sqrt((.5*(x - p.x))**2 + (.8*(y - p.y))**2) + (metaballScale / 2) / Math.sqrt((x - head.x)**2 + (y - head.y)**2);

				if (1 <= metaballValue) {
					if (1.1 <= metaballValue) {
						ctx.fillStyle = `hsl(${c.hue}deg,${c.saturation}%,${c.brightness}%)`
					} else {
						try {ctx.fillStyle = currentSlime == this ? 'yellow' : 'gray'} catch {ctx.fillStyle = 'gray'};
					}
					ctx.fillRect(x, y, 1, 1);
				}
			}	
		}

		// Update head position
		this.headPosition = this.headPosition.multiply(1).add(this.position.add(new Vector(0, -metaballScale * 2))).multiply(1/2);
	}

	handleSideHit() {
		let speed = this.velocity.getMagnitude();
		if (speed > 20) this.split();
	}

	drawText() {
		let ctx = this.terrarium.canvas.context;

		if (this.terrarium.mouseOver) {
			ctx.fillStyle = 'black';
			ctx.font = '20px monospace';

			let yOffset = 0;

			ctx.fillText(`${this.name}`, this.position.x, this.position.y + yOffset);
			ctx.fillText(`Mass: ${Math.round(this.mass)}`, this.position.x, this.position.y + (yOffset += 25));
			ctx.fillText(`Growth rate: ${Math.round(this.growthRate * 100) / 100}`, this.position.x, this.position.y + (yOffset += 25));
		}
	}

	exportData() {
		// TODO: Return save data
		return {};
	}

	split() {
		if (this.mass < this.type.growth.mean) return false;
		
		let mutationPool = [];
		this.type.mutationChances.forEach(m=>{
			for (let i = 0; i < m[1]; i++) {
				mutationPool.push(m[0]);
			}
		});

		let daughters = [];
		let doTwice = () => {
			daughters.push(new Slime(mutationPool[Math.floor(Math.random() * mutationPool.length)], this.terrarium));
			return doTwice;
		};

		doTwice()();

		let firstHalf = this.name.slice(0, this.name.length / 2);
		let secondHalf = this.name.slice(this.name.length / 2);

		daughters[0].name = firstHalf.trim() ? firstHalf.trim() : this.chooseName();
		daughters[1].name = secondHalf.trim() ? secondHalf.trim() : this.chooseName();

		daughters[0].mass = daughters[1].mass = this.mass / 2;

		daughters[0].position = daughters[1].position = this.headPosition;

		daughters[0].velocity = this.velocity.multiply(.5).add(new Vector(-1, -.5));
		daughters[1].velocity = this.velocity.multiply(.5).add(new Vector( 1, -.5));

		daughters[0].color.saturation += Math.random() - .5;
		daughters[1].color.brightness += Math.random() - .5;

		this.destroy();

		updateCurrentSlime();
		updateSelector();

		return true;
	}

	destroy() {
		this.terrarium.slimes.delete(this);
		Slime.slimes.delete(this);
		Slime.slimesById[this.id] = undefined;
	}
}