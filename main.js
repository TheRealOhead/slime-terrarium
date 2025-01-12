let money = 50;

let lastFrameTime = 0;

let draw = () => {
	Terrarium.terrariums.forEach(t => {
		t.draw();
	});
	requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// Tick every 5 seconds
setInterval(() => {

	// Update terrariums
	Terrarium.terrariums.forEach(terrarium => {
		terrarium.update();
	})

	// Update slimes
	Slime.slimes.forEach(slime => {
		slime.update();
	})

	updateReadOnly();
}, 5000);

// Debug
let terrarium = new Terrarium('Normal Terrarium', 'normal');
new Slime('red', terrarium).mass = 150;
new Slime('pink', terrarium);