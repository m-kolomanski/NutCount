const { contextBridge, ipcRenderer} = require('electron');
const path = require('path')
const Dbmgr = require(path.join(__dirname, "/components/Dbmgr"));


window.fs = require('fs');
window.path = require('path');
window.dbmgr = new Dbmgr();
//window.utils = require(path.join(__dirname, "/js/utils.js"))

window.ipcRenderer = ipcRenderer;