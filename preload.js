import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('dbmgr', {
  call: (method, ...args) => ipcRenderer.invoke('db:operation', method, ...args)
});