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
	}

	getDimensions() {
		return new Vector(
			this.canvas.element.width,
			this.canvas.element.height
		);
	}

	exportData() {
		// TODO: Return save data
		return {};
	}

	draw() {
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