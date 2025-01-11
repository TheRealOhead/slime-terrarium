const defaultAgar = {
	name: 'Undefined Agar',
	color: '#4e5354',
	temperature: 20,
	nutrition: 100,
	draw: (context, me) => {
		let c = context.canvas;
		context.fillStyle = me.color;
		context.fillRect(0, c.height * (2/3), c.width, c.height);
	}
}

const agarTypes = {
	'normal': {
		name: 'Normal Agar',
		color: '#d1e092'
	},
	'hot': {
		name: 'Hot Agar',
		color: '#c44427',
		temperature: 45
	},
	'cold': {
		name: 'Cold Agar',
		color: '#27a2c4',
		temperature: 3
	},
	'nutritious': {
		name: 'Nutritious Agar',
		color: '#b0c947',
		nutrition: 200
	},
	'none': {
		name: 'No Agar'
	}
}

function getAgarType(id) {
	if (!Object.keys(agarTypes).includes(id)) {
		return {...defaultAgar};
	}

	return {...defaultAgar, ...agarTypes[id]};
}