function ContentManager() {
	// console.log('ContentManager');
	this.view = View.prototype;
	this.setPaths();
	this.loadImages();
	this.loadSounds();
}

ContentManager.prototype.setPaths = function() {
	this.BASE_PATH = 'assets/';
	this.IMAGE_PATH = this.BASE_PATH + 'images/';
	this.SOUND_PATH = this.BASE_PATH + 'sounds/';
};

ContentManager.prototype.loadImages = function() {
	// console.log('loadImages');
	this.images = {
		bombUp: this.makeImage('bombUp.png'),
		laserUp: this.makeImage('laserUp.png'),
		shieldUp: this.makeImage('shieldUp.png'),
		dischargeUp: this.makeImage('dischargeUp.png'),
		smartBombUp: this.makeImage('smartBombUp.png'),
		tractorBeamUp: this.makeImage('tractorBeamUp.png'),
		ship00: this.makeImage('ship00.png'),
		ship01: this.makeImage('ship01.png'),
		ship02: this.makeImage('ship02.png'),
		ship03: this.makeImage('ship03.png'),
		laser01: this.makeImage('laser01.png')
	};
};

ContentManager.prototype.loadSounds = function() {
	// console.log('loadSounds');
	this.sounds = {};
};

ContentManager.prototype.getImage = function(key) {
	// console.log('getImage');
	return this.getAsset('images', key);
};

ContentManager.prototype.getSound = function(key) {
	// console.log('getSound');
	return this.getAsset('sounds', key);
};

ContentManager.prototype.getAsset = function(type, key) {
	// console.log('getAsset');
	if (!this[type] || !this[type][key]) return null;
	return this[type][key].cloneNode(true);
};

ContentManager.prototype.makeImage = function(file) {
	var e = this.view.makeElement('img');
	e.src = this.IMAGE_PATH + file;
	return e;
};