"use strict";

import { app, protocol, BrowserWindow, ipcMain, shell, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import ElectronStore from "electron-store";

const isDevelopment = process.env.NODE_ENV !== "production";
const store = new ElectronStore();
const fs = require("fs");
const iconv = require('iconv-lite');
let win: BrowserWindow;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Required for Spectron testing
      enableRemoteModule: true,
      webSecurity: false,

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env
        .ELECTRON_NODE_INTEGRATION as unknown as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  win.setMenu(null);

  // リンククリック時に OS のデフォルトブラウザで開く
  const handleUrlOpen = (event: Event, url: string) => {
    event.preventDefault();
    shell.openExternal(url);
  };
  // リンククリック時のイベントハンドラを登録
  win.webContents.on('will-navigate', handleUrlOpen);
  win.webContents.on('new-window', handleUrlOpen);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  // regionCode の初期値を JP に設定する
  const region = store.get("regionCode", "")
  if (region == "") store.set("regionCode", "JP")
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

//**************************************************
//* IPC通信（MAIN)
//**************************************************

// Google API KEY管理
ipcMain.handle("get-googleApiKey", (event, arg) => {
  const googleApiKey = store.get("googleApiKey", "")
  return googleApiKey
})

ipcMain.handle("set-googleApiKey", (event, arg) => {
  console.log(arg)
  store.set("googleApiKey", arg)
})

// YTScouter API KEY管理
ipcMain.handle("get-scouterApiKey", (event, arg) => {
  const googleApiKey = store.get("scouterApiKey", "")
  return googleApiKey
})

ipcMain.handle("set-scouterApiKey", (event, arg) => {
  store.set("scouterApiKey", arg)
})

// Hash値 管理
ipcMain.handle("get-digest", (event, arg) => {
  const digest = store.get("digest", "")
  return digest
})

ipcMain.handle("set-digest", (event, arg) => {
  store.set("digest", arg)
})

// 国コード 管理
ipcMain.handle("get-regionCode", (event, arg) => {
  const digest = store.get("regionCode", "")
  return digest
})

ipcMain.handle("set-regionCode", (event, arg) => {
  store.set("regionCode", arg)
})

// CSV出力
ipcMain.handle("output-csv", async (event, data) => {
  const path = dialog.showSaveDialogSync(win, {
    buttonLabel: "保存", // ボタンのラベル
    filters: [
      { name: "ytScouter検索結果", extensions: ["csv"] },
    ],
    properties: [
      "createDirectory", // ディレクトリの作成を許可（macOS用の指定）
    ]
  });

  // キャンセルで閉じた場合
  if (path === undefined) {
    return ({ status: undefined });
  }

  // ファイル内容の返却
  try {
    const encodedData = iconv.encode(data, "UTF-16LE", { addBOM: true });
    fs.writeFileSync(path, encodedData);

    // ファイル保存　成功
    return ({
      status: true,
      path: path
    });
  } catch (error) {
    // ファイル保存　失敗
    return ({
      status: false,
      message: error.message
    });
  }
})