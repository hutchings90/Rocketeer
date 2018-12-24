function RocketeerController() {
	// console.log('RocketeerController');
	this.gamepadReadInterval = null;
	this.rocketeer = new Rocketeer();
	this.view = View.prototype;
	this.gpInputs = [{ axis: 0, buttons: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }];
	this.state = '';
	this.mainScreen = this.view.getElement('#main-screen');
	this.pauseScreen = this.view.getElement('#pause-screen');
	this.endScreen = this.view.getElement('#end-screen');
	this.mainMenu = this.view.getElement('#main-menu');
	this.pauseMenu = this.view.getElement('#pause-menu');
	this.endMenu = this.view.getElement('#end-menu');
	this.disruptorE = this.view.getElement('#disruptor');
	this.disruptorE.x = 0;
	this.disruptorE.y = 0;
	this.shieldE = this.view.getElement('#shield');
	this.shieldE.width = 80;
	this.shieldE.height = 80;
	this.activeOption = 0;
	this.processButtons = this.mainMenuButtonProcessor;
	this.axesAfterProcess = this.menuProcessAxes;
	this.move = this.moveMenu;
	this.buttonPressedMax = 16;
	this.buttonPressedMin = 8;
	this.enemyTimer = null;
	this.TICK = 20;
	this.ONE_SECOND = 1000 / this.TICK;
	this.FIVE_SECONDS = this.ONE_SECOND * 5;
	this.FIFTEEN_SECONDS = this.ONE_SECOND * 15;
	this.THIRTY_SECONDS = this.ONE_SECOND * 30;
	this.ticksSinceLastGroup = 0;
	this.ticksToNewGroup = -1;
	this.ticksSinceLastPowerUp = 0;
	this.ticksToNewPowerUp = -1;
	this.ticksSinceUpdate = 0;
	this.playerAttacks = [];
	this.explosions = [];
	this.attackExplosions = [];
	this.start();
}

RocketeerController.prototype.start = function() {
	// console.log('start');
	this.state = 'main-menu';
	this.processButtons = this.mainMenuButtonProcessor;
	this.axesAfterProcess = this.menuProcessAxes;
	this.activeOption = 0;
	this.buttonPressedMax = 16;
	this.buttonPressedMin = 0;
	this.view.removeClassName(this.mainScreen, 'hide');
	this.startPlayer();
	this.activateGamepadRead();
};

RocketeerController.prototype.startPlayer = function() {
	// console.log('startPlayer');
	this.setPlayerPos(50, 280);
	this.rocketeer.player.obj.reset();
};

RocketeerController.prototype.activateGamepadRead = function() {
	// console.log('activateGamepadRead');
	var me = this;
	this.deactivateGamepadRead();
	me.gamepadReadInterval = setInterval(function() {
		me.processExplosions();
		me.readGamepads();
		me.ticksSinceUpdate++;
		me.ticksSinceLastGroup++;
		me.ticksSinceLastPowerUp++;
		if (me.shouldUpdate()) me.update();
	}, me.TICK);
};

RocketeerController.prototype.deactivateGamepadRead = function() {
	// console.log('deactivateGamepadRead');
	clearInterval(this.gamepadReadInterval);
	this.gamepadReadInterval = null;
};

RocketeerController.prototype.readGamepads = function() {
	// console.log('readGamepads');
	var gps = navigator.getGamepads();
	if (!gps[0]) return;
	var gp = gps[0];
	this.processAxes(gp);
	this.processButtons(gp.buttons);
};

RocketeerController.prototype.processAxes = function(gp) {
	// console.log('processAxes');
	var dx = 0;
	var dy = 0;
	switch (gp.axes[0]) {
	case -1: dx = -1; break;
	case 1: dx = 1; break;
	}
	switch (gp.axes[1]) {
	case -1: dy = -1; break;
	case 1: dy = 1; break;
	}
	this.axesAfterProcess(gp, dx, dy);
};

RocketeerController.prototype.menuProcessAxes = function(gp, dx, dy) {
	// console.log('menuProcessAxes');
	if (!dx && !dy) gp.axis = 0;
	else if (gp.axis == 16) {
		gp.axis = 8;
		this.moveMenu(dx, dy);
	}
	else {
		if (gp.axis == 0) this.moveMenu(dx, dy);
		gp.axis++;
	}
};

RocketeerController.prototype.playingProcessAxes = function(gp, dx, dy) {
	// console.log('playingProcessAxes');
	this.movePlayer(dx, dy);
};

