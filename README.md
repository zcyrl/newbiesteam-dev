# NewbiesDev Mobile App & Developer Portal

Internal developer portal and Android application for Softbrick and the NewbiesTeam to upload custom ROMs, screenshots, guides, modules, and changelogs directly from their phones.

> **Repository**: Private GitHub repository at [`zcyrl/newbiesteam-dev`](https://github.com/zcyrl/newbiesteam-dev). Access is restricted to authorized team members.

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
