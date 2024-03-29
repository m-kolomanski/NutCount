const { contextBridge, ipcRenderer} = require('electron');
const path = require('path')

window.dbmgr = require(path.join(__dirname, "/js/dbmgr.js"));
window.fs = require('fs');
window.path = require('path');
window.utils = require(path.join(__dirname, "/js/utils.js"))

window.ipcRenderer = ipcRenderer;

fs.access(path.join(__dirname, './db/nuts.db'), fs.F_OK, (err) => {
	const dbmgr = require(path.join(__dirname, '/js/dbmgr.js'));
		
	if (err) {
		let db = dbmgr.loadDatabase();
		dbmgr.createNewDatabase();
		window.first_time = true;
	} else {
		window.first_time = false; /// add true for temp for dev
 	}
});

window.db = dbmgr.loadDatabase();
try {
	window.nuts = require(path.join(__dirname, "./db/nuts.json"));
} catch (error) { };
