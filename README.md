# NewbiesDev Mobile App & Developer Portal

Internal developer portal and Android application for Softbrick and the NewbiesTeam to upload custom ROMs, screenshots, guides, modules, and changelogs directly from their phones.

> **Private Repository**: [`zcyrl/newbiesteam-dev`](https://github.com/zcyrl/newbiesteam-dev)

---

## 📦 Direct APK Downloads

Download the compiled Dev APK directly from this repository page or via the high-speed in-app CDN:

| Package | Version | Size | Direct GitHub Download | In-App CDN Mirror |
| :--- | :--- | :--- | :--- | :--- |
| **`NewbiesDev.apk`** | Latest (`v1.1.0`) | 5.65 MB | [⬇️ Download `NewbiesDev.apk`](https://github.com/zcyrl/newbiesteam-dev/raw/main/NewbiesDev.apk) | [⚡ Surge CDN](https://newbiesteam.surge.sh/assets/dev/NewbiesDev.apk) |
| **`NewbiesDev-v1.1.0.apk`** | `v1.1.0` (Build 2) | 5.65 MB | [⬇️ Download `NewbiesDev-v1.1.0.apk`](https://github.com/zcyrl/newbiesteam-dev/raw/main/NewbiesDev-v1.1.0.apk) | [⚡ Surge CDN](https://newbiesteam.surge.sh/assets/dev/NewbiesDev-v1.1.0.apk) |

* **GitHub Release Page**: Available under [Releases `v1.1.0`](https://github.com/zcyrl/newbiesteam-dev/releases/tag/v1.1.0).
* **In-App Delivery**: If you already have the Dev App installed, open the app, tap **Dev APK Updates**, and tap **Download & Install Dev APK** to update seamlessly without entering GitHub credentials.

---

## What's New in v1.1.0

* **Direct In-App Dev APK Updates**: Download and install latest Dev App builds directly within the app without needing GitHub authentication.
* **Full Data Sync**: Synchronized with official Newbies v1.2.2 public releases and brand assets.
* **Dedicated Dev APK Section**: Filter and view internal releases, build numbers, and changelogs.
* **Dual-Channel Delivery**: Secure in-app APK delivery powered by Android `DownloadManager` and high-speed Surge CDN fallback.
* **Native Splash & Brand Icons**: Integrated official adaptive icons and dark theme styling.

---

## 5 Developer Access Keys (32 Characters)

See `keys.txt` for key credentials.

| Role | Key Holder | Access Level | Auto-Push Behavior |
| :--- | :--- | :--- | :--- |
| **Master Admin** | **Softbrick** | **Full Access** | 🚀 **Instant Direct Auto-Push** to live site on Surge. No terminal confirmation needed. |
| **Team Member 1** | Team Dev 1 | Moderated | ⏳ ROMs, Guides, Screenshots, Tools go to terminal queue. **News & Changelogs post live immediately**. |
| **Team Member 2** | Team Dev 2 | Moderated | ⏳ ROMs, Guides, Screenshots, Tools go to terminal queue. **News & Changelogs post live immediately**. |
| **Team Member 3** | Team Dev 3 | Moderated | ⏳ ROMs, Guides, Screenshots, Tools go to terminal queue. **News & Changelogs post live immediately**. |
| **Team Member 4** | Team Dev 4 | Moderated | ⏳ ROMs, Guides, Screenshots, Tools go to terminal queue. **News & Changelogs post live immediately**. |

---

## How to Install & Run

### 1. Native Android Dev APK
Download `NewbiesDev-v1.1.0.apk` directly inside the app or from the private repository release.
* Offline embedded UI loaded directly from `file:///android_asset/index.html`.
* Native camera and file picker for screenshot uploads (`WebChromeClient.onShowFileChooser`).
* Built-in `DownloadManager` auto-installer bridge for silent in-app updates.

### 2. Standalone Web / PWA
* Open `https://newbiesteam.surge.sh` or local network server.
* Add to home screen for full-screen PWA experience.

### 3. Reviewing Submissions in Terminal
Run `server` -> choose `[P] 🔔 Pending Team Requests` to approve `[A]` or reject `[R]` moderated uploads.
