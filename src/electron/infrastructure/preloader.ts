const {
  contextBridge,
  ipcRenderer,
  remote
} = require('electron');
const { Titlebar, Color } = require('custom-electron-titlebar');
(() => {

  function on(channel, listener) {
    return ipcRenderer.on(channel, listener);
  }
  function once(channel, listener) {
    return ipcRenderer.once(channel, listener);
  }
  function send(channel, ...args) {
    return ipcRenderer.send(channel, ...args);
  }
  function sendSync(channel, ...args) {
    return ipcRenderer.sendSync(channel, ...args);
  }
  function isFullScreen() {
    return remote.getCurrentWindow().isFullScreen();
  }
  function isElectron() {
    return window && window.process && window.process.type;
  }
  function close() {
    remote.getCurrentWindow().close();
  }
  function relaunch() {
    remote.app.relaunch();
    remote.app.exit();
  }
  function getEnvironment() {
    return process.env.Environment;
  }
  function setTitleBar() {
    if (!isFullScreen()) {
      const MyTitleBar = new Titlebar({
        backgroundColor: Color.fromHex('#394146'),
        menu: null,
        icon: 'favicon.png',
      });
      document.body.classList.add('with-titlebar');
    }
  }

  function getWebTorrentHealthModule() {
    return require('webtorrent-health');
  }

  contextBridge.exposeInMainWorld(
    'MainProcessAPI',
    {
      on,
      once,
      send,
      sendSync,
      isFullScreen,
      isElectron,
      close,
      relaunch,
      getEnvironment,
      setTitleBar,
      getWebTorrentHealthModule
    }
  );
})();
