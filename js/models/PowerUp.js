function PowerUp() {}

PowerUp.prototype.powerUps = [new Mover('bombUp'), new Mover('dischargeUp'), new Mover('laserUp'), new Mover('shieldUp'), new Mover('smartBombUp'), new Mover('disruptorUp')];

PowerUp.prototype.get = function() {
	// console.log('get');
	return Object.assign(new Mover(), PowerUp.prototype.powerUps[5]);
	// return Object.assign(new Mover(), PowerUp.prototype.powerUps[Math.floor(Math.random() * PowerUp.prototype.powerUps.length)]);
};

PowerUp.prototype.move = function(powerUp, e) {
	// console.log('move');
	return powerUp.setPos(powerUp.x - powerUp.speed, powerUp.y, e);
};

PowerUp.prototype.powerUpPlayer = function(player, up) {
	// console.log('powerUpPlayer');
	var attacks = player.obj.attacks;
	for (var i = attacks.length - 1; i >= 0; i--) {
		var attack = attacks[i];
		if (attack.getFilename(true) + 'Up' == up.obj.name) attack.levelStats(attack.delay, attack.speed, attack.level + 1);
	}
};