# NewbiesDev Android APK Project

Standalone native Android app for NewbiesTeam Hub Developers.

## Key Features
* **Zero Cloud Dependency for UI**: All Web UI assets are bundled offline inside `app/src/main/assets/`. It opens in 0ms without waiting for a server.
* **32-Character Key Gatekeeper**: Validates 1 Master Admin key (Softbrick) and 4 Team Developer keys.
* **Floating Plus Button `(+)`**: Author ROMs, upload phone screenshots, publish interactive guides, broadcast news, and add modules.
* **Native Android Camera & Gallery Picker**: Implements `WebChromeClient.onShowFileChooser` so phone photos and screenshots are picked directly via Android system UI and compressed locally to WebP before transmission.
* **Dual Dispatch Engine**: Sends submissions locally to host daemon (`http://localhost:4720/dev-submit`) or worldwide over 24/7 cloud relay (`https://ntfy.sh/nbt_sub_8d0b5336c092d316a726be04`).
* **Moderation Pipeline**:
  * **Master Admin (Softbrick)**: Auto-pushes live to Surge immediately.
  * **Updates & News**: Auto-pushes live immediately for all keys.
  * **Team ROMs / Guides / Tools**: Queued into `.pending-requests.json` for approval in the terminal toolkit (`server` -> `[P]`).

## How to Build the APK

### In Android Studio (Recommended)
1. Open Android Studio.
2. Select **Open** and choose the `dev-app/android` folder.
3. Wait for Gradle sync to complete.
4. Click **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
5. The compiled `.apk` will be generated in `app/build/outputs/apk/debug/app-debug.apk`.
6. Transfer to your phone and install!

### Via Command Line (with Android SDK installed)
```bash
chmod +x ./gradlew
./gradlew assembleDebug
```
The APK will be saved at:
`dev-app/android/app/build/outputs/apk/debug/app-debug.apk`
