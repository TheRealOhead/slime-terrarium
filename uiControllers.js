const ui = {
	selector: document.getElementById('slime-info-selector'),
	name: document.getElementById('slime-info-name'),
	mass: document.getElementById('slime-info-mass'),
	splitButton: document.getElementById('slime-info-split'),
	sellButton: document.getElementById('slime-info-sell-button'),
	sellPrice: document.getElementById('slime-info-sell-price'),
	typeDescription: document.getElementById('slime-info-type-description'),

	money: document.getElementById('shop-money')
}

let currentSlime = undefined;

function updateSelector() {
	let entries = [{name: '-', id: -1}, ...Slime.slimes];

	ui.selector.innerHTML = '';
	entries.forEach(slime => {
		let option = document.createElement('option');

		option.innerHTML = slime.name;
		option.value = slime.id;

		ui.selector.appendChild(option);
	});
}

function updateCurrentSlime() {
	if (ui.selector.value == -1) currentSlime = undefined;
	else currentSlime = Slime.slimesById[ui.selector.value];

	ui.name.value = currentSlime ? currentSlime.name : '(no slime selected)';
	ui.name.readOnly = !currentSlime;

	updateReadOnly();
}

function updateReadOnly() {
	ui.mass.innerHTML = currentSlime ? Math.round(currentSlime.mass * 100) / 100 : '-';
	ui.money.innerHTML = `$${money}`;
	ui.sellPrice.innerHTML = currentSlime ? currentSlime.getSellPrice() : '-';
	ui.typeDescription.innerHTML = currentSlime ? currentSlime.type.desc : '';
}

ui.selector.addEventListener('change', () => {
	updateCurrentSlime();
})

updateCurrentSlime();
updateSelector();

ui.splitButton.addEventListener('click', () => {
	let result;
	if (currentSlime) result = currentSlime.split();
});

ui.name.addEventListener('change', () => {
	currentSlime.name = ui.name.value;
	updateSelector();
	ui.selector.value = currentSlime.id;
})

ui.sellButton.addEventListener('click', () => {
	if (!currentSlime) return;

	money += currentSlime.getSellPrice();

	currentSlime.destroy();

	updateReadOnly();
	updateSelector();
	updateCurrentSlime();
})