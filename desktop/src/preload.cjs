const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("vargeoDesktop", {
  isDesktop: true,
  platform: process.platform,
  version: () => ipcRenderer.invoke("desktop:version"),
  onDownloadComplete: (callback) => {
    if (typeof callback !== "function") return;
    ipcRenderer.on("download-complete", (_event, filePath) => callback(filePath));
  }
});
