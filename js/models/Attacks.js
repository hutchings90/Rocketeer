function SmartBomb(level) {
	// console.log('SmartBomb');
	Attack.call(this, 'Smart Bomb', 100, 5, level, true);
	this.ts = (new Date()).getTime() - 150;
}

SmartBomb.prototype = Object.create(Attack.prototype);
SmartBomb.constructor = SmartBomb;

SmartBomb.prototype.isDone = function() {
	// console.log('isDone');
	return !View.prototype.getElement('img[src*="smartBomb"]');
};

SmartBomb.prototype.tick = function() {
	// console.log('tick');
	var ts = (new Date()).getTime();
	var diff = ts - this.ts;
	if (!View.prototype.getElement('img[src*="smartBomb"]')) {
		if (diff > 150) {
			this.ts = ts;
			return true;
		}
		return false;
	}
	if (diff < 150) return false;
	var delay = ts + 150;
	if (delay - this.ts < 1000) this.ts = this.ts + 1000;
	else this.ts = delay;
	return 'Smart Bomb';
};

SmartBomb.prototype.tickToClear = function() {
	// console.log('isActive');
	return false;
};

SmartBomb.prototype.setLevel = function(level) {
	// console.log('setLevel');
	if (level > 3) level = 3;
	this.level = level || 1;
};

function Laser(level) {
	// console.log('Laser');
	Attack.call(this, 'Laser', 35, 10, level);
}

Laser.prototype = Object.create(Attack.prototype);
Laser.constructor = Laser;

Laser.prototype.levelStats = function(delay, speed, level) {
	// console.log('levelStats');
	this.setLevel(level);
	this.delay = 35 - (Math.floor(this.level / 2) * 6);
	this.speed = 10 + ((this.level - 1) * 2);
};

Laser.prototype.getFilename = function() {
	// console.log('getFilename');
	return 'laser';
};

function Discharge(level) {
	// console.log('Discharge');
	Attack.call(this, 'Discharge', 0, 0, level);
}

Discharge.prototype = Object.create(Attack.prototype);
Discharge.constructor = Discharge;

Discharge.prototype.setLevel = function(level) {
	// console.log('setLevel');
	if (level > 3) level = 3;
	this.level = level || 1;
};

function Bomb(level) {
	// console.log('Bomb');
	Attack.call(this, 'Bomb', 100, 5, level, true);
}

Bomb.prototype = Object.create(Attack.prototype);
Bomb.constructor = Bomb;

Bomb.prototype.setLevel = function(level) {
	// console.log('setLevel');
	if (level > 3) level = 3;
	this.level = level || 1;
};

function TractorBeam(level) {
	// console.log('TractorBeam');
	Attack.call(this, 'Tractor Beam', 0, 0, level);
	this.charge = 200;
}

TractorBeam.prototype = Object.create(Attack.prototype);
TractorBeam.constructor = TractorBeam;

TractorBeam.prototype.isDone = function() {
	// console.log('isDone');
};

function Shield(level) {
	// console.log('Shield');
	Attack.call(this, 'Shield', 0, 0, level);
	this.limit = 200;
	this.state = 'idle';
}

Shield.prototype = Object.create(Attack.prototype);
Shield.constructor = Shield;

Shield.prototype.tick = function(pressed) {
	// console.log('tick');
	switch (this.state) {
	case 'idle':
		if (!pressed) {
			if (this.ticks > 0) this.ticks--;
			return false;
		}
		if (this.ticks >= this.limit) {
			this.state = 'refreshing';
			return false;
		}
		this.ticks++;
		return true;
	case 'refreshing':
		if (--this.ticks <= this.limit / 2) {
			this.state = 'idle';
			if (pressed) {
				this.ticks++;
				return true;
			}
		}
	}
	return false;
};

Shield.prototype.deplete = function() {
	// console.log('deplete');
	this.ticks = this.limit;
	this.state = 'refreshing';
};