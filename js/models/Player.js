function Player(name, x, y) {
	// console.log('Player');
	Mover.call(this, name, x, y, 2);
	this.attacks = [
		{ ticks: 0, name: 'Smart_Bomb', done: 0 }, // Explodes when button released, on contact, and at end of screen.
		{ ticks: 0, name: 'Laser', done: 0 },
		{ ticks: 0, name: 'Discharge', done: 0 }, // Damage depends on shield strength. Depletes shield.
		{ ticks: 0, name: 'Bomb', done: 0 }, // Explodes on contact.
		{ ticks: 0, name: 'Tractor_Beam', done: 0 },
		{ ticks: 0, name: 'Tractor_Beam', done: 0 },
		{ ticks: 0, name: 'Shield', done: 0 },
		{ ticks: 0, name: 'Shield', done: 0 }
	];
}

Player.prototype = Object.create(Mover.prototype);
Player.prototype.constructor = Player;

Player.prototype.attack = function(i) {
	var o;
	var a = this.attacks[i];
	a.ticks++;
	switch (i) {
	case 4: o = this.attacks[5]; break;
	case 5: o = this.attacks[4]; break;
	case 6: o = this.attacks[7]; break;
	case 7: o = this.attacks[6]; break;
	default: o = { ticks: 0, name: '', done: 0 };
	}
	if (a.ticks == a.done) {
		a.ticks = 0;
		o.ticks = 0;
	}
};