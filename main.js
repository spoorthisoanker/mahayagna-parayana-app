const { app, BrowserWindow, ipcMain, screen, dialog } = require('electron');
const path = require('path');

// Prevent multiple instances — ensures the NSIS installer can always close the running app
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

let operatorWindow = null;
let projectorWindow = null;

function createOperatorWindow() {
  var primaryDisplay = screen.getPrimaryDisplay();
  var screenHeight = primaryDisplay.workAreaSize.height;
  var screenWidth = primaryDisplay.workAreaSize.width;
  var operatorWidth = Math.round(screenWidth / 3);

  operatorWindow = new BrowserWindow({
    width: operatorWidth,
    height: screenHeight,
    x: 0,
    y: 0,
    resizable: true,
    title: 'Mahāyajña Parayana App',
    webPreferences: {
      preload: path.join(__dirname, 'src', 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  operatorWindow.loadFile(path.join(__dirname, 'src', 'operator.html'));

  operatorWindow.on('closed', function() {
    operatorWindow = null;
    if (projectorWindow) {
      projectorWindow.close();
    }
  });
}

async function openProjector() {
  if (projectorWindow) {
    projectorWindow.focus();
    return;
  }

  var displays = screen.getAllDisplays();
  var primaryDisplay = screen.getPrimaryDisplay();
  var externalDisplays = displays.filter(function(d) {
    return d.id !== primaryDisplay.id;
  });

  var targetDisplay = null;

  if (externalDisplays.length === 1) {
    var result = await dialog.showMessageBox(operatorWindow, {
      type: 'question',
      buttons: ['Open', 'Cancel'],
      defaultId: 0,
      title: 'Open Projector',
      message: 'Open projector on ' + externalDisplays[0].label + ' (' + externalDisplays[0].size.width + 'x' + externalDisplays[0].size.height + ')?'
    });
    if (result.response === 0) {
      targetDisplay = externalDisplays[0];
    }
  } else if (externalDisplays.length > 1) {
    var labels = externalDisplays.map(function(d, i) {
      return (i + 1) + '. ' + d.label + ' (' + d.size.width + 'x' + d.size.height + ')';
    });
    var result = await dialog.showMessageBox(operatorWindow, {
      type: 'question',
      buttons: labels.concat(['Cancel']),
      defaultId: 0,
      title: 'Select Display',
      message: 'Which display should show the projector?'
    });
    if (result.response < externalDisplays.length) {
      targetDisplay = externalDisplays[result.response];
    }
  } else {
    var result = await dialog.showMessageBox(operatorWindow, {
      type: 'question',
      buttons: ['Open Windowed', 'Cancel'],
      defaultId: 0,
      title: 'No External Display',
      message: 'No external display found. Open projector as a window on this screen?'
    });
    if (result.response !== 0) {
      return;
    }
  }

  var windowOptions = {
    title: 'Mahāyajña Parayana App',
    webPreferences: {
      preload: path.join(__dirname, 'src', 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  };

  if (targetDisplay) {
    windowOptions.x = targetDisplay.bounds.x;
    windowOptions.y = targetDisplay.bounds.y;
    windowOptions.fullscreen = true;
    windowOptions.frame = false;
  } else {
    windowOptions.width = 1280;
    windowOptions.height = 720;
  }

  projectorWindow = new BrowserWindow(windowOptions);
  projectorWindow.loadFile(path.join(__dirname, 'src', 'projector.html'));

  if (targetDisplay) {
    projectorWindow.setFullScreen(true);
  }

  projectorWindow.on('closed', function() {
    projectorWindow = null;
    if (operatorWindow) {
      operatorWindow.webContents.send('projector-status', { open: false });
    }
  });

  projectorWindow.webContents.on('did-finish-load', function() {
    if (operatorWindow) {
      operatorWindow.webContents.send('projector-status', { open: true });
    }
  });
}

// IPC routing: operator → projector
var projectorChannels = [
  'render-page', 'syllable-update', 'animation-reset',
  'countdown', 'display-mode', 'spm-change',
  'show-instruction', 'dismiss-instruction',
  'verse-zoom', 'theme'
];

projectorChannels.forEach(function(channel) {
  ipcMain.on(channel, function(event, data) {
    if (projectorWindow) {
      projectorWindow.webContents.send(channel, data);
    }
  });
});

// Projector open/close
ipcMain.on('open-projector', function() {
  openProjector();
});

ipcMain.on('close-projector', function() {
  if (projectorWindow) {
    projectorWindow.close();
  }
});

// App lifecycle
app.whenReady().then(function() {
  createOperatorWindow();
});

app.on('window-all-closed', function() {
  app.quit();
});
