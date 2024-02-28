const { contextBridge, ipcRenderer} = require('electron');
const path = require('path')

const Dbmgr = require(path.join(__dirname, "/components/Dbmgr"));
const Navbar = require(path.join(__dirname, "/components/Navbar"));
const PopupModal = require(path.join(__dirname, "/components/Popup"));
const Datatable = require(path.join(__dirname, "/components/Datatable"));

window.Log = {
    debug: (msg) => {
        ipcRenderer.invoke('log', msg, "DEBG");
    },
    info: (msg) => {
        ipcRenderer.invoke('log', msg, "INFO");
    },
    warn: (msg) => {
        ipcRenderer.invoke('log', msg, "WARN");
    },
    error: (msg) => {
        ipcRenderer.invoke('log', msg, "ERRR");
    }
}

window.Log.info('---- INITIALIZING APPLICATION ----');

window.fs = require('fs');
window.path = require('path');

window.dbmgr = new Dbmgr();

window.locale = require(path.join(__dirname, "/../assets/locale/", `${window.dbmgr.getConfig('lang')}.json`));
window.srcDirname = __dirname;
window.assetsDirname = path.join(__dirname, "../");

window.customElements.define('top-navbar', Navbar);
window.customElements.define('popup-modal', PopupModal);
window.customElements.define("data-table", Datatable);

const App = require(path.join(__dirname, "/components/App"));

new App();