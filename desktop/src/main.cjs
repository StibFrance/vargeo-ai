const { app, BrowserWindow, Menu, shell, dialog, session, ipcMain } = require("electron");
const path = require("node:path");

const PROD_URL = process.env.VARGEO_DESKTOP_URL || "https://vargeo.ai";
let mainWindow = null;

function isTrustedUrl(raw) {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" && (
      url.hostname === "vargeo.ai" ||
      url.hostname === "www.vargeo.ai" ||
      url.hostname.endsWith(".vercel.app")
    );
  } catch {
    return false;
  }
}

function offlineHtml(message = "Connexion à VarGéo.AI impossible.") {
  const escaped = String(message).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>VarGéo.AI — Connexion</title><style>
  *{box-sizing:border-box}body{margin:0;background:#06111d;color:#edf6ff;font-family:Segoe UI,Arial,sans-serif;display:grid;place-items:center;min-height:100vh}
  .card{width:min(620px,92vw);padding:34px;border:1px solid #24435d;border-radius:20px;background:#0a1928;box-shadow:0 24px 70px #0008}
  .brand{font-weight:800;letter-spacing:.08em;color:#f6c945}.title{font-size:30px;margin:10px 0}.muted{color:#9bb0c3;line-height:1.6}
  button{border:0;border-radius:10px;padding:12px 18px;background:#1e84c6;color:#fff;font-weight:700;cursor:pointer;margin-top:16px}
  .small{font-size:12px;color:#71879b;margin-top:16px}</style></head><body><div class="card">
  <div class="brand">VARGÉO.AI</div><div class="title">Connexion au service indisponible</div>
  <p class="muted">${escaped}</p><p class="muted">Vérifiez votre connexion Internet puis relancez la connexion. Vos identifiants restent conservés dans le profil sécurisé de l'application.</p>
  <button onclick="location.href='${PROD_URL}'">Réessayer</button>
  <div class="small">Client Windows officiel — Var Géotechnique / STIB France</div></div></body></html>`;
}

function createMenu() {
  const template = [
    {
      label: "VarGéo.AI",
      submenu: [
        { label: "Accueil", accelerator: "Ctrl+H", click: () => mainWindow?.loadURL(PROD_URL) },
        { label: "Actualiser", accelerator: "Ctrl+R", click: () => mainWindow?.webContents.reload() },
        { type: "separator" },
        { label: "Téléchargements", click: () => shell.openPath(app.getPath("downloads")) },
        { type: "separator" },
        { label: "Quitter", accelerator: "Alt+F4", click: () => app.quit() }
      ]
    },
    {
      label: "Affichage",
      submenu: [
        { role: "zoomIn", label: "Agrandir" },
        { role: "zoomOut", label: "Réduire" },
        { role: "resetZoom", label: "Taille normale" },
        { type: "separator" },
        { role: "togglefullscreen", label: "Plein écran" }
      ]
    },
    {
      label: "Aide",
      submenu: [
        { label: "Ouvrir vargeo.ai dans le navigateur", click: () => shell.openExternal(PROD_URL) },
        { label: "À propos", click: () => dialog.showMessageBox(mainWindow, {
          type: "info",
          title: "À propos de VarGéo.AI",
          message: "VarGéo.AI",
          detail: `Client Windows officiel\nVersion ${app.getVersion()}\nVar Géotechnique / STIB France`
        }) }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function configureSession() {
  const ses = session.fromPartition("persist:vargeo");
  ses.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(["clipboard-read", "clipboard-sanitized-write", "notifications"].includes(permission));
  });

  ses.on("will-download", (_event, item) => {
    item.once("done", (_e, state) => {
      if (state === "completed" && mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("download-complete", item.getSavePath());
      }
    });
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1480,
    height: 940,
    minWidth: 1080,
    minHeight: 720,
    show: false,
    backgroundColor: "#06111d",
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      spellcheck: true,
      partition: "persist:vargeo"
    }
  });

  mainWindow.once("ready-to-show", () => mainWindow.show());

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isTrustedUrl(url)) {
      mainWindow?.loadURL(url);
      return { action: "deny" };
    }
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!isTrustedUrl(url)) {
      event.preventDefault();
      if (/^https?:/i.test(url)) shell.openExternal(url);
    }
  });

  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    console.error("Renderer stopped:", details.reason);
    if (!mainWindow?.isDestroyed()) mainWindow.reload();
  });

  try {
    await mainWindow.loadURL(PROD_URL);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erreur réseau";
    await mainWindow.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(offlineHtml(msg)));
  }
}

app.setAppUserModelId("ai.vargeo.desktop");

app.whenReady().then(async () => {
  configureSession();
  createMenu();
  await createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) void createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("desktop:version", () => app.getVersion());
