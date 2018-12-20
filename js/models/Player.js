function Player(name, x, y) {
	// console.log('Player');
	Mover.call(this, name, x, y, 2);
	this.attacks = [ new SmartBomb(), new Laser(), new Discharge(), new Bomb(), new TractorBeam(), new TractorBeam(), new Shield(), new Shield() ];
}

Player.prototype = Object.create(Mover.prototype);
Player.prototype.constructor = Player;

Player.prototype.clearAttack = function(i) {
	// console.log('clearAttack');
	var o = null;
	var attack = this.attacks[i]
	attack.clear();
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
	switch (i) {
	case 4: o = this.attacks[5]; break;
	case 5: o = this.attacks[4]; break;
	case 6: o = this.attacks[7]; break;
	case 7: o = this.attacks[6]; break;
	}
	a.tick();
	if (o) o.tick();
};