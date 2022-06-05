const { contextBridge, ipcRenderer} = require('electron')

window.dbmgr = require("./js/dbmgr.js");
window.db = dbmgr.loadDatabase();