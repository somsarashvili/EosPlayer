const {
  contextBridge,
  ipcRenderer,
} = require('electron');

contextBridge.exposeInMainWorld(
  'MainProcessAPI',
  {
    defaultDownloadPath: require('@electron/remote').app.getPath('documents') + '\\Eos',
    on: (channel, listener) => ipcRenderer.on(channel, listener),
    once: (channel, listener) => ipcRenderer.once(channel, listener),
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
    sendSync: (channel, ...args) => ipcRenderer.sendSync(channel, ...args),
    isFullScreen: () => require('@electron/remote').getCurrentWindow().isFullScreen(),
    isElectron: () => window && window.process && window.process.type,
    close: () => require('@electron/remote').getCurrentWindow().close(),
    relaunch: () => {
      require('@electron/remote').app.relaunch();
      require('@electron/remote').app.exit();
    },
    getEnvironment: () => process.env.Environment,
    setTitleBar: () => {
      // const { Titlebar, Color } = require('custom-electron-titlebar');
      // //if (!require('@electron/remote').getCurrentWindow().isFullScreen()) {
      //   const MyTitleBar = new Titlebar({
      //     backgroundColor: Color.fromHex('#394146'),
      //     menu: null,
      //     icon: 'favicon.png',
      //   });
      //   document.body.classList.add('with-titlebar');
      // //}
    },
    getWebTorrentHealthModule: () => require('webtorrent-health'),
    showOpenDialog: async () => (await require('@electron/remote').dialog.showOpenDialog({
      properties: ['openDirectory']
    })).filePaths[0]
  }
);