RocketeerController.prototype.moveMenu = function(dx, dy) {
	// console.log('moveMenu');
	if (this.state == 'pause-menu') this.movePauseMenu(dy);
};

RocketeerController.prototype.movePauseMenu = function(d) {
	// console.log('movePauseMenu');
	var options = this.pauseMenu.children;
	var i = this.activeOption + d;
	if (i < 0) i = options.length - 1;
	if (i > options.length - 1) i = 0;
	this.view.removeClassName(options[this.activeOption], 'active');
	this.view.addClassName(options[i], 'active');
	this.activeOption = i;
};

RocketeerController.prototype.mainMenuButtonProcessor = function(buttons) {
	// console.log('mainMenuButtonProcessor');
	if (buttons[8].pressed && this.processButton(8)) this.endMainMenu();
};

RocketeerController.prototype.endMainMenu = function() {
	// console.log('endMainMenu');
	this.view.addClassName(this.mainScreen, 'hide');
	this.startPlaying();
};

RocketeerController.prototype.startPlaying = function() {
	// console.log('startPlaying');
	this.processButtons = this.playingButtonProcessor;
	this.axesAfterProcess = this.playingProcessAxes;
	this.move = this.movePlayer;
	this.state = 'playing';
	this.buttonPressedMax = 16;
	this.buttonPressedMin = 1;
	this.ticksSinceLastGroup = 0;
	this.ticksToNewGroup = 250;
	this.ticksSinceLastPowerUp = 0;
	this.ticksToNewPowerUp = this.FIFTEEN_SECONDS;
	// this.ticksToNewPowerUp = this.THIRTY_SECONDS;
};

RocketeerController.prototype.playingButtonProcessor = function(buttons) {
	// console.log('playingButtonProcessor');
	var po = this.rocketeer.player.obj;
	var pe = this.rocketeer.player.e;
	for (var i = 0; i < 3; i++) {
		if (buttons[i].pressed) {
			var result = po.attack(i);
			if (result == 'Smart Bomb') {
				var attack = this.getPlayerAttack(result);
				this.explodeAttack(attack.attack, attack.obj.x, attack.obj.y, pe);
			}
			else if (result) this.playerAttacks.push(po.attacks[i].make(po.attacks[i].speed, po.x + pe.width, po.y + (pe.height / 2)));
		}
		else po.tickToClearAttack(i);
	}
	if (buttons[6].pressed || buttons[7].pressed) this.shield();
	else this.dropShield();
	if (buttons[4].pressed || buttons[5].pressed) this.disruptor();
	else this.dropDisruptor();
	if (buttons[3].pressed) this.discharge();
	if (buttons[9].pressed && !this.processButton(9)) this.pause();
};

RocketeerController.prototype.processButton = function(i) {
	// console.log('processButton');
	var ret = false;
	if (this.gpInputs[0].buttons[i] == this.buttonPressedMax) {
		this.gpInputs[0].buttons[i] = this.buttonPressedMin;
		ret = true;
	}
	else {
		if (this.gpInputs[0].buttons[i] == 0) ret = true;
		this.gpInputs[0].buttons[i]++;
	}
	return ret;
};

RocketeerController.prototype.pause = function() {
	// console.log('pause');
	this.state = 'pause-menu';
	this.processButtons = this.pauseMenuButtonProcessor;
	this.axesAfterProcess = this.menuProcessAxes;
	this.move = this.moveMenu;
	this.buttonPressedMax = 16;
	this.buttonPressedMin = 0;
	this.view.removeClassName(this.pauseScreen, 'hide');
	this.activeOption = 0;
	this.view.addClassName(this.pauseMenu.children[0], 'active');
	this.view.removeClassName(this.pauseMenu.children[0], 'selected');
	this.view.removeClassName(this.pauseMenu.children[1], 'active');
	this.view.removeClassName(this.pauseMenu.children[1], 'selected');
};

RocketeerController.prototype.pauseMenuButtonProcessor = function(buttons) {
	// console.log('pauseMenuButtonProcessor');
	if (buttons[8].pressed && this.processButton(8)) {
		switch (this.activeOption) {
		case 0: this.endPause(); break;
		case 1:
			this.view.addClassName(this.pauseScreen, 'hide');
			this.endGame();
			break;
		}
	}
};

RocketeerController.prototype.endPause = function() {
	// console.log('endPause');
	this.view.addClassName(this.pauseScreen, 'hide');
	this.startPlaying();
};

