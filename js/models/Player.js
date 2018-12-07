function Player(name, gp) {
	// console.log('Player');
	Mover.call(this, name);
	this.gp = gp;
}

Player.prototype = Object.create(Mover.prototype);
Player.prototype.constructor = Player;