function PowerUp() {}

PowerUp.prototype.powerUps = [new Mover('bombUp'), new Mover('dischargeUp'), new Mover('laserUp'), new Mover('shieldUp'), new Mover('smartBombUp'), new Mover('tractorBeamUp')];

PowerUp.prototype.get = function() {
	return Object.create(PowerUp.prototype.powerUps[Math.floor(Math.random() * PowerUp.prototype.powerUps.length)]);
};

PowerUp.prototype.move = function(powerUp, e) {
	// console.log('move');
	return powerUp.setPos(powerUp.x - powerUp.speed, powerUp.y, e);
};