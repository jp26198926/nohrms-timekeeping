import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron'
import path from 'path'
import os from 'os'

//jp code
import fs from 'fs'
const appDirectory = app.getPath('userData'); // Get the app's directory
const failedFolderPath = path.join(appDirectory, 'log-failed'); // Create "failed" folder inside the app directory
const successFolderPath = path.join(appDirectory, 'log-success'); // Create "success" folder inside the app directory
const notFoundFolderPath = path.join(appDirectory, 'log-not-found'); // Create "not found" folder inside the app directory
const rejectedFolderPath = path.join(appDirectory, 'log-rejected'); // Create "rejected" folder inside the app directory

if (!fs.existsSync(failedFolderPath)) {
  fs.mkdirSync(failedFolderPath);
}

if (!fs.existsSync(successFolderPath)) {
  fs.mkdirSync(successFolderPath);
}

if (!fs.existsSync(notFoundFolderPath)) {
  fs.mkdirSync(notFoundFolderPath);
}

if (!fs.existsSync(rejectedFolderPath)) {
  fs.mkdirSync(rejectedFolderPath);
}

ipcMain.on('saveToFileFailed', (event, content) => {
  // const currentDate = new Date().toISOString().split('T')[0];
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const filePath = path.join(failedFolderPath, `${year}-${month}-${day}.txt`);

  if (fs.existsSync(filePath)) {
    // If the file already exists, append data to it
    fs.appendFileSync(filePath, `\n${content}`);
  } else {
    // If the file doesn't exist, create it with the content
    fs.writeFileSync(filePath, content);
  }
});

ipcMain.on('saveToFileSuccess', (event, content) => {
  // const currentDate = new Date().toISOString().split('T')[0];
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const filePath = path.join(successFolderPath, `${year}-${month}-${day}.txt`);

  if (fs.existsSync(filePath)) {
    // If the file already exists, append data to it
    fs.appendFileSync(filePath, `\n${content}`);
  } else {
    // If the file doesn't exist, create it with the content
    fs.writeFileSync(filePath, content);
  }
});

ipcMain.on('saveToFileNotFound', (event, content) => {
  // const currentDate = new Date().toISOString().split('T')[0];
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const filePath = path.join(notFoundFolderPath, `${year}-${month}-${day}.txt`);

  if (fs.existsSync(filePath)) {
    // If the file already exists, append data to it
    fs.appendFileSync(filePath, `\n${content}`);
  } else {
    // If the file doesn't exist, create it with the content
    fs.writeFileSync(filePath, content);
  }
});

ipcMain.on('saveToFileRejected', (event, content) => {
  // const currentDate = new Date().toISOString().split('T')[0];
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const filePath = path.join(rejectedFolderPath, `${year}-${month}-${day}.txt`);

  if (fs.existsSync(filePath)) {
    // If the file already exists, append data to it
    fs.appendFileSync(filePath, `\n${content}`);
  } else {
    // If the file doesn't exist, create it with the content
    fs.writeFileSync(filePath, content);
  }
});

//end of jp code


// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

let mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    fullscreen: true, // This makes the window open in full-screen mode
    webPreferences: {
      webSecurity: false,
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-webpack/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      //mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

