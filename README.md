# m-hash (Electron Desktop App)

Cross-platform desktop wrapper for the **frontend-mock** web app, built with **Electron + Vite + React**.  
Runs on **Windows, macOS, and Linux** with system API access for analytics and future backend integration.

---

## 🚀 Development

1. **Install dependencies**
   ```bash
   cd electron
   npm install
   ```

2. **Run in dev mode (Electron + Vite)**

   ```bash
   npm run dev
   ```

   * Vite runs the React frontend on `localhost:8080`
   * Electron launches a desktop window pointing to it

---

## 📦 Build

To generate production binaries for your OS:

```bash
npm run build
```

Artifacts will be created in the `dist/` folder:

* `.exe` → Windows
* `.dmg` / `.pkg` → macOS
* `.AppImage` / `.deb` / `.rpm` → Linux

---

## 🛠 Architecture

* **Frontend** → React + Vite (lives in `/frontend-mock`)
* **Electron main process** → `/electron/main.js`
* **IPC bridge** → allows frontend to request system info / backend services
* **Backend (future)** → replace mock data with Node.js APIs or native binaries

---

## 🔌 Example IPC Usage

Request system info from frontend:

```ts
const info = await window.electron.invoke("get-system-info");
console.log(info);
```

Handler in `main.js`:

```js
import { ipcMain } from "electron";
import os from "os";

ipcMain.handle("get-system-info", async () => ({
  platform: os.platform(),
  cpus: os.cpus().length,
  freeMem: os.freemem(),
}));
```

---

## 📋 Notes

* Runs on all major platforms (Windows / macOS / Linux).
* Mock data will gradually be replaced with backend processes.
* Uses [electron-builder](https://www.electron.build/) for packaging.








