class Terrarium {
	static terrariums = [];

	constructor(name, agarType) {
		Terrarium.terrariums.push(this);

		let dimensions = new Vector(800, 400);

		this.canvas = {};
		this.canvas.element = document.createElement('canvas');
		this.canvas.context = this.canvas.element.getContext('2d');

		this.canvas.element.width  = dimensions.x;
		this.canvas.element.height = dimensions.y;

		this.name = name;

		this.slimes = new Set();

		this.agar = getAgarType(agarType);

		this.mouseOver = false;
		this.canvas.element.addEventListener('mouseenter', () => {
			this.mouseOver = true;
		});
		this.canvas.element.addEventListener('mouseleave', () => {
			this.mouseOver = false;
		});

		document.getElementById('terrarium-container').appendChild(this.canvas.element);

		this.mouseDown = false;

		this.canvas.element.addEventListener('mousedown', e => {
			this.mouseDown = true;
		});

		this.canvas.element.addEventListener('mouseup', e => {
			this.mouseDown = false;
		});

		this.growthMultiplier = 1;

		this.canvas.element.addEventListener('mousemove', e => {
			let bcr = this.canvas.element.getBoundingClientRect();
			let x = e.clientX - bcr.x;
			let y = e.clientY - bcr.y;

			this.mouseLastPos = this.mousePos;
			this.mousePos = new Vector(x, y);
		});
	}

	getClosestSlime(pos) {
		let closestDist = Infinity;
		let closestSlime = undefined;
		[...this.slimes].forEach(slime => {
			let dist = (slime.position.x - pos.x)**2 + (slime.position.y - pos.y)**2;
			if (dist < closestDist) {
				closestDist = dist;
				closestSlime = slime;
			};
		});
		return closestSlime;
	}

	getDimensions() {
		return new Vector(
			this.canvas.element.width,
			this.canvas.element.height
		);
	}

	update() {
		this.updateGrowthMultiplier();
	}

	updateGrowthMultiplier() {
		// idgaf so im hardcoding the pink slime bonus
		let multiplier = 1;
		[...this.slimes].forEach(s => {
			if (s.typeName == 'pink') multiplier += .1; // Each pink slime increases the multiplier by 10%
		});

		this.growthMultiplier = multiplier;
	}

	exportData() {
		// TODO: Return save data
		return {};
	}

	draw() {
		// Slime drag
		if (this.mouseDown) {
			currentSlime = this.getClosestSlime(this.mousePos);
			currentSlime.position = this.mousePos.clone();
			currentSlime.startJumpTimer();
			currentSlime.velocity = this.mousePos.add(this.mouseLastPos.multiply(-1)).multiply(.8);

			ui.selector.value = currentSlime.id;
			updateCurrentSlime();
		}

		// Clear
		this.canvas.element.width = this.canvas.element.width;

		// Draw agar
		this.agar.draw(this.canvas.context, this.agar);

		// Draw slimes
		this.slimes.forEach(s => {
			s.draw();
		})
		this.slimes.forEach(s => {
			s.drawText();
		})
	}
}