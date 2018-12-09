function Enemy() {}

Enemy.prototype.enemies = [new Mover('ship01', 0, 0, 4), new Mover('ship02'), new Mover('ship03', 0, 0, 10)];
Enemy.prototype.patterns = ['straight', 'upSlant', 'downSlant'];
Enemy.prototype.SLANT_D = Math.sin(45);

Enemy.prototype.get = function() {
	return Object.create(Enemy.prototype.enemies[Math.floor(Math.random() * Enemy.prototype.enemies.length)]);
};

Enemy.prototype[Enemy.prototype.patterns[0]] = function(enemy, e) {
	// console.log('straight');
	return enemy.setPos(enemy.x - enemy.speed, enemy.y, e);
};

Enemy.prototype[Enemy.prototype.patterns[1]] = function(enemy, e) {
	// console.log('upSlant');
	return Enemy.prototype.slant(enemy, e, 1);
};

Enemy.prototype[Enemy.prototype.patterns[2]] = function(enemy, e) {
	// console.log('downSlant');
	return Enemy.prototype.slant(enemy, e, -1);
};

Enemy.prototype.slant = function(enemy, e, d) {
	// console.log('slant');
	return enemy.setPos(enemy.x - (Enemy.prototype.SLANT_D * enemy.speed), enemy.y - (Enemy.prototype.SLANT_D * d * enemy.speed), e);
};