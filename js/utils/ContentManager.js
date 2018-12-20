function ContentManager() {}

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
	var e = View.prototype.makeElement('img');
	e.src = this.IMAGE_PATH + file;
	return e;
};

ContentManager.prototype.BASE_PATH = 'assets/';
ContentManager.prototype.IMAGE_PATH = ContentManager.prototype.BASE_PATH + 'images/';
ContentManager.prototype.SOUND_PATH = ContentManager.prototype.BASE_PATH + 'sounds/';
ContentManager.prototype.images = {
	bombUp: ContentManager.prototype.makeImage('bombUp.png'),
	laserUp: ContentManager.prototype.makeImage('laserUp.png'),
	shieldUp: ContentManager.prototype.makeImage('shieldUp.png'),
	dischargeUp: ContentManager.prototype.makeImage('dischargeUp.png'),
	smartBombUp: ContentManager.prototype.makeImage('smartBombUp.png'),
	tractorBeamUp: ContentManager.prototype.makeImage('tractorBeamUp.png'),
	ship00: ContentManager.prototype.makeImage('ship00.png'),
	ship01: ContentManager.prototype.makeImage('ship01.png'),
	ship02: ContentManager.prototype.makeImage('ship02.png'),
	ship03: ContentManager.prototype.makeImage('ship03.png'),
	laser01: ContentManager.prototype.makeImage('laser01.png'),
	smartBomb1: ContentManager.prototype.makeImage('smartBomb1.gif'),
	smartBomb2: ContentManager.prototype.makeImage('smartBomb2.gif'),
	smartBomb3: ContentManager.prototype.makeImage('smartBomb3.gif')
};
ContentManager.prototype.sounds = {};