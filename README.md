# NewbiesDev Mobile App & Developer Portal

Internal developer portal and Android application for Softbrick and the NewbiesTeam to upload custom ROMs, screenshots, guides, modules, and changelogs directly from their phones.

> **Public Repository — All Rights Reserved**: This repo is public so the APKs stay downloadable. Copying, reuse or redistribution of any part is not permitted — see [LICENSE](LICENSE).

> **Security notice (2026-11-08):** builds before v3.1.4 used a compromised signing key and a bundled `keys.txt`. Those access keys were revoked. Uninstall old builds and install v3.1.4+ from Releases, then enter a newly issued developer key.

---

## 📦 Install

Get the latest Dev APK from [GitHub Releases](https://github.com/zcyrl/newbiesteam-dev/releases/latest). The previous `NewbiesDev*.apk` files were removed from the repository root; use the release assets.

* **In-App Delivery**: existing installs can use **Dev APK Updates** once the v3.1.4+ release is published.

---

## What's New in v1.1.0

* **Direct In-App Dev APK Updates**: Download and install latest Dev App builds directly within the app without needing GitHub authentication.
* **Full Data Sync**: Synchronized with official Newbies v1.2.2 public releases and brand assets.
* **Dedicated Dev APK Section**: Filter and view internal releases, build numbers, and changelogs.
* **Dual-Channel Delivery**: Secure in-app APK delivery powered by Android `DownloadManager` and high-speed Surge CDN fallback.
* **Native Splash & Brand Icons**: Integrated official adaptive icons and dark theme styling.

---

## Developer Access Keys

Developer access keys are issued privately by the owner and are **never stored in this repository**. The live auth manifest exposes only SHA-256 hashes (`https://newbiesteam.pages.dev/auth-manifest.json`). The old `keys.txt` was removed and all of its keys were revoked on 2026-11-08.

---

## How to Install & Run

### 1. Native Android Dev APK
Download the latest v3.1.4+ APK from GitHub Releases or inside the app.
* Offline embedded UI loaded directly from `file:///android_asset/index.html`.
* Native camera and file picker for screenshot uploads (`WebChromeClient.onShowFileChooser`).
* Built-in `DownloadManager` auto-installer bridge for silent in-app updates.

### 2. Standalone Web / PWA
* Open `https://newbiesteam.surge.sh` or local network server.
* Add to home screen for full-screen PWA experience.

### 3. Reviewing Submissions in Terminal
Run `server` -> choose `[P] 🔔 Pending Team Requests` to approve `[A]` or reject `[R]` moderated uploads.

---

## License

© 2026 Softbrick / NewbiesTeam. **All Rights Reserved.** Public for transparency — not open source. No copying, modification, redistribution, decompilation or derivative works without prior written permission. See [LICENSE](LICENSE).
