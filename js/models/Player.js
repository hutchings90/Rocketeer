function Player(name, x, y) {
	// console.log('Player');
	Mover.call(this, name, 2, x, y);
	this.attacks = [ new SmartBomb(), new Laser(), new Discharge(), new Bomb(), new TractorBeam(), new TractorBeam(), new Shield(), new Shield() ];
}

Player.prototype = Object.create(Mover.prototype);
Player.prototype.constructor = Player;

Player.prototype.tickToClearAttack = function(i) {
	// console.log('tickToClearAttack');
	var o = null;
	var attack = this.attacks[i]
	switch (i) {
	case 4: o = this.attacks[5]; break;
	case 5: o = this.attacks[4]; break;
	case 6: o = this.attacks[7]; break;
	case 7: o = this.attacks[6]; break;
	}
	if (attack.tickToClear()) {
		attack.clear();
		if (o) o.clear();
	}
};

Player.prototype.clearAttack = function(i) {
	// console.log('clearAttack');
	var o = null;
	var attack = this.attacks[i]
	switch (i) {
	case 4: o = this.attacks[5]; break;
	case 5: o = this.attacks[4]; break;
	case 6: o = this.attacks[7]; break;
	case 7: o = this.attacks[6]; break;
	}
	attack.clear();
	if (o) o.clear();
};

Player.prototype.attack = function(i) {
	// console.log('attack');
	var o = null;
	var a = this.attacks[i];
	var shouldAttack = a.tick();
	switch (i) {
	case 4: o = this.attacks[5]; break;
	case 5: o = this.attacks[4]; break;
	case 6: o = this.attacks[7]; break;
	case 7: o = this.attacks[6]; break;
	}
	if (o) o.tick();
	return shouldAttack;
};