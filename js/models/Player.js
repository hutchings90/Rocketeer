function Player(name, x, y) {
	// console.log('Player');
	Mover.call(this, name, 2, x, y);
	this.attacks = [ new SmartBomb(), new Laser(), new Bomb(), new Discharge(), new Disruptor(), new Shield() ];
}

Player.prototype = Object.create(Mover.prototype);
Player.prototype.constructor = Player;

Player.prototype.tickToClearAttack = function(i) {
	// console.log('tickToClearAttack');
	var attack = this.attacks[i];
	if (attack.tickToClear()) attack.clear();
};

Player.prototype.clearAttack = function(i) {
	// console.log('clearAttack');
	this.attacks[i].clear();
};

Player.prototype.attack = function(i) {
	// console.log('attack');
	return this.attacks[i].tick();
};

Player.prototype.shield = function(pressed) {
	// console.log('shield');
	return this.attacks[5].tick(pressed);
};

Player.prototype.disruptor = function(pressed) {
	// console.log('disruptor');
	return this.attacks[4].tick(pressed);
};

Player.prototype.depleteShield = function() {
	// console.log('depleteShield');
	this.attacks[5].deplete();
};

Player.prototype.discharge = function() {
	// console.log('discharge');
	if (this.attacks[5].state != 'refreshing') {
		this.depleteShield();
		return true;
	}
	return false;
};

Player.prototype.reset = function() {
	// console.log('reset');
	for (var i = this.attacks.length - 1; i >= 0; i--) this.attacks[i].reset();
};