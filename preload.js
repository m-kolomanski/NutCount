const { contextBridge, ipcRenderer} = require('electron')

window.dbmgr = require("./js/dbmgr.js");
const fs = require('fs')

fs.access('./nuts.db', fs.F_OK, (err) => {
	const dbmgr = require('./js/dbmgr.js');
		
	if (err) {
		console.log("Creating DB")
		let db = dbmgr.loadDatabase()
		dbmgr.createNewDatabase()
	} else {
		console.log("DB exists")
	}
	
});

window.db = dbmgr.loadDatabase();