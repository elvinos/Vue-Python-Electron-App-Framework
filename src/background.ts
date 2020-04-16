'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'

const isDevelopment = process.env.NODE_ENV !== 'production'

//***************************************************************************
//****** Python Compiler Methods
//***************************************************************************

const path = require('path')
const sh = require("shelljs");  // https://github.com/shelljs/shelljs
const { spawn } = require('child_process');
let urlExists = require('url-exists');

// Python File Structure
const PY_BUILD_FOLDER = 'dist/'
const PY_SCRIPT_FOLDER = './'
const PY_MODULE = 'app' // without .py suffix

const pathToPy = path.join(
   __dirname,
  isDevelopment ? '../'  + PY_MODULE + '.py' : '../' + PY_BUILD_FOLDER + PY_MODULE,
);

let pyProc: any

const createPyProc = () => {
  let script = pathToPy;
  let port = 3000

  console.log('script', script, 'port', port)

  // enhancement to provide Python with critical env vars
  let extra_env = {
    NODE_ENV: process.env.NODE_ENV,
    LANG: 'en_AU.UTF-8',
    PYTHONUNBUFFERED: '1',
    PYTHONDONTWRITEBYTECODE: '1'
  }
  // makes a copy of existing env, such that it is, and adds to it
  let options = {
    env : Object.assign({}, process.env, extra_env),
    cwd: sh.pwd().stdout
  }
  let python = isDevelopment ? sh.which('python').stdout : pathToPy
  pyProc = spawn(python, [script, port], options)
  // pyProc = spawn(pathToPy,)
  //
  if (pyProc != null) {
    // console.log('child process success on port ' + port)
    console.log('child process success on port ' + port)
  }

  pyProc.stdout.on('data', function (data: any) {
    // console.log('stdout: ' + data.toString());
    console.log('Python: ' + data.toString().trim());
  });
  pyProc.stderr.on('data', function (data: any) {
    // console.log('stderr: ' + data.toString());
    console.log('Python: ' + data.toString().trim());
  });

  pyProc.on('exit', function (code: any) {
    if (code == null)
      console.log('python exited with null code')
    else {
      // console.log('child process exited with code ' + code.toString());
      console.log('child process exited with code ' + code.toString());
    }
    if (win == null)
      console.log('Cannot send a message to renderer window that python has exited')
    else
      win.webContents.send('python_exited_notice')  // for all other cases
  });

}

const exitPyProc = () => {
  pyProc.kill()
}

app.on('ready', createPyProc)

app.on('window-all-closed', exitPyProc)

let eelExists = false
function checkEel() {
  urlExists('http://localhost:9000/eel.js', function (err : any, exists: any) {
    console.log(exists); // false
    eelExists = exists
  });
}

//***************************************************************************
//******Electron Compiler Methods
//***************************************************************************
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600, webPreferences: {
    nodeIntegration: true
  } })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', async () => {
//   if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

//   }
//   createWindow()
// })

let timer = setInterval(eelCheckLoop, 500);

function eelCheckLoop() {
  if(eelExists) {
    clearInterval(timer);
    // app.on('ready', createWindow)
    createWindow()
    return;
  }
  checkEel()
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        console.log('Exiting')
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      console.log('Exiting')
      app.quit()
    })
  }
}
