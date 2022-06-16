const { contextBridge, ipcRenderer} = require('electron')

window.dbmgr = require("./js/dbmgr.js");
window.fs = require('fs')

fs.access('./db/nuts.db', fs.F_OK, (err) => {
	const dbmgr = require('./js/dbmgr.js');
		
	if (err) {
		let db = dbmgr.loadDatabase();
		dbmgr.createNewDatabase();
		window.first_time = true;
	} else {
		window.first_time = false;
	}
});

window.db = dbmgr.loadDatabase();
try {
	window.nuts = require("./db/nuts.json");
} catch (error) { }
