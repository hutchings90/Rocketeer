function SmartBomb() {
	// console.log('SmartBomb');
	Attack.call(this, 'Smart Bomb', 100, 5);
}

SmartBomb.prototype = Object.create(Attack.prototype);
SmartBomb.constructor = SmartBomb;

SmartBomb.prototype.isDone = function() {
	// console.log('isDone');
};

function Laser() {
	// console.log('Laser');
	Attack.call(this, 'Laser', 35, 10);
}

Laser.prototype = Object.create(Attack.prototype);
Laser.constructor = Laser;

function Discharge() {
	// console.log('Discharge');
	Attack.call(this, 'Discharge', 0);
}

Discharge.prototype = Object.create(Attack.prototype);
Discharge.constructor = Discharge;

function Bomb() {
	// console.log('Bomb');
	Attack.call(this, 'Bomb', 100, 5);
}

Bomb.prototype = Object.create(Attack.prototype);
Bomb.constructor = Bomb;

function TractorBeam() {
	// console.log('TractorBeam');
	Attack.call(this, 'Tractor Beam', 0);
	this.charge = 200;
}

TractorBeam.prototype = Object.create(Attack.prototype);
TractorBeam.constructor = TractorBeam;

TractorBeam.prototype.isDone = function() {
	// console.log('isDone');
};

function Shield() {
	// console.log('Shield');
	Attack.call(this, 'Shield', 0);
	this.charge = 400;
}

Shield.prototype = Object.create(Attack.prototype);
Shield.constructor = Shield;

Shield.prototype.isDone = function() {
	// console.log('isDone');
};