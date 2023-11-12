const { contextBridge, ipcRenderer} = require('electron');
const path = require('path')
const Dbmgr = require(path.join(__dirname, "/components/Dbmgr"));
const Navbar = require(path.join(__dirname, "/components/Navbar"));


window.fs = require('fs');
window.path = require('path');
window.dbmgr = new Dbmgr();
window.customElements.define('top-navbar', Navbar);
window.locale = require(path.join(__dirname, "/locale/", `${window.dbmgr.getLocale()}.json`));

window.ipcRenderer = ipcRenderer;