RocketeerController.prototype.restart = function() {
	// console.log('restart');
	var me = this;
	me.processButtons = function() {};
	me.state = 'main-menu';
	me.activeOption = 0;
	me.view.addClassName(me.pauseScreen, 'hide');
	setTimeout(function() {
		me.view.removeClassName(me.mainScreen, 'hide');
		me.processButtons = me.mainMenuButtonProcessor;
	}, 500);
};

RocketeerController.prototype.endMenuButtonProcessor = function(buttons) {
	// console.log('endMenuButtonProcessor');
	if (buttons[8].pressed && this.processButton(8) && this.activeOption == 0) {
		this.view.addClassName(this.endScreen, 'hide');
		this.restart();
	}
};

RocketeerController.prototype.makeEnemyGroup = function() {
	// console.log('makeEnemyGroup');
	this.rocketeer.makeEnemyGroup();
	this.ticksSinceLastGroup = 0;
	this.ticksToNewGroup = Math.floor(Math.random() * this.FIVE_SECONDS) + this.ONE_SECOND;
};

RocketeerController.prototype.makePowerUp = function() {
	// console.log('makePowerUp');
	this.rocketeer.makePowerUp();
	this.ticksSinceLastPowerUp = 0;
	this.ticksToNewPowerUp = Math.floor(Math.random() * this.FIFTEEN_SECONDS);
	// this.ticksToNewPowerUp = Math.floor(Math.random() * this.FIFTEEN_SECONDS) + this.FIFTEEN_SECONDS;
};

RocketeerController.prototype.shouldUpdate = function() {
	// console.log('shouldUpdate');
	return this.state == 'playing' && this.ticksSinceUpdate >= 2;
};

RocketeerController.prototype.update = function() {
	// console.log('update');
	this.ticksSinceUpdate = 0;
	this.movePlayerAttacks();
	this.moveEnemyGroups();
	this.movePowerUps();
	if (this.ticksSinceLastGroup >= this.ticksToNewGroup) this.makeEnemyGroup();
	if (this.ticksSinceLastPowerUp >= this.ticksToNewPowerUp) this.makePowerUp();
};

RocketeerController.prototype.movePlayer = function(dx, dy) {
	// console.log('movePlayer');
	var player = this.rocketeer.player.obj;
	this.setPlayerPos(player.x + (dx * player.speed), player.y + (dy * player.speed));
};

RocketeerController.prototype.setPlayerPos = function(x, y) {
	// console.log('setPlayerPos');
	var player = this.rocketeer.player;
	if (x < 0) x = 0;
	else if (x > 460) x = 460
	player.obj.setPos(x, y, player.e);
};

RocketeerController.prototype.moveEnemyGroups = function() {
	// console.log('moveEnemyGroups');
	var player = this.rocketeer.player;
	var pobj = player.obj;
	var pe = player.e;
	var pl = pobj.x;
	var pt = pobj.y;
	var pr = pl + pe.width;
	var pb = pt + pe.height;
	var groups = this.rocketeer.enemyGroups;
	for (var i = groups.length - 1; i >= 0; i--) {
		var group = groups[i];
		var enemies = group.enemies
		var pattern = group.pattern;
		var x = group.x;
		var y = group.y;
		for (var j = enemies.length - 1; j >= 0; j--) {
			var enemy = enemies[j];
			var obj = enemy.obj;
			var e = enemy.e;
			if (!this.enemyCollidesWithDisruptor(obj, e)) {
				if (Enemy.prototype[e.x > x ? 'straight' : pattern](obj, e) == -1) {
					enemies.splice(j, 1);
					this.view.removeElement(e);
					if (enemies.length < 1) groups.splice(i, 1);
					continue;
				}
			}
			if (this.objectCollidesWithAttack(obj, e)) {
				enemies.splice(j, 1);
				this.view.removeElement(e);
				if (enemies.length < 1) groups.splice(i, 1);
				this.makeSmallExplosion(obj.x, obj.y);
			}
			else if (this.enemyCollidesWithAttackExplosion(obj, e)) {
				enemies.splice(j, 1);
				this.view.removeElement(e);
				if (enemies.length < 1) groups.splice(i, 1);
				this.makeSmallExplosion(obj.x, obj.y);
			}
			else if (!(obj.x > pr || obj.x + e.width < pl || obj.y > pb || obj.y + e.height < pt)) {
				if (this.shieldE.className.includes('hide')) {
					this.makeSmallExplosion(pl, pt);
					this.endGame();
					return;
				}
				else {
					enemies.splice(j, 1);
					this.view.removeElement(e);
					if (enemies.length < 1) groups.splice(i, 1);
					this.makeSmallExplosion(obj.x, obj.y);
					player.obj.depleteShield();
					this.dropShield();
				}
			}
		}
	}
};

