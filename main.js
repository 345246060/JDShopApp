const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let pythonServer = null;
let loginWin = null;
let mainWin = null;

// 启动本地 Python FastAPI 服务
function startPythonServer() {
  const pythonPath = path.join(__dirname, 'python', 'pyenv', 'bin', 'python3');
  const scriptPath = path.join(__dirname, 'python', 'main.py');

  pythonServer = spawn(pythonPath, [scriptPath]);

  pythonServer.stdout.on('data', (data) => {
    console.log(`[Python] ${data}`);
  });

  pythonServer.stderr.on('data', (data) => {
    console.error(`[Python Error] ${data}`);
  });

  pythonServer.on('close', (code) => {
    console.log(`[Python] exited with code ${code}`);
  });
}

// 关闭所有窗口并退出应用
function quitAll() {
  if (pythonServer) {
    pythonServer.kill();
    pythonServer = null;
  }
  app.quit();
}

function createLoginWindow() {
  loginWin = new BrowserWindow({
    width: 600,
    height: 300,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  loginWin.loadFile('index.html');
  startPythonServer();

  loginWin.on('closed', () => {
    loginWin = null;
    checkShouldQuit();
  });
}

function createMainWindow() {
  mainWin = new BrowserWindow({
    width: 1024,
    height: 768,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWin.loadFile('main.html');

  mainWin.on('closed', () => {
    mainWin = null;
    checkShouldQuit();
  });
}

// 只要所有窗口都关闭，就退出整个程序
function checkShouldQuit() {
  if (!loginWin && !mainWin) {
    quitAll();
  }
}

// 启动应用
app.whenReady().then(createLoginWindow);

// 登录成功事件：关闭登录窗口 → 打开主窗口
ipcMain.on('login', (event, loginData) => {
  console.log('收到登录数据：', loginData);

  if (loginWin) {
    loginWin.close();
    loginWin = null;
  }

  if (!mainWin) {
    createMainWindow();
  }
});

// 非 macOS 系统，关闭所有窗口后退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    quitAll();
  }
});

// macOS 点击 Dock 图标时重新打开窗口
app.on('activate', () => {
  if (!loginWin && !mainWin) {
    createLoginWindow();
  }
});