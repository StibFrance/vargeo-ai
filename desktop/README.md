# VarGéo.AI Desktop

Client Windows officiel de VarGéo.AI.

## Architecture

Le client Electron charge l'application de production `https://vargeo.ai`.
Cela garantit un moteur unique, une authentification unique et les mêmes données que la version web.

## Développement local

```bash
cd desktop
npm install
npm start
```

Pour viser une autre URL :

```powershell
$env:VARGEO_DESKTOP_URL="https://www.vargeo.ai"
npm start
```

## Générer l'installateur Windows

```bash
cd desktop
npm ci
npm run dist:win
```

Sortie : `desktop/dist/VarGeo-AI-Setup-<version>.exe`.

Le workflow GitHub Actions `build-windows-desktop.yml` génère automatiquement l'installateur sur Windows.