RocketeerController.prototype.movePowerUps = function() {
	// console.log('movePowerUps');
	var player = this.rocketeer.player;
	var pobj = player.obj;
	var pe = player.e;
	var pl = pobj.x;
	var pt = pobj.y;
	var pr = pl + pe.width;
	var pb = pt + pe.height;
	var ups = this.rocketeer.powerUps;
	for (var i = ups.length - 1; i >= 0; i--) {
		var up = ups[i];
		var obj = up.obj;
		var e = up.e;
		if (PowerUp.prototype.move(obj, e) == -1) {
			ups.splice(i, 1);
			this.view.removeElement(e);
		}
		else if (!(obj.x > pr || obj.x + e.width < pl || obj.y > pb || obj.y + e.height < pt)) {
			ups.splice(i, 1);
			this.view.removeElement(e);
			PowerUp.prototype.powerUpPlayer(player, up);
		}
		else if (this.objectCollidesWithAttack(obj, e)) {
			this.explodePowerUp(up);
			this.rocketeer.powerUps.splice(i, 1);
			this.view.removeElement(up.e);
		}
	}
};

RocketeerController.prototype.movePlayerAttacks = function() {
	// console.log('movePlayerAttacks');
	var attacks = this.playerAttacks;
	for (var i = attacks.length - 1; i >= 0; i--) {
		var attack = attacks[i];
		if (attack.move() == 1) {
			attacks.splice(i, 1);
			this.view.removeElement(attack.e);
		}
	}
};

RocketeerController.prototype.removeGroups = function() {
	// console.log('removeGroups');
	var groups = this.rocketeer.enemyGroups;
	for (var i = groups.length - 1; i >= 0; i--) {
		var group = groups[i];
		var enemies = group.enemies;
		for (var j = enemies.length - 1; j >= 0; j--)
			this.view.removeElement(enemies[j].e);
		groups.pop();
	}
};

RocketeerController.prototype.removePowerUps = function() {
	// console.log('removePowerUps');
	var powerUps = this.rocketeer.powerUps;
	for (var i = powerUps.length - 1; i >= 0; i--) {
		this.view.removeElement(powerUps[i].e);
		powerUps.pop();
	}
};

RocketeerController.prototype.removePlayerAttacks = function() {
	// console.log('removePowerUps');
	var playerAttacks = this.playerAttacks;
	for (var i = playerAttacks.length - 1; i >= 0; i--) {
		this.view.removeElement(playerAttacks[i].e);
		playerAttacks.pop();
	}
};

RocketeerController.prototype.endGame = function() {
	// console.log('endGame');
	var me = this;
	me.state = 'end-menu';
	me.processButtons = function() {};
	me.axesAfterProcess = me.menuProcessAxes;
	me.activeOption = 0;
	me.buttonPressedMax = 16;
	me.buttonPressedMin = 0;
	setTimeout(function() {
		me.removeGroups();
		me.removePowerUps();
		me.removePlayerAttacks();
		me.startPlayer();
		me.view.removeClassName(me.endScreen, 'hide');
		me.processButtons = me.endMenuButtonProcessor;
	}, 1000);
};

RocketeerController.prototype.objectCollidesWithAttack = function(obj, e) {
	// console.log('objectCollidesWithAttack');
	var attacks = this.playerAttacks;
	var el = obj.x;
	var et = obj.y;
	var er = el + e.width;
	var eb = et + e.height;
	for (var i = attacks.length - 1; i >= 0; i--) {
		var attack = attacks[i];
		if (!(attack.obj.x > er || attack.obj.x + attack.e.width < el || attack.obj.y > eb || attack.obj.y + attack.e.height < et)) {
			attacks.splice(i, 1);
			this.view.removeElement(attack.e);
			if (attack.attack.explodes)
			{
				this.explodeAttack(attack.attack, attack.obj.x, attack.obj.y, this.rocketeer.player.e);
			}
			return true;
		}
	}
	return false;
};

RocketeerController.prototype.enemyCollidesWithAttackExplosion = function(obj, e) {
	// console.log('enemyCollidesWithAttackExplosion');
	var explosions = this.attackExplosions;
	var el = obj.x;
	var et = obj.y;
	var er = el + e.width;
	var eb = et + e.height;
	for (var i = explosions.length - 1; i >= 0; i--) {
		var explosion = explosions[i];
		if (!(explosion.x > er || explosion.x + explosion.e.width < el || explosion.y > eb || explosion.y + explosion.e.height < et)) return true;
	}
	return false;
};

