const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => {
    const validChannels = [
      'render-page', 'syllable-update', 'animation-reset',
      'countdown', 'display-mode', 'spm-change',
      'show-instruction', 'dismiss-instruction',
      'open-projector', 'close-projector',
      'verse-zoom', 'theme'
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  on: (channel, callback) => {
    const validChannels = [
      'render-page', 'syllable-update', 'animation-reset',
      'countdown', 'display-mode', 'spm-change',
      'show-instruction', 'dismiss-instruction',
      'projector-status',
      'verse-zoom', 'theme'
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  }
});