RocketeerController.prototype.explodePowerUp = function(up) {
	// console.log('explodePowerUp');
	var img = ContentManager.prototype.getImage('attackExplosion1');
	var x = up.obj.x + (up.e.width / 2) - (img.width / 2);
	var y = up.obj.y + (up.e.height / 2) - (img.height / 2);
	var explosion = new Explosion(img, x, y);
	this.attackExplosions.push(explosion);
	this.view.addGameObject(explosion.e);
};

RocketeerController.prototype.processExplosions = function() {
	// console.log('processExplosions');
	var explosions = this.explosions;
	for (var i = explosions.length - 1; i >= 0; i--) {
		var explosion = explosions[i];
		if (explosion.ticks++ >= explosion.duration) {
			explosions.splice(i, 1);
			this.view.removeElement(explosion.e);
		}
	}
	var explosions = this.attackExplosions;
	for (var i = explosions.length - 1; i >= 0; i--) {
		var explosion = explosions[i];
		if (explosion.ticks++ >= explosion.duration) {
			explosions.splice(i, 1);
			this.view.removeElement(explosion.e);
		}
	}
};

RocketeerController.prototype.makeSmallExplosion = function(x, y) {
	// console.log('makeSmallExplosion');
	var explosion = new Explosion(ContentManager.prototype.getImage('smallExplosion'), x, y);
	this.explosions.push(explosion);
	this.view.addGameObject(explosion.e);
};

RocketeerController.prototype.explodeAttack = function(attack, xi, yi, e) {
	// console.log('explodeAttack');
	var img = ContentManager.prototype.getImage('attackExplosion' + attack.level);
	var x = xi + (e.width / 2) - (img.width / 2);
	var y = yi + (e.height / 2) - (img.height / 2);
	var explosion = new Explosion(img, x, y);
	this.attackExplosions.push(explosion);
	this.view.addGameObject(explosion.e);
};

RocketeerController.prototype.getPlayerAttack = function(name) {
	// console.log('getPlayerAttack');
	var attacks = this.playerAttacks;
	for (var i = attacks.length - 1; i >= 0; i--) {
		var attack = attacks[i];
		if (attack.attack.name == name) {
			attacks.splice(i, 1);
			this.view.removeElement(attack.e);
			return attack;
		}
	}
	return null;
};

RocketeerController.prototype.shield = function() {
	// console.log('shield');
	if (!this.rocketeer.player.obj.shield(true)) return this.dropShield();
	var shield = this.shieldE;
	var player = this.rocketeer.player;
	var obj = player.obj;
	var e = player.e;
	shield.style.left = (obj.x + (e.width / 2) - (shield.width / 2)) + 'px';
	shield.style.top = (obj.y + (e.height / 2) - (shield.height / 2)) + 'px';
	this.view.removeClassName(shield, 'hide');
};

RocketeerController.prototype.dropShield = function() {
	// console.log('dropShield');
	this.rocketeer.player.obj.shield(false);
	this.view.addClassName(this.shieldE, 'hide');
};

RocketeerController.prototype.disruptor = function() {
	// console.log('disruptor');
	if (!this.rocketeer.player.obj.disruptor(true)) return this.dropDisruptor();
	var disruptor = this.disruptorE;
	var player = this.rocketeer.player;
	var obj = player.obj;
	var e = player.e;
	disruptor.style.left = (obj.x + e.width) + 'px';
	disruptor.style.top = obj.y + 'px';
	this.view.removeClassName(disruptor, 'hide');
};

RocketeerController.prototype.dropDisruptor = function() {
	// console.log('dropDisruptor');
	this.rocketeer.player.obj.disruptor(false);
	this.view.addClassName(this.disruptorE, 'hide');
};

RocketeerController.prototype.discharge = function() {
	// console.log('discharge');
	var player = this.rocketeer.player;
	if (player.obj.discharge()) {
		this.explodeAttack(player.obj.attacks[3], player.obj.x, player.obj.y, player.e);
	}
};

RocketeerController.prototype.enemyCollidesWithDisruptor = function(obj, e) {
	// console.log('enemyCollidesWithDisruptor');
	var disruptor = this.disruptorE;
	if (disruptor.className.includes('hide')) return false;
	return !(obj.x > disruptor.x + disruptor.width || obj.x + e.width < disruptor.x || obj.y > disruptor.y + disruptor.height || obj.y + e.height < disruptor.y);
};