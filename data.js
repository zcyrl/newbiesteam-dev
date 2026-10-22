/* ==========================================================================
   NewbiesTeam content. This is the only file you edit to add or change stuff.

   Add a download: copy one { ... } line inside the right "items" list,
   change name / date / by / url (optional: group, size, image, details).
   An empty url shows "Soon" instead of a link. Keep a comma between entries.
   ========================================================================== */

window.SITE = {
  telegram: "https://t.me/NewbiesTeamBase",
  disclaimer:
    "Flashing ROMs, kernels, recoveries or firmware can brick your phone, wipe your data, void your warranty or break features like banking apps and Play Integrity. Everything here is shared as is, with no guarantee. NewbiesTeam and the uploaders are not responsible for any damage. Read the guides, back up your data and check the file matches your device (GT 20 Pro, X6871).",
  footerDisclaimer:
    "Unofficial community project, not affiliated with Infinix or Transsion. You flash everything at your own risk. We are not responsible for bricked devices, lost data or any other damage.",
  guideWarning:
    "Following this guide is at your own risk. A wrong step or the wrong file can leave your phone unable to boot (bricked) and can erase your data. NewbiesTeam and the uploaders are not responsible for any damage. Back up your data and read every step before you start.",
  guidesNotice:
    "Please dont ask for a video if someone did a guide and recorded his steps it will be provided immediatly other than that shut up.",
  credit: "softbrick",
  feedChannel: "nbt_feed_381d170137023a0496afcd6f",
  devPubKey:
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjzs47655erGZ+dgPyG21Xa9qBqnu7saMjTil7ZNm/qBC8YlkexJw407Sux2sV1858SNNVfZlIVBopnZxSsqvWtSGCzGvsUP6aygzzbjFhwbKgG7VbhsVF+maxnH+rtUKH6iGMzueODvLfO0Ha7AWLC36QknFWZA3C+opW20FN1+UGrBLTLSkO+OxoQ9FJ4P+QwJIcnjQs5HuS4SHjfRtv/ABwYIhZA+/za7224E1c+XmiQXUfofer0Aip3QI8dx/2P0kr+goVigWYnmTaF/GpKlZpimTy0Ff3y9GNHYDGeYB8AtLyqYkjpXbBupS+qFdAg/MFN/9es0dDCYxP9rD+wIDAQAB",
  deletedIds: ["upd-1792268339", "upd-1792269820", "sub-1792347352"],
  roms: [
    {
      title: "Latest",
      items: [
        {
          name: "XOS 16.3 Official",
          date: "2026-10-19",
          by: "TransShit",
          image: "assets/screenshots/rom-1792416360-1792416360555.webp",
          alt: "XOS 16.3 Official for X6871 by TransShit",
          guide: "xos16-local-update",
          url: "https://android.googleapis.com/packages/ota-api/package/744f47c66b26e36501d6106360708d3e4dbd6ac1.zip",
          details: {
            base: "Gt 20 pro",
            changelogs: [
              "Note: If you are getting upgrade problems then use XOS 15.0.3.",
              "Update Version:",
              "X6871-16.3.0.155SP20(OP008PF001AZ)",
              "Android Version:",
              "1. Upgraded from Android 15 to Android 16 for enhanced security, more features, and a better user experience",
              "OS Version:",
              "1. Upgraded from XOS 15.1.2 to XOS 16.3.0 for a smarter user interface and a refreshed look for your device.",
              "Size: 8811.2 MB",
            ],
          },
          screenshots: [
            {
              url: "assets/screenshots/ss-1792419929-1-1792419929312.webp",
              caption: "Banner",
            },
            {
              url: "assets/screenshots/ss-1792419929-2-1792419929500.webp",
              caption: "Homescreen",
            },
          ],
          romId: "rom_xos_16_3_official_41bc",
        },
        {
          name: "OxygenOS 16.0.10 V1",
          date: "upcoming",
          image: "assets/oxygenos16.webp",
          width: 1200,
          height: 675,
          alt: "OxygenOS 16 for X6871",
          url: "",
          note: "Delayed due to XOS 16 Release for unknown date",
          romId: "rom_oxygenos_16_0_10_v_7960",
          by: "MBuTT3178",
          details: {
            changelogs: [],
            bugs: [],
            fixed: [],
          },
        },
      ],
    },
    {
      title: "Port ROMs",
      items: [
        {
          name: "HiOS 16.3",
          date: "2026-10-12",
          by: "MBuTT3178",
          image: "assets/hios16.webp",
          width: 1024,
          height: 576,
          alt: "HiOS 16 for X6871 by MBuTT3178",
          url: "https://drive.google.com/file/d/1zDo3CMhHrQdAMw-MKHCP83taXTb_ojmy/view?usp=drivesdk",
          guide: "flash-port-rom",
          details: {
            base: "Tecno Camon 30 Premier (CL9)",
            changelogs: [
              "Initial release",
              "Added Mecha light loop settings",
              "Added High performance mode and gaming features",
              "Enabled flagship features and animations",
              "Switched to Dolby Atmos",
              "SELinux Enforcing and working FOD",
              "Updated thermal configuration",
            ],
            fixed: ["Fixed out-of-place Dynamic Bar"],
            bugs: [
              "Only default AOD works",
              "144Hz refresh rate unavailable",
              "MemFusion display bug in Settings (still changes properly in DevCheck)",
            ],
          },
          screenshots: [
            {
              url: "assets/screenshots/hios-16-3-1792338026.webp",
              caption: "HiOS banner",
              width: 567,
              height: 1280,
            },
            {
              url: "assets/screenshots/hios-16-3-1792338046.webp",
              caption: "Lockscreen",
              width: 567,
              height: 1280,
            },
            {
              url: "assets/screenshots/hios-16-3-1792338060.webp",
              caption: "Homescreen",
              width: 567,
              height: 1280,
            },
            {
              url: "assets/screenshots/hios-16-3-1792338108.webp",
              caption: "Volume Pannel",
              width: 567,
              height: 1280,
            },
            {
              url: "assets/screenshots/hios-16-3-1792338125.webp",
              caption: "Settings",
              width: 567,
              height: 1280,
            },
            {
              url: "assets/screenshots/hios-16-3-1792338137.webp",
              caption: "Status bar",
              width: 567,
              height: 1280,
            },
            {
              url: "assets/screenshots/hios-16-3-1792338156.webp",
              caption: "Battery Backup",
              width: 567,
              height: 1280,
            },
          ],
          romId: "rom_hios_16_3_3bdc",
        },
        {
          name: "HyperOS 3 V2",
          date: "2026-10-02",
          by: "MBuTT3178",
          image: "assets/hyperos3.webp",
          width: 1024,
          height: 572,
          alt: "HOS V2 (HyperOS 3) for X6871 by MBuTT3178",
          url: "https://drive.google.com/file/d/1m0MJrbLtt_DJE9qAgwUO87KcYZN6czmr/view?usp=drivesdk",
          guide: "flash-port-rom",
          details: {
            base: "Xiaomi 13T (Android 16)",
            changelogs: [
              "Added customizations from Mods Center",
              "Overall system performance and stability improvements",
            ],
            fixed: [
              "Fixed 5G preferred network option missing",
              "Fixed UI shattering",
              "Fixed glassy blur rendering",
              "Fixed overall performance bottlenecks",
            ],
            bugs: ["Always-On Display (AOD)"],
          },
          screenshots: [
            {
              url: "assets/screenshots/ss-1792352000-1792352000632.webp",
              caption: "HyperOS banner",
            },
            {
              url: "assets/screenshots/ss-1792353365-1792353365078.webp",
              caption: "Lock screen",
            },
            {
              url: "assets/screenshots/ss-1792353579-1792353579818.webp",
              caption: "Charging Animation",
            },
            {
              url: "assets/screenshots/ss-1792355429-1792355429871.webp",
              caption: "Status bar",
            },
            {
              url: "assets/screenshots/ss-1792355444-1792355444965.webp",
              caption: "Homescreen",
            },
          ],
          romId: "rom_hyperos_3_v2_2de2",
        },
        {
          name: "XOS 16 V2",
          date: "2026-07-23",
          by: "sheikhmehraann",
          image: "assets/xos16.webp",
          width: 1024,
          height: 576,
          alt: "XOS 16 for Infinix GT 20 Pro",
          url: "https://drive.google.com/file/d/1SR-c1nKOKiBorj5v7AorOQy_lcYv2IYO/view?usp=drivesdk",
          guide: "flash-port-rom",
          details: {
            base: "Infinix Note 40 5G (Android 16)",
            changelogs: [
              "Adjusted temperature and thermal limits",
              "Tuned display refresh rate switching",
              "Resolved small SELinux denials",
              "Dirty flash supported from V1",
            ],
            fixed: [
              "Fixed Always-On Display (AOD)",
              "Fixed ringtone breaking after a call",
              "Fixed background crashes causing battery drain",
              "Fixed touch responsiveness in games",
              "Fixed navigation gestures",
            ],
            bugs: ["No major bugs reported"],
          },
          screenshots: [
            {
              url: "assets/screenshots/ss-1792411593-1-1792411593715.webp",
              caption: "Banner",
            },
            {
              url: "assets/screenshots/ss-1792411593-2-1792411594265.webp",
              caption: "Lockscreen",
            },
            {
              url: "assets/screenshots/ss-1792411593-3-1792411594975.webp",
              caption: "Statusbar",
            },
            {
              url: "assets/screenshots/ss-1792411593-4-1792411595797.webp",
              caption: "DTS sound",
            },
            {
              url: "assets/screenshots/ss-1792411593-5-1792411596619.webp",
              caption: "Homescreen",
            },
          ],
          romId: "rom_xos_16_v2_8610",
        },
      ],
    },
    {
      title: "AOSP ROMs",
      items: [
        {
          name: "PixelOS-A16",
          date: "2026-03-09",
          by: "fjrXTR",
          image: "assets/pixelos16.webp",
          width: 1024,
          height: 512,
          alt: "PixelOS based on Android 16",
          url: "https://sourceforge.net/projects/gabutbuild/files/X6871/pos-16/20260308/",
          guide: "flash-aosp-rom",
          details: {
            base: "Android 16 (Baklava QPR2) · XOS 15 Firmware Base",
            changelogs: [
              "Hotfix build (User, Signed & GApps included)",
              "Based on XOS 15 firmware",
            ],
            fixed: ["Fixed bad system performance"],
            bugs: [
              "Do not replace stock kernel (below v248) or Wi-Fi Hotspot will break",
            ],
          },
          romId: "rom_pixelos_a16_ea74",
        },
        {
          name: "Axion-V2.4",
          date: "2026-03-04",
          by: "fjrXTR",
          image: "assets/axion16.webp",
          width: 1024,
          height: 512,
          alt: "AxionAOSP based on Android 16",
          url: "https://sourceforge.net/projects/gabutbuild/files/X6871/axion-16/",
          guide: "flash-aosp-rom",
          details: {
            base: "Android 16 (Baklava QPR2) · XOS 15 Firmware Base",
            changelogs: [
              "Initial AxionAOSP 2.4 Solace build (Signed & GApps included)",
              "Added Dolby Atmos",
              "Removed ViPER4Android",
              "Under-the-hood changes and system optimizations",
            ],
            fixed: [
              "Fixed Bluetooth audio issue",
              "Fixed Wi-Fi Hotspot issue",
              "Fixed USB connection issue",
              "Fixed UI stuttering",
            ],
            bugs: [
              "Do not replace stock kernel (below v248) or Wi-Fi Hotspot will break",
            ],
          },
          romId: "rom_axion_v2_4_316b",
        },
        {
          name: "InfinityX-V3.7",
          date: "2026-03-02",
          by: "fjrXTR",
          image: "assets/infinityx16.webp",
          width: 1024,
          height: 512,
          alt: "Project InfinityX based on Android 16",
          url: "https://sourceforge.net/projects/gabutbuild/files/X6871/infinity-16/",
          guide: "flash-aosp-rom",
          details: {
            base: "Android 16 (Baklava QPR2) · OSS Vendor",
            changelogs: [
              "Initial Project InfinityX 3.7 build with OSS Vendor (Signed & GApps included)",
              "SELinux is Enforcing",
              "Under-the-hood changes and optimizations",
            ],
            fixed: ["Fixed Fingerprint On Display (FOD)"],
            bugs: [
              "Do not replace stock kernel (below v248) or Wi-Fi Hotspot will break",
            ],
          },
          romId: "rom_infinityx_v3_7_a442",
        },
      ],
    },
    {
      title: "Flashable firmware",
      items: [
        {
          name: "XOS 16.3.0 (Android 16)",
          note: "Official Stock OTA • 8.8 GB • If you have upgrade problems, use XOS 15.0.3",
          guide: "xos16-local-update",
          url: "https://android.googleapis.com/packages/ota-api/package/744f47c66b26e36501d6106360708d3e4dbd6ac1.zip",
          romId: "rom_xos_16_3_0_android_20ae",
        },
        {
          name: "XOS 15.1.2.180",
          guide: "flash-port-rom",
          url: "https://sourceforge.net/projects/rama982/files/FLASHABLE/X6871-15.1.2.180SP05-OP001PF001AZ-recovery-ab.zip",
          romId: "rom_xos_15_1_2_180_f895",
        },
        {
          name: "XOS 15.1.2.165",
          guide: "flash-port-rom",
          url: "https://sourceforge.net/projects/rama982/files/FLASHABLE/X6871-15.1.2.165SP05%28OP001PF001AZ%29-recovery-ab.zip/download",
          romId: "rom_xos_15_1_2_165_3534",
        },
        {
          name: "XOS 15.0.3",
          note: "Used for downgrading",
          guide: "downgrade-xos",
          url: "https://android.googleapis.com/packages/ota-api/package/3746a289a46815c7cd869c3b0d3f10b04dd40be5.zip",
          romId: "rom_xos_15_0_3_eaf0",
        },
        {
          name: "XOS 14",
          guide: "flash-port-rom",
          url: "https://sourceforge.net/projects/rama982/files/FLASHABLE/X6871-H962CF-U-OP-250217V2673-recovery-ab.zip/download",
          romId: "rom_xos_14_4fa6",
        },
      ],
    },
    {
      title: "Base Firmware (Complete files)",
      items: [
        {
          name: "XOS 15.1.2.165",
          guide: "flash-port-rom",
          url: "https://drive.google.com/file/d/1Y4N5pD61gTSJ9g4YZRPmvHjP1zdKacWi/view?usp=drivesdk",
          romId: "rom_xos_15_1_2_165_3534",
        },
      ],
    },
    {
      title: "boot.img files",
      items: [
        {
          romId: "rom_boot_img_xos_16_0__ddf3",
          name: "Boot.img  16.0.3.155",
          date: "2026-10-21",
          by: "Transition",
          url: "https://drive.google.com/file/d/1N2BXj3AdbqwxUIgM2pMijMkjYcFrvIOR/view?usp=drivesdk",
          guide: "patched-and-gki-kernels",
          details: {
            changelogs: [],
            bugs: [],
            fixed: [],
          },
          note: null,
          description: null,
          size: null,
        },
        {
          name: "Boot.img 15.1.2.180",
          guide: "patched-and-gki-kernels",
          url: "https://drive.google.com/file/d/1G3OScojgJh14RPlUPWTO50RI-hADRaoq/view?usp=drive_link",
          romId: "rom_boot_img_15_1_2_18_9062",
        },
        {
          name: "Boot.img 15.1.2.165",
          guide: "patched-and-gki-kernels",
          url: "https://drive.google.com/file/d/1oaj5JJ4QhfEU7SICymqS2Rxzn_Oii8zq/view?usp=drive_link",
          romId: "rom_boot_img_15_1_2_16_53c3",
        },
      ],
    },
  ],
  modules: [
    {
      title: "Universal modules",
      items: [
        {
          name: "Re-Malwack V8.2",
          by: "Softbrick",
          group: "Utitity",
          note: "System-wide debloater, telemetry disabler, and security hardening module",
          url: "https://github.com/ZG089/Re-Malwack/releases/download/v8.2/Re-Malwack_v8.2.zip",
          date: "2026-04-18",
          description:
            "System-wide debloater, telemetry disabler, and security hardening module",
          size: null,
        },
        {
          name: "Viper4android V2.1.1",
          by: "WSTxda & likelikeslike",
          group: "Music",
          note: "Full ViPER4Android Audio Effects DSP driver with custom equalizer, clarity compressor, and headphone surround sound.",
          url: "https://drive.google.com/file/d/1YzjCLmQHSZiRHCO-IQKNxalTZJ-5HmFQ/view?usp=drive_link",
        },
      ],
    },
    {
      title: "XOS/HiOS modules",
      items: [
        {
          name: "Icon packs support",
          by: "Softbrick",
          group: "Themeing",
          note: "Enables full third-party icon pack customization on XOS and HiOS launchers with dynamic system theming.",
          url: "https://drive.google.com/file/d/149t_GlVnWGiB4pIWiRsegLvrKRWEv39c/view?usp=drive_link",
          date: "2026-10-21",
          description:
            "Enables full third-party icon pack customization on XOS and HiOS launchers with dynamic system theming.",
          size: "190mb (est.)",
        },
        {
          name: "HiOS/XOS 16 IOS statusbar",
          by: "Softbrick",
          group: "Themeing",
          note: "Applies iOS-styled statusbar icons, battery percentage layout, and sleek clock alignment on HiOS and XOS 16.",
          url: "https://drive.google.com/file/d/1kEARx8qqbJivNRyKwPt2WWbPQBaI0HPY/view?usp=drive_link",
        },
      ],
    },
    {
      title: "BBK modules",
      items: [],
    },
  ],
  kernels: [
    {
      title: "KSU Ultra .apk",
      items: [
        {
          name: "KSU Ultra V1",
          guide: "patched-and-gki-kernels",
          url: "https://drive.google.com/file/d/1B4MguUSV5YxbWboqMZB0D8LE_PVLH2Ol/view?usp=drive_link",
        },
        {
          name: "Kernel SU Next",
          guide: "patched-and-gki-kernels",
          url: "https://github.com/KernelSU-Next/KernelSU-Next",
        },
      ],
    },
    {
      title: "Patched boot.img",
      items: [
        {
          name: "15.1.2.180 KSU ultra V1",
          guide: "patched-and-gki-kernels",
          url: "https://drive.google.com/file/d/1KQsexTbwWaGZDmdjxrGk8p_Pc8ig8-3g/view?usp=drive_link",
        },
      ],
    },
    {
      title: "GKI kernels",
      items: [
        {
          name: "Vortex",
          guide: "patched-and-gki-kernels",
          url: "https://drive.google.com/file/d/19KSayWu7oDEPlCBNC4SJ1pJ_lpFPYcws/view?usp=drive_link",
          by: "Softbrick (Admin)",
          date: "2026-10-21",
          note: "For XOS 15 ONLY",
          description: "For XOS 15 ONLY",
          size: null,
        },
        {
          name: "Zixine",
          guide: "patched-and-gki-kernels",
          url: "https://drive.google.com/file/d/1MMXyXGVkl3YF06pduNQMiOggZMl6JOad/view?usp=drive_link",
          by: "Softbrick (Admin)",
          date: "2026-10-21",
          note: "For XOS 15 ONLY",
          description: "For XOS 15 ONLY",
          size: null,
        },
      ],
    },
  ],
  recovery: [
    {
      title: "Ofox Recovery",
      items: [
        {
          name: "OFOX R 12.0 (XOS 16.3.0)",
          by: "Mehraann",
          url: "https://drive.google.com/file/d/1t8utTAa6-0O6JI17nGwponML641qzZ7X/view?usp=drive_link",
          guide: "ofox-flash",
        },
        {
          name: "OFOX R 12.0 (XOS 15.1.2)",
          guide: "ofox-flash",
          url: "https://drive.google.com/file/d/1Hms8P8ziqLhy4UZ9setpoIddp0vIPwml/view?usp=drive_link",
          by: "Rama982",
          date: "2026-10-21",
          note: "DO NOT FLASH ON XOS 16",
          description: "DO NOT FLASH ON XOS 16",
          size: null,
        },
      ],
    },
    {
      title: "Fenrir",
      items: [
        {
          name: "Fenrir A16",
          by: "Mehraann",
          url: "https://drive.google.com/file/d/1fcmDzmpSFXK6ylNCHdypHldynzAcsA0F/view?usp=drive_link",
          guide: "flash-fenrir",
        },
        {
          name: "Fenrir A15",
          guide: "flash-fenrir",
          url: "https://github.com/sheikhmehraann/Renkai-X6871/releases/download/V1/Renkai.Android.15-X6871-Flashable.zip",
        },
        {
          name: "Fenrir A14",
          guide: "flash-fenrir",
          url: "https://github.com/sheikhmehraann/Renkai-X6871/releases/download/V1/Renkai.Android.14-X6871-Flashable.zip",
        },
      ],
    },
    {
      title: "Penumbra & Debugging",
      items: [
        {
          name: "Penumbra CLI Flash tool",
          url: "https://github.com/shomykohai/penumbra",
        },
        {
          name: "Penumbra GUI (Community release)",
          url: "https://www.mediafire.com/file/mvgzjmduatf1cbk/PenumbraGUI+V3.0+(4).zip/file",
        },
      ],
    },
    {
      title: "Rooted Apps toolkit",
      items: [
        {
          name: "Swiftbackup",
          guide: "apps-backup-swiftbackup",
          url: "https://drive.google.com/file/d/14E_1MYR8L7ZYqR7IJJgSzNkyDlxMmjen/view?usp=drive_link",
        },
        {
          name: "Scene",
          url: "https://drive.google.com/file/d/16to_lAPU87Vb3p5cSwBa206sTz4sclPp/view?usp=drive_link",
        },
        {
          name: "MT manager (pro)",
          url: "https://drive.google.com/file/d/1i39IQ8QSNKFUk4rWspuGnPSas3gk1_ax/view?usp=drive_link",
        },
      ],
    },
  ],
  screenshots: [
    {
      title: "Screenshots",
      items: [],
    },
  ],
  appReleases: [
    {
      version: "v3.1.1",
      name: "NewbiesTeam Android App v3.1.1",
      date: "2026-10-23",
      by: "Softbrick & NewbiesTeam",
      isLatest: true,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v3.1.1/NewbiesTeam-v3.1.1.apk",
      fallbackApkUrl: "https://newbiesteam.pages.dev/assets/NewbiesTeam.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v3.1.1",
      size: "5.2 MB",
      badge: "Dev App Image Fix",
      summary:
        "Dev app bug fix: ROM banners and posted update images now load from the set bundled inside the APK (local-first with Cloudflare Pages retry), so cards always show the real artwork instead of the NB placeholder. Public app rebuilt at the same version — no behavior change.",
      changelog: [
        "Dev App Image Fix: ROM screenshots, posted update photos and logos are bundled into the APK assets; the WebView serves every assets/ path locally and only retries the CDN for posts newer than the installed build.",
        "Full Image Bundle: the sync pipeline now ships assets/*.webp, *.png and the screenshots/ + updates/ folders inside the dev APK, while build archives and secrets stay excluded.",
        "Offline Content: already-published ROM artwork, logos and update images render without network — the NB placeholder only appears for genuinely unknown assets.",
        "Public app rebuilt at v3.1.1 for signing continuity — no public app behavior changed.",
      ],
    },
    {
      version: "v3.1.0",
      name: "NewbiesTeam Android App v3.1.0",
      date: "2026-10-23",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v3.1.0/NewbiesTeam-v3.1.0.apk",
      fallbackApkUrl: "https://newbiesteam.pages.dev/assets/NewbiesTeam.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v3.1.0",
      size: "5.1 MB",
      badge: "144Hz Performance & Twelve Themes",
      summary:
        "Both apps now run natively at the panel's maximum refresh rate (144Hz) and ship a twelve-theme engine (Obsidian, AMOLED, Mocha, Midnight, Forest, Dracula, Macchiato, Everforest, Ayu, Cobalt, Carbonfox, Latte) with a picker that animates every element. Dev app sync hardened across the Cloudflare Pages primary and both Surge mirrors, plus a new animated startup splash.",
      changelog: [
        "Native 144Hz / High-Refresh Unlock: Both apps request the display's maximum supported mode (preferredDisplayModeId) so WebView animations, tab lenses, and scroll run at full panel rate instead of 60Hz.",
        "Twelve-Theme Engine (OpenCode-inspired): AMOLED (pure black), Mocha, Latte, Midnight, Forest, Dracula, Catppuccin Macchiato, Everforest, Ayu, Cobalt and Carbonfox join Obsidian — every nav pill, card, popover, toast, and glow matches each palette.",
        "Theme Picker UI: The nav theme button now opens a glassmorphism menu with live color swatches; switching keeps the circular View-Transition ripple and respects reduced-motion users.",
        "NewbiesDev Startup Animation: The developer app now plays the same animated brand splash as the public app (blinking robot logo + crimson glow) on launch.",
        "Multi-Backend Sync Hardening: Dev app live-data sync tries Cloudflare Pages, newbiesteam.surge.sh, and newbiesbase.surge.sh in order — changes keep applying even if the primary CDN is unreachable.",
        "Developer Keys: Toolkit-generated keys verified against auth-manifest (SHA-256 hashes only) with newbiesbase mirror added to the failover chain.",
      ],
    },
    {
      version: "v3.0.1",
      name: "NewbiesTeam Android App v3.0.1",
      date: "2026-10-22",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v3.0.1/NewbiesTeam-v3.0.1.apk",
      fallbackApkUrl: "https://newbiesteam.pages.dev/assets/NewbiesTeam.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v3.0.1",
      size: "5.0 MB",
      badge: "Real-time Cloudflare Sync & Unified UI",
      summary:
        "NewbiesDev 3.0.1 now real-time syncs with Cloudflare Pages backend. Every content change in the dev app instantly reflects on the public web hub and public APK without recompilation. Unified developer toolkit with Cloudflare deployment status, cache purge, and live logs.",
      changelog: [
        "Real-time Cloudflare Pages Sync: Dev app content changes instantly propagate to https://newbiesteam.pages.dev via GitHub Actions + wrangler deployment.",
        "Unified UI Across Apps: NewbiesDev v3.0.1 matches public app layout, cards, navigation, and themed publish cards exactly.",
        "Server Toolkit Cloudflare Integration: New 'Sync & Deploy' action runs deploy.sh with Cloudflare Pages primary + Surge mirror. Added Cloudflare Deployment Status, Cache Purge, and Live Logs actions.",
        "Global 'server' Command: Fish shell function launches toolkit from any directory. TUI shows 'Primary: newbiesteam.pages.dev | Mirror: surge.sh' with live health indicator.",
        "SEO & Performance: robots.txt, sitemap.xml, and _headers all point to Cloudflare Pages primary with immutable 7-day asset caching.",
      ],
    },
    {
      version: "v3.0.0",
      name: "NewbiesTeam Android App v3.0.0",
      date: "2026-10-22",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v3.0.0/NewbiesTeam-v3.0.0.apk",
      fallbackApkUrl: "https://newbiesteam.pages.dev/assets/NewbiesTeam.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v3.0.0",
      size: "5.0 MB",
      badge: "Cloudflare Pages Backend",
      summary:
        "Primary backend migrated to Cloudflare Pages (https://newbiesteam.pages.dev) with Surge (https://newbiesteam.surge.sh) as automatic secondary failover mirror. Unified fetch endpoints, SEO headers, and cache rules across public app, developer app, and web hub.",
      changelog: [
        "Cloudflare Pages Primary Backend: Web hub, data.js, updates.json, and auth-manifest.json now served from https://newbiesteam.pages.dev with Surge as automatic failover mirror.",
        "Edge Cache Rules: Configured _headers for no-cache JSON endpoints and immutable 7-day asset caching via Cloudflare native cache rules.",
        "SEO & Crawlers: robots.txt, sitemap.xml, and Google Site Verification updated for the Cloudflare Pages primary domain.",
        "Unified UI: Public app and NewbiesDev developer app share identical layout, cards, navigation, and themed publish cards.",
        "Sensitive Files: release.jks, .relay-keys.json, keys.txt, *.pem, *.key, code-bundle.txt, and *.zip protected in .gitignore and .surgeignore.",
      ],
    },
    {
      version: "v2.1.2",
      name: "NewbiesTeam Android App v2.1.2",
      date: "2026-10-21",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v2.1.2/NewbiesTeam-v2.1.2.apk",
      fallbackApkUrl: "https://newbiesteam.pages.dev/assets/NewbiesTeam.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v2.1.2",
      size: "5.0 MB",
      badge: "UI HTML Fix",
      summary:
        "Fixed HTML rendering in the About Modal signoff footer to cleanly render linebreaks and small subtext without unescaped tags.",
      changelog: [
        "About Modal Fix: Corrected tagline signoff markup rendering in both public and developer apps so <small> and <br> tags render visually instead of as escaped plain text.",
      ],
    },
    {
      version: "v2.1.1",
      name: "NewbiesTeam Android App v2.1.1",
      date: "2026-10-21",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v2.1.1/NewbiesTeam-v2.1.1.apk",
      fallbackApkUrl: "https://newbiesteam.pages.dev/assets/NewbiesTeam.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v2.1.1",
      size: "5.0 MB",
      badge: "Real-Time Sync Engine",
      summary:
        "Enabled automatic live data.js sync in the public app and website, zero-cache headers, and forced network refresh so all developer posts appear instantly on the public hub.",
      changelog: [
        "Live Web/App Sync Engine: Public app and web now dynamically re-fetch and hot-reload data.js on startup, tab focus, and background interval.",
        "Zero-Cache HTML Headers: Configured no-cache headers so web browsers and WebViews never serve stale HTML.",
        "Forced Network Pull-to-Refresh: Swipe down to refresh in the Android app now bypasses cache completely to pull live server updates.",
        "Unified Module Info: Aligned module notes and expandable drawers identically across dev app and public web hub.",
      ],
    },
    {
      version: "v2.1.0",
      name: "NewbiesTeam Android App v2.1.0",
      date: "2026-10-21",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v2.1.0/NewbiesTeam-v2.1.0.apk",
      fallbackApkUrl: "https://newbiesteam.pages.dev/assets/NewbiesTeam.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v2.1.0",
      size: "5.0 MB",
      badge: "Sync & Edit Fix",
      summary:
        "Fixed item edit and synchronization reversion bug in developer app, enabled real-time optimistic mutation overlay across Surge CDN propagation delays, and improved screenshot deletion resilience.",
      changelog: [
        "Dev App Edit & Sync Fix: Fixed category resolution so item edits capture and dispatch full data payloads to the server without reverting.",
        "Persistent Optimistic Mutation Overlay: Added intelligent mutation overlay in dev app to prevent Surge CDN caching lag from reverting newly edited or added content.",
        "Resilient Screenshot Deletion: Prioritized screenshot deletion by URL to eliminate index shift issues during multiple removals.",
      ],
    },
    {
      version: "v2.0.5",
      name: "NewbiesTeam Android App v2.0.5",
      date: "2026-10-21",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v2.0.5/NewbiesTeam-v2.0.5.apk",
      fallbackApkUrl: "https://newbiesteam.pages.dev/assets/NewbiesTeam.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v2.0.5",
      size: "5.0 MB",
      badge: "Modules & Cache",
      summary:
        "Enabled permanent info buttons and expandable description drawers across all modules in public web and Android app, with automated asset cache-busting.",
      changelog: [
        "Modules Info Button: All modules now unconditionally render the info button and expandable drawer.",
        "Module Descriptions: Populated full descriptions and notes for all XOS/HiOS and Universal modules.",
        "Zero-Cache Asset Headers: Added automated timestamp query cache-busting and no-cache headers for app.js and styles.css so updates reflect instantly.",
      ],
    },
    {
      version: "v2.0.4",
      name: "NewbiesTeam Android App v2.0.4",
      date: "2026-10-21",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v2.0.4/NewbiesTeam-v2.0.4.apk",
      fallbackApkUrl: "https://newbiesteam.pages.dev/assets/NewbiesTeam.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v2.0.4",
      size: "5.0 MB",
      badge: "Bugfix",
      summary:
        "Fixed modal vertical scrolling on Android devices, resolved screenshot deletion freeze in dev app, and synchronized module info buttons and descriptions across public web and mobile apps.",
      changelog: [
        "Modules Info & Description: Added expandable info button and note drawer in public app so all dev-entered descriptions sync and display smoothly.",
        "Screenshot Deletion Freeze Fix: Fixed missing native AlertDialog display and decoupled quick-delete button from thumbnail click handlers.",
        "Publish & Edit Modal Scrolling: Fixed flexbox layout and scroll boundary constraints, enabling smooth vertical scrolling through all form fields on mobile.",
      ],
    },
    {
      version: "v2.0.3",
      name: "NewbiesTeam Android App v2.0.3",
      date: "2026-10-21",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v2.0.3/NewbiesTeam-v2.0.3.apk",
      fallbackApkUrl: "https://newbiesteam.pages.dev/assets/NewbiesTeam.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v2.0.3",
      size: "5.0 MB",
      badge: "SEO & Search",
      summary:
        "Comprehensive SEO optimization for Google & Bing discovery, XML sitemap, crawler-friendly indexable content, Schema.org structured data, and intelligent 'gt 20 pro' multi-tab search.",
      changelog: [
        "Search Engine Optimization: Meta tags, canonical links, OpenGraph, Twitter cards, and Schema.org WebSite/Organization JSON-LD structured data.",
        "Crawler Indexing: Added comprehensive noscript semantic index of all Infinix GT 20 Pro ROMs, kernels, recovery images, and guides.",
        "Robots & Sitemaps: Integrated automated robots.txt and sitemap.xml with full tab and guide routing.",
        "Intelligent In-App Search: Searching 'gt 20 pro', 'x6871', or device tokens now presents complete GT 20 Pro resources across all tabs.",
      ],
    },
    {
      version: "v2.0.2",
      name: "NewbiesTeam Android App v2.0.2",
      date: "2026-10-21",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v2.0.2/NewbiesTeam-v2.0.2.apk",
      fallbackApkUrl: "https://newbiesteam.pages.dev/assets/NewbiesTeam.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v2.0.2",
      size: "5.0 MB",
      badge: "Feature",
      summary:
        "Added granular developer key access level management with scoped auto-push controls (e.g. guides only) and PC verification moderation queues, seamlessly synced to server backend.",
      changelog: [
        "Interactive Access Level & Permission editor in newbies-toolkit and admin daemon.",
        "Scoped auto-push controls allowing keys to auto-publish specific sections (e.g. guides) while queueing others for PC verification.",
        "Automatic live server backend synchronization pushing updated keys and manifests directly to Surge CDN.",
        "Enhanced in-app developer permission validation and real-time roster role status badges.",
      ],
    },
    {
      version: "v2.0.1",
      name: "NewbiesTeam Android App v2.0.1",
      date: "2026-10-21",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v2.0.1/NewbiesTeam-v2.0.1.apk",
      fallbackApkUrl: "https://newbiesteam.pages.dev/assets/NewbiesTeam.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v2.0.1",
      size: "5.0 MB",
      badge: "Bugfix",
      summary:
        "Resolved asset and screenshot resolution inside Developer APK, enhanced cross-origin asset serving, and added offline-safe image fallbacks.",
      changelog: [
        "Fixed broken image rendering in NewbiesDev APK via universal asset URL resolution.",
        "Added automatic fallback handling for remote banners and screenshot gallery thumbnails.",
        "Bundled vector logo assets directly into APK package assets for offline rendering.",
        "Enabled CORS headers on Surge assets directory for seamless external streaming.",
      ],
    },
    {
      version: "v2.0.0",
      name: "NewbiesTeam Android App v2.0.0",
      date: "2026-10-21",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v2.0.0/NewbiesTeam-v2.0.0.apk",
      fallbackApkUrl: "https://newbiesteam.pages.dev/assets/NewbiesTeam.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v2.0.0",
      size: "5.0 MB",
      badge: "Major 2.0 Release",
      summary:
        "Major 2.0 release unifying Developer Control Center, in-app content management, sub-16ms optimistic UI updates, and resolving Android WebView intent scheme navigation.",
      changelog: [
        "Fixed net::ERR_UNKNOWN_URL_SCHEME by eliminating automated intent scheme hijacking.",
        "Completely rebuilt Developer Control Center (NewbiesDev) with unified Liquid Glass layout.",
        "Interactive in-app content publisher with auto-announcements and inline card controls.",
        "Sub-16ms optimistic UI updates with 75-second CDN deployment overlay protection.",
        "Permanent V2+V3 release signing and clean Play Protect verification.",
      ],
    },
    {
      version: "v1.2.3",
      name: "NewbiesTeam Android App v1.2.3",
      date: "2026-10-19",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v1.2.3/NewbiesTeam-v1.2.3.apk",
      fallbackApkUrl: "https://newbiesteam.pages.dev/assets/NewbiesTeam.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v1.2.3",
      size: "5.0 MB",
      badge: "Release",
      summary:
        "Official release with persistent release signing, KSU-styled About dialog, and ROM screenshots deep linking.",
      changelog: [
        "Permanent V2+V3 release signing with clean in-place upgrade compatibility across all future updates.",
        "Integrated KSU-styled About window featuring dynamic build versioning and official team credits.",
        "Direct ROM <-> Screenshot linking with 3-photo preview strip and deep navigation.",
        "Removed debug probe binaries and restricted cleartext traffic for clean Play Protect verification.",
      ],
    },
    {
      version: "v1.2.2",
      name: "NewbiesTeam Android App v1.2.2",
      date: "2026-10-19",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v1.2.2/NewbiesTeam-v1.2.2.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v1.2.2",
      size: "6.1 MB",
      badge: "Release",
      summary:
        "New official brand logos, animated startup splash opening & adaptive launcher icon.",
      changelog: [
        "New official NewbiesTeam droid logo with swaying antennae and blinking eyes.",
        "Smooth animated startup splash opening animation powered by Android AnimatedVectorDrawable.",
        "Adaptive brand launcher icons with high-DPI support across all Android screen densities.",
        "Deep link navigation improvements and refined status bar theme handling.",
      ],
    },
    {
      version: "v1.2.1",
      name: "NewbiesTeam Android App v1.2.1",
      date: "2026-10-18",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v1.2.1/NewbiesTeam-v1.2.1.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v1.2.1",
      size: "6.0 MB",
      badge: "Release",
      summary:
        "Automatic background update alerts, offline guides & UI optimizations.",
      changelog: [
        "Automatic background notifications when new ROMs, kernels, or modules are posted.",
        "Direct external download routing for Google Drive, Mega, MediaFire, SourceForge, and Telegram links.",
        "Offline caching allows reading guides and checking tool steps without internet.",
        "General performance improvements and UI fixes for GT 20 Pro.",
      ],
    },
    {
      version: "v1.2.0",
      name: "NewbiesTeam Android App v1.2.0",
      date: "2026-10-18",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v1.2.0/NewbiesTeam-v1.2.0.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v1.2.0",
      size: "5.0 MB",
      badge: "Release",
      summary: "Background update checks, edge-to-edge layout & swipe refresh.",
      changelog: [
        "Background update check for newly added ROMs and modules.",
        "Edge-to-edge immersive layout and transparent system bars.",
        "Swipe-down pull to refresh with smooth loading indicator.",
        "In-app back button navigation handling before exiting.",
      ],
    },
    {
      version: "v1.0.2",
      name: "NewbiesTeam Android App v1.0.2",
      date: "2026-10-18",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v1.0.2/NewbiesTeam-v1.0.2.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v1.0.2",
      size: "4.9 MB",
      badge: "Release",
      summary: "Security lockdown, single release APK & keystore integration.",
      changelog: [
        "Locked down cleartext network traffic for security.",
        "Eliminated debug APK from releases; single NewbiesTeam.apk package.",
        "Integrated release keystore.",
      ],
    },
    {
      version: "v1.0.1",
      name: "NewbiesTeam Android App v1.0.1",
      date: "2026-10-18",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v1.0.1/NewbiesTeam-v1.0.1.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v1.0.1",
      size: "4.9 MB",
      badge: "Release",
      summary: "Automated signed APK packaging with GitHub Actions.",
      changelog: [
        "Added GitHub Actions automated signed release packaging.",
        "Configured release signing scheme.",
      ],
    },
    {
      version: "v1.0.0",
      name: "NewbiesTeam Android App v1.0.0",
      date: "2026-10-18",
      by: "Softbrick & NewbiesTeam",
      isLatest: false,
      apkUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/download/v1.0.0/NewbiesTeam-v1.0.0.apk",
      releaseUrl:
        "https://github.com/zcyrl/newbiesteam-app/releases/tag/v1.0.0",
      size: "4.8 MB",
      badge: "Initial Release",
      summary: "First official Android companion app for Infinix GT 20 Pro.",
      changelog: [
        "Initial official launch of the NewbiesTeam Android App.",
        "Fast embedded WebView for ROMs, modules, kernels, and recovery tools.",
        "Offline caching for guide steps and tools.",
      ],
    },
  ],
  updates: [
    {
      id: "sub-1792684005025-ann",
      date: "2026-10-22",
      tag: "Ofox Recovery",
      by: "Softbrick (Admin)",
      title: "New Release: OFOX R 12.0 ( XOS 16.3)",
      body: "OFOX R 12.0 ( XOS 16.3) is now available for download.",
      linkLabel: "View in Recovery",
    },
    {
      id: "sub-1792592637783-ann",
      date: "2026-10-21",
      tag: "boot.img files",
      by: "Softbrick (Admin)",
      title: "New Release: Boot.img XOS 16.0.3.155",
      body: "Boot.img XOS 16.0.3.155 is now available for download.",
      linkLabel: "View in Roms",
    },
    {
      id: "sub-1792448180805",
      date: "2026-10-20",
      tag: "Notice",
      by: "Mehraann",
      title: "3 Ticks XOS × Fenrir",
      body: "Gay",
      image: "assets/updates/upd-1792448624-1792448624341.webp",
    },
    {
      id: "upd-xos16-official",
      date: "2026-10-19",
      tag: "Official Firmware",
      by: "Infinix / NewbiesTeam",
      title: "Official XOS 16.3 (Android 16) Released for Infinix GT 20 Pro",
      body: "Infinix has officially released the major Android 16 and XOS 16.3.0 update (Build: X6871-16.3.0.155SP20) for the GT 20 Pro (Global - OP Market). This massive 8.8 GB release introduces the GlowSpace Superfluid UI design with translucent glass styling, enhanced MindHub AI search and real-time NMT subtitles, live wallpapers, superfluid Control Center and status bar transitions, unified privacy password, enhanced call recording, and the 2026-09-05 security patch. If you are getting upgrade problems then use {{#roms/xos-15-0-3|XOS 15.0.3}}. Follow our step-by-step {{xos16-local-update|Local Update Guide}} to install it safely.",
      image: "assets/updates/upd-xos16.webp",
      url: "https://android.googleapis.com/packages/ota-api/package/744f47c66b26e36501d6106360708d3e4dbd6ac1.zip",
      linkLabel: "Download Stock OTA (8.8 GB)",
    },
    {
      id: "upd-app-121",
      date: "2026-10-18",
      tag: "Official App",
      by: "Softbrick",
      title: "NewbiesTeam Android App v1.2.1 Released",
      body: "Version 1.2.1 of our official Android app is out now. We added a dedicated App Releases tab right here on the web hub so you can always grab the latest APK directly or view past version changelogs.",
      url: "#app",
      linkLabel: "View App Releases",
    },
    {
      id: "upd-1792345951",
      date: "2026-10-18",
      tag: "Fix",
      by: "MBuTT3178",
      title: "FOD OOS 16",
      body: "FOD and AOD both working",
      url: "https://t.me/NTPChats/13370",
      image: "assets/updates/upd-1792345951.webp",
    },
    {
      id: "upd-1792266731",
      date: "2026-10-17",
      tag: "Web Update",
      by: "Softbrick",
      title:
        "NewbiesTeam Hub v2.1 — Download Mirrors, Screenshots Tab & Tool Info",
      body: "Added a download source selector (Primary + Mirror links) so you aren't stuck if Google Drive hits a quota limit. Also added info drawers with direct guide links to Firmware, boot.img, OFOX, and Fenrir cards, a new Screenshots tab in the navbar, the Rooted Apps toolkit under Recovery & Tools, and fixed a few mobile text layout bugs.",
    },
    {
      id: "upd-1",
      date: "2026-10-17",
      tag: "Site Update",
      by: "Softbrick",
      title:
        "NewbiesTeam Hub v2 — ROM Changelogs, Banners & Categorized Guides",
      body: "Added expandable info drawers (base device, changelogs, fixes, and known bugs) for every Port ROM and AOSP ROM, new ROM banners, Lock Bootloader guide by Mehraann, and categorized Flashing, Bootloader, and Rooting guides.",
      url: "#roms",
    },
    {
      id: "upd-2",
      date: "2026-10-12",
      tag: "New ROM",
      by: "MBuTT3178",
      title: "HiOS 16.3 Port Released for GT 20 Pro (X6871)",
      body: "Ported from Tecno Camon 30 Premier (CL9) with Mecha light loop settings, High Performance gaming mode, Dolby Atmos, SELinux Enforcing, and working FOD.",
      url: "https://drive.google.com/file/d/1zDo3CMhHrQdAMw-MKHCP83taXTb_ojmy/view?usp=drivesdk",
    },
  ],
  guides: {
    title: "Guides",
    notice:
      "Please dont ask for a video if someone did a guide and recorded his steps it will be provided immediatly other than that shut up.",
    categories: ["Flashing Guides", "Bootloader Guides", "Rooting Guides"],
    items: [
      {
        slug: "xos16-local-update",
        category: "Flashing Guides",
        warning:
          "Do local update just like this. If you do something else and it fails, it's your own problem. If you are getting upgrade problems then use {{#roms/xos-15-0-3|XOS 15.0.3}} (you should do a full OTA update to {{#roms/xos-15-1-2-180|XOS 15.1.2.180}} after flashing XOS 15.0.3). Do NOT try flashing this official stock OTA zip through custom recovery (OFOX/TWRP) or fastboot — it is built strictly for the stock Infinix system local updater on an unmodified stock device.",
        title: "Update to XOS 16.3 (Local Update)",
        read: "3 min read",
        info: {
          Device: "Infinix GT 20 Pro (X6871)",
          Target: "XOS 16.3.0 (Android 16)",
          Build: "X6871-16.3.0.155SP20",
          Method: "Local Update (No PC needed)",
          Requires: "Stock Recovery, Battery > 50%",
          Updated: "Oct 20",
        },
        intro: [
          "How to update to official XOS 16.3 (Android 16)? Do local update just like this. You do something else and it fails, it's your own problem. If you are getting upgrade problems then use {{#roms/xos-15-0-3|XOS 15.0.3}} — you should do a full OTA update to {{#roms/xos-15-1-2-180|XOS 15.1.2.180}} after flashing XOS 15.0.3.",
          "This is the official full stock OTA package for the Infinix GT 20 Pro (X6871). Download the package directly: {{dl:https://android.googleapis.com/packages/ota-api/package/744f47c66b26e36501d6106360708d3e4dbd6ac1.zip|⬇ Download Stock XOS 16.3 OTA (8.8 GB)}}",
        ],
        sections: [
          {
            h: "Requirements & rules",
            body: [
              {
                ul: [
                  "Device: Infinix GT 20 Pro (X6871).",
                  "Stock recovery & unmodified system: If you are rooted with Magisk, KernelSU, or APatch, or have OrangeFox / custom recovery installed, the official OTA will fail signature verification or bootloop. Restore stock boot, init_boot, and stock recovery first.",
                  "Battery charge: At least 50% battery (or keep the phone plugged into the charger during update).",
                  "Free storage: At least 15 GB to 20 GB of free internal storage to unpack and apply the 8.8 GB update payload.",
                  "Backup: Back up all your important data before updating.",
                ],
              },
              {
                note: "If you are getting upgrade problems then use {{#roms/xos-15-0-3|XOS 15.0.3}} (see {{downgrade-xos|Downgrade XOS}}). You should do a full OTA update to {{#roms/xos-15-1-2-180|XOS 15.1.2.180}} after flashing XOS 15.0.3.",
              },
            ],
          },
          {
            h: "How to update (Local Update)",
            body: [
              {
                ol: [
                  "Download the official XOS 16.3 OTA zip file: {{dl:https://android.googleapis.com/packages/ota-api/package/744f47c66b26e36501d6106360708d3e4dbd6ac1.zip|Download Official Stock OTA (8.8 GB)}}. You can also find it under the {{#roms|ROMs}} tab.",
                  "Using a file manager, move the downloaded .zip file directly to the root of your Internal Storage (e.g. /storage/emulated/0/). Do not place it inside subfolders, and do not extract the zip.",
                  "Optional: If your system updater file picker fails to detect it, rename the file to ota.zip or update.zip in the root of internal storage.",
                  "Open phone Settings -> System -> System Update.",
                  "Tap the three vertical dots (⋮) in the top-right corner of the System Update screen.",
                  "Select Local Update (or Manual Update) from the menu.",
                  "If Local Update is hidden: Go to Settings -> About Phone -> Version Info and tap Build Number 7 times to enable Developer options. Alternatively, open your phone dialer and enter *#*#873283#*#* to trigger the local package selector.",
                  "Select the downloaded XOS 16.3 OTA zip file and tap Install / Update Now.",
                  "Wait patiently while the system verifies cryptographic signatures and applies the update partitions. Do NOT interrupt, reboot, or turn off the device.",
                  "When the update finishes, tap Restart Now to boot into XOS 16.3 (Android 16).",
                ],
              },
            ],
          },
          {
            h: "If it fails (Troubleshooting)",
            body: [
              {
                ul: [
                  "Installation aborted or verification failed: If you are getting upgrade problems then use {{#roms/xos-15-0-3|XOS 15.0.3}}. Flash the base firmware in OrangeFox recovery (see {{downgrade-xos|Downgrade XOS}}), boot into stock system, do a full OTA update to {{#roms/xos-15-1-2-180|XOS 15.1.2.180}}, and then apply the local update.",
                  "OTA package not appearing in Local Update: Ensure the zip is in the root directory of Internal Storage (/sdcard/ or /storage/emulated/0/), not in Download or Telegram folders. Try renaming it to ota.zip.",
                  "Not enough space error: Free up at least 15 GB of space on internal storage before beginning.",
                  "Bootloop after reboot: If your bootloader is unlocked and you had customized vendor files, enter recovery (hold Power + Volume Up) and format data / wipe cache.",
                ],
              },
              {
                note: "Stick strictly to this local update procedure. You do something else and it fails, it's your own problem.",
              },
            ],
          },
        ],
      },
      {
        slug: "ofox-flash",
        category: "Flashing Guides",
        warning:
          "Flashing the wrong vendor_boot image, or flashing it to the wrong partition, can leave the phone stuck in a bootloop or unable to boot. Only use files made for the GT 20 Pro (X6871).",
        title: "OFOX flash",
        read: "3 min read",
        info: {
          Device: "GT 20 Pro",
          Difficulty: "Easy",
          Requires: "PC, USB cable",
          Recovery: "OrangeFox (OFOX)",
          Updated: "Oct 17",
        },
        intro: [
          "This installs OrangeFox (OFOX) recovery on the GT 20 Pro by flashing its vendor_boot image from a PC with fastboot.,Get the OFOX recovery file from the {{#recovery/Ofox Recovery|Recovery & Tools}} tab first. {{https://drive.google.com/file/d/1t8utTAa6-0O6JI17nGwponML641qzZ7X/view?usp=drivesdk|⬇ Direct Download OFOX R 12.0}}",
        ],
        sections: [
          {
            h: "Before you start",
            body: [
              {
                ul: [
                  "Platform tools (ADB and fastboot) installed on your PC.",
                  "The original USB cable.",
                  "Developer options and USB debugging turned on.",
                  "An unlocked bootloader, see {{unlock-bootloader|Unlock the bootloader}}.",
                  "The OFOX vendor_boot.img file, copied into your platform-tools folder.",
                ],
              },
            ],
          },
          {
            h: "Flash OFOX recovery",
            body: [
              "Connect the phone to the PC and open a terminal inside the platform-tools folder, then run these commands one at a time:",
              {
                code: [
                  "./adb devices",
                  "./adb reboot bootloader",
                  "./fastboot devices",
                ],
              },
              "The phone should be listed after the first and third commands. If it is, flash OFOX to both slots:",
              {
                code: [
                  "./fastboot flash vendor_boot_a vendor_boot.img",
                  "./fastboot flash vendor_boot_b vendor_boot.img",
                ],
              },
              "Now boot into recovery using the buttons on the phone: hold Power and Volume Up. When the INFINIX logo appears, let go of Power and keep holding Volume Up until OFOX recovery opens.",
              {
                note: "Do NOT run fastboot reboot recovery — on Infinix devices it causes a bootloop. Always use the Power + Volume Up buttons instead.",
              },
              {
                note: "On Windows cmd, drop the ./ at the start of each command.",
              },
            ],
          },
          {
            h: "Troubleshooting",
            body: [
              {
                ul: [
                  "Phone not listed in adb devices: re-check USB debugging, try the original cable, and accept the prompt on the phone.",
                  "Phone not listed in fastboot devices: reconnect it while it is in the bootloader and check your USB drivers.",
                  "Ended up in the stock recovery after flashing a ROM: reboot to the bootloader and flash OFOX recovery again.",
                ],
              },
            ],
          },
          {
            h: "Next steps",
            body: [
              {
                ul: [
                  "Flash a ROM: {{flash-port-rom|Flash a port ROM}} or {{flash-aosp-rom|Flash an AOSP ROM}}.",
                  "Install the bootloader patch: {{flash-fenrir|Flash Fenrir}}.",
                ],
              },
            ],
          },
        ],
      },
      {
        slug: "flash-port-rom",
        category: "Flashing Guides",
        warning:
          "Flashing a port ROM erases your data and can cause a bootloop, or a brick if a step is skipped. Port ROMs are community builds with no support from the manufacturer. Follow the steps in order.",
        title: "Flash a port ROM",
        read: "3 min read",
        info: {
          Device: "GT 20 Pro",
          Difficulty: "Medium",
          Requires: "OFOX recovery, PC",
          Updated: "Oct 17",
        },
        intro:
          "Port ROMs are flashed on top of the stock base firmware. Get the base firmware and the ROM from the {{#roms|ROMs}} tab (Flashable firmware and Port ROMs).",
        sections: [
          {
            h: "Before you start",
            body: [
              {
                ul: [
                  "OrangeFox (OFOX) recovery installed, see {{ofox-flash|OFOX flash}}.",
                  "The base ROM: XOS 15.1.2.180 is recommended for modern releases.",
                  "The port ROM zip, on the phone.",
                  "A backup of your files, because data is formatted twice.",
                ],
              },
            ],
          },
          {
            h: "Flash",
            body: [
              {
                ol: [
                  "Flash the base ROM in OFOX recovery.",
                  "Format data in recovery: type yes and format.",
                  "Reboot to system. Once it boots and everything looks fine, reboot to recovery again.",
                  "If it boots into the base recovery instead of OFOX recovery, press Reboot bootloader and flash OFOX again, see {{ofox-flash|OFOX flash}}.",
                  "Flash the port ROM, then format data again.",
                  "Reboot to system and enjoy.",
                ],
              },
              {
                note: "Modern port ROMs already include {{flash-fenrir|Fenrir}}, so there is no need to flash it separately (and flashing Fenrir manually on a port ROM requires a patched recovery first).",
              },
            ],
          },
        ],
      },
      {
        slug: "flash-aosp-rom",
        category: "Flashing Guides",
        warning:
          "This is the riskiest guide here. A wrong partition, slot or reboot method can cause a bootloop or a hard brick, and it erases your data. Do not use fastboot reboot recovery. Use only files made for the GT 20 Pro (X6871).",
        title: "Flash an AOSP ROM",
        read: "4 min read",
        info: {
          Device: "GT 20 Pro",
          Difficulty: "Hard",
          Requires: "PC, ADB and fastboot",
          Updated: "Oct 17",
        },
        intro:
          "AOSP ROMs are installed with ADB sideload from a recovery that comes with the ROM download. The ROMs are in the {{#roms|ROMs}} tab under AOSP ROMs.",
        sections: [
          {
            h: "Requirements",
            body: [
              {
                ul: [
                  "A working brain.",
                  "Battery at 60% or more is recommended.",
                  "An unlocked bootloader, see {{unlock-bootloader|Unlock the bootloader}}.",
                  "A PC with ADB and fastboot.",
                  "Firmware of at least 15.1.2.129-145. Extract the firmware zip and flash super.img: in OrangeFox choose the file, slide, scroll down and tick only the super option. Firmware is in the {{#roms|ROMs}} tab under Flashable firmware.",
                  "A data backup (optional).",
                ],
              },
            ],
          },
          {
            h: "Flash the ROM",
            body: [
              {
                ol: [
                  "Reboot to bootloader and flash the vendor_boot included in the ROM download to both slots. Change a to b in vendor_boot_a to flash the other slot.",
                  "Reboot to recovery. Do not use fastboot reboot recovery, there is a chance of a bootloop. Instead hold Power and Volume Up. When the INFINIX logo shows, let go of Power and keep holding Volume Up.",
                  "Format data in recovery.",
                  "Select ADB Sideload and run adb sideload with your ROM zip.",
                  "Tap yes to reboot to recovery when the sideload is done.",
                  "Optional: if the ROM does not include GApps, install them with ADB Sideload the same way as step 4.",
                  "Format data again, just in case.",
                  "Reboot into the ROM.",
                  "Enjoy!",
                ],
              },
              {
                code: [
                  "fastboot flash vendor_boot_a vendor_boot.img",
                  "fastboot flash vendor_boot_b vendor_boot.img",
                  "adb sideload ROM.zip",
                ],
              },
              {
                note: "Replace vendor_boot.img and ROM.zip with the real file names from the download. The first two commands are step 1, the last is for steps 4 and 6.",
              },
            ],
          },
        ],
      },
      {
        slug: "downgrade-xos",
        category: "Flashing Guides",
        warning:
          "Flashing older firmware can cause a bootloop or a dead phone if the file is wrong or the process is interrupted. Only flash the exact file listed for the GT 20 Pro (X6871) and keep the phone charged.",
        title: "Downgrade XOS",
        read: "2 min read",
        info: {
          Device: "GT 20 Pro",
          Difficulty: "Medium",
          Requires: "OFOX recovery",
          Firmware: "XOS 15.0.3",
          Updated: "Oct 17",
        },
        intro:
          "Downgrading puts an older XOS build back on the phone. The XOS 15.0.3 file is in the {{#roms|ROMs}} tab under Flashable firmware, marked as used for downgrading.",
        sections: [
          {
            h: "Video tutorial",
            body: [
              "Follow the video: {{https://t.me/NTPChats/12441|Video tutorial on downgrading}} (Telegram).",
            ],
          },
          {
            h: "Installation failed in OTA update",
            body: [
              "If you get an error message when installing the OTA update, fix it like this:",
              {
                ol: [
                  "Download XOS 15.0.3 from the {{#roms|ROMs}} tab (Flashable firmware). The original post is {{https://t.me/Infinix_GT_20_Pro_Updates/121|here}}.",
                  "Flash it in OrangeFox recovery. If you don't have it installed yet, see {{ofox-flash|OFOX flash}}.",
                  "For the flashing steps, see {{flash-port-rom|Flash a port ROM}}, which flashes the base firmware the same way. The original post is {{https://t.me/gt20pro/118667?single|here}}.",
                  "After flashing XOS 15.0.3, boot into system and do a full OTA update to {{#roms/xos-15-1-2-180|XOS 15.1.2.180}}. Then update to XOS 16.3 using the {{xos16-local-update|Local Update Guide}}. You can {{lock-bootloader|lock the bootloader}} again if you want.",
                ],
              },
              {
                note: "If you are getting upgrade problems with the OTA update, use {{#roms/xos-15-0-3|XOS 15.0.3}}. You should do a full OTA update to {{#roms/xos-15-1-2-180|XOS 15.1.2.180}} after flashing XOS 15.0.3. Back up your files first, as flashing firmware in recovery usually needs a data format.",
              },
            ],
          },
        ],
      },
      {
        slug: "unlock-bootloader",
        category: "Bootloader Guides",
        warning:
          "Unlocking erases all data and can void your warranty. Do not interrupt the process or disconnect the cable while it runs.",
        title: "Unlock the bootloader",
        read: "4 min read",
        info: {
          Device: "GT 20 Pro (X6871)",
          Difficulty: "Easy",
          Requires: "Windows PC",
          Wipes: "All data",
          Updated: "Oct 17",
        },
        intro: [
          "Unlocking the bootloader is the first step before flashing OFOX recovery, custom ROMs and kernels. Read the whole guide, especially the warnings, before you start.",
          "Guide based on {{https://infinix-gt20-pro.github.io/.com/#guide|infinix-gt20-pro.github.io}}.",
        ],
        sections: [
          {
            h: "Prerequisites",
            body: [
              {
                ul: [
                  "An Infinix account logged in on the phone.",
                  "The account must be at least 14 days old.",
                  "OEM unlocking available in Developer options.",
                  "A good quality USB cable.",
                  "A Windows PC.",
                  "MTK USB drivers installed.",
                  "Android platform tools installed.",
                ],
              },
            ],
          },
          {
            h: "Unlock",
            body: [
              {
                ol: [
                  "Open Settings, About phone, Version info.",
                  "Tap Build number 7 times to enable Developer options.",
                  "Go to Settings, System, Developer options.",
                  "Turn on OEM unlocking and USB debugging.",
                  "Connect the phone to the PC with the USB cable.",
                  "Open the platform-tools folder.",
                  "Click the address bar, type cmd and press Enter.",
                  "Run adb devices to check the connection. Tap Allow on the USB debugging prompt on the phone.",
                  "Run adb reboot bootloader to boot into fastboot mode.",
                  "In fastboot mode, run fastboot flashing unlock.",
                  "A confirmation screen appears on the phone. Press Volume Up to confirm the unlock.",
                  "Wait for the unlock to finish.",
                  "Reboot with fastboot reboot.",
                  "The phone factory resets itself on the next boot.",
                ],
              },
              {
                code: [
                  "adb devices",
                  "adb reboot bootloader",
                  "fastboot flashing unlock",
                  "fastboot reboot",
                ],
              },
              "The commands in order. Run them one at a time in the cmd window you opened inside platform-tools.",
            ],
          },
          {
            h: "After unlocking",
            body: [
              "The phone is ready for OrangeFox (OFOX) recovery, custom ROMs and kernels. Continue with {{ofox-flash|OFOX flash}}.",
            ],
          },
          {
            h: "Warnings",
            body: [
              {
                note: "Unlocking the bootloader permanently erases all user data. Make a complete backup first.",
              },
              {
                ul: [
                  "The first boot after unlocking can take several minutes.",
                  "OTA updates may fail or be blocked on modified recovery setups.",
                  "Wrong flashing procedures can leave the phone unable to boot.",
                  "Only continue if you understand the risks. You are responsible for anything that happens to your phone.",
                ],
              },
            ],
          },
        ],
      },
      {
        slug: "lock-bootloader",
        category: "Bootloader Guides",
        by: "Mehraann",
        warning:
          "Lock the bootloader only on a fully compatible stock ROM. Do not lock the bootloader on modified firmware, custom ROMs, GSIs, rooted systems, or devices with modified partitions. Failure to follow these requirements may result in a bootloop, soft brick, hard brick, or an unbootable device. Proceed at your own risk.",
        title: "Lock the bootloader",
        read: "2 min read",
        info: {
          Device: "GT 20 Pro (X6871)",
          By: "Mehraann",
          Difficulty: "Easy",
          Requires: "Stock ROM, PC",
          Updated: "Oct 17",
        },
        intro:
          "Re-locking the bootloader restores the factory locked state on a clean stock XOS firmware installation. Download the stock flashable firmware ZIP from {{#roms/Flashable firmware|Flashable firmware in the ROMs tab}}.",
        sections: [
          {
            h: "Steps",
            body: [
              {
                ol: [
                  "Flash the provided flashable ZIP ({{#roms/Flashable firmware|Flashable firmware}}).",
                  "Boot the device into Android once.",
                  "Reboot into Fastboot/Bootloader mode.",
                  "Connect the device to your PC.",
                  "Open Command Prompt or Terminal and execute:",
                  "A confirmation screen will appear on the device.",
                  "Use Volume Up to select Lock the Bootloader.",
                  "Press the Power button to confirm.",
                  "After the bootloader is locked, hold the Power button to reboot the device.",
                ],
              },
              {
                code: ["fastboot flashing lock"],
              },
            ],
          },
          {
            h: "Warning",
            body: [
              {
                ul: [
                  "Lock the bootloader only on a fully compatible stock ROM.",
                  "Do not lock the bootloader on modified firmware, custom ROMs, GSIs, rooted systems, or devices with modified partitions.",
                  "Failure to follow these requirements may result in a bootloop, soft brick, hard brick, or an unbootable device.",
                  "Proceed at your own risk.",
                ],
              },
            ],
          },
        ],
      },
      {
        slug: "flash-fenrir",
        category: "Bootloader Guides",
        warning:
          "Fenrir patches the bootloader. Flashing the wrong version for your firmware, or a failed flash, can hard brick the phone. Match the zip to your exact firmware and never turn the phone off while flashing.",
        title: "Flash Fenrir",
        read: "4 min read",
        info: {
          Device: "GT 20 Pro (X6871)",
          Difficulty: "Easy",
          Requires: "OFOX recovery",
          Updated: "Oct 17",
        },
        intro: [
          "Fenrir (Renkai) is a patched bootloader for the GT 20 Pro. It makes the phone report a locked bootloader with a green verified boot state, so you can run custom kernels, recoveries and ported ROMs and still pass Play Integrity. It also removes the yellow unlocked warning at boot.",
          "Source and updates: {{https://github.com/sheikhmehraann/Renkai-X6871|github.com/sheikhmehraann/Renkai-X6871}}. The zips are in the {{#recovery|Recovery & Tools}} tab.",
        ],
        sections: [
          {
            h: "Supported firmware",
            body: [
              "Each package is built for one firmware. Pick the one that matches what is installed on the phone.",
              {
                ul: [
                  "Android 15: XOS 15.1.2.165 and 15.1.2.180",
                  "Android 14: XOS 14 (H962CF-U-OP-250217V2673)",
                ],
              },
              {
                note: "Never flash it across mismatched firmware versions or other devices. The bootloader binaries are specific to the platform and version. Firmware zips are in the {{#roms|ROMs}} tab under Flashable firmware.",
              },
            ],
          },
          {
            h: "Before you start",
            body: [
              {
                ul: [
                  "A working OrangeFox (OFOX) recovery, see {{ofox-flash|OFOX flash}}.",
                  "The Fenrir zip for your Android version (A14 or A15) on the phone.",
                  "A backup of your files.",
                ],
              },
              {
                note: "Port ROMs: Flashing Fenrir on a port ROM requires a patched recovery first. However, modern port ROMs already include Fenrir out of the box, so there is no need to flash it there.",
              },
              {
                note: "The first install needs a full Format Data. Fenrir makes the bootloader report as locked, which changes how the keys are derived, so data encrypted before that cannot be decrypted. Everything on internal storage is erased.",
              },
            ],
          },
          {
            h: "Install from recovery",
            body: [
              {
                ol: [
                  "Reboot to OrangeFox (OFOX) recovery.",
                  "Tap the Fenrir zip and swipe to install.",
                  "Go to Wipe, then Format Data, type yes and confirm.",
                  "Reboot to system.",
                ],
              },
            ],
          },
          {
            h: "Install with fastboot (PC)",
            body: [
              "Use this if you have the extracted files instead of the zip. Power off, hold Power and Volume Down to enter fastboot, then open a terminal in the folder for your Android version (A14 or A15).",
              {
                code: [
                  "fastboot flash lk_a lk-patched.img",
                  "fastboot flash lk_b lk-patched.img",
                ],
              },
              "Optionally flash the clean boot logo to remove the warning artifacts:",
              {
                code: [
                  "fastboot flash logo_a logo-patched.img",
                  "fastboot flash logo_b logo-patched.img",
                ],
              },
              "Then boot into OFOX recovery (hold Power + Volume Up), format data as above and reboot to system.",
            ],
          },
          {
            h: "Good to know",
            body: [
              {
                ul: [
                  "Custom kernels boot normally, with no yellow or red bootloader warning.",
                  "Use an OrangeFox (OFOX) build that is confirmed working on X6871, and avoid recoveries that force-disable vbmeta when installing.",
                  "Flashing Fenrir in port ROMs requires a patched recovery first — though modern port ROMs already include Fenrir, so there is no need to flash it there.",
                  "Holding Volume Down at boot goes straight to fastboot, and Volume Up still enters recovery.",
                ],
              },
            ],
          },
        ],
      },
      {
        slug: "patched-and-gki-kernels",
        category: "Rooting Guides",
        warning:
          "Flashing a mismatched boot.img or an incompatible kernel can cause a bootloop or a brick. Always match the boot.img to your exact XOS version and back up your data first.",
        title: "Guide to patched kernels and GKI kernels",
        read: "3 min read",
        info: {
          Device: "GT 20 Pro",
          Difficulty: "Easy",
          Requires: "PC or OFOX recovery",
          Updated: "Oct 17",
        },
        intro:
          "You can root and manage kernels on the GT 20 Pro either by patching your stock boot.img with a kernel manager app and flashing it via fastboot, or by flashing a GKI kernel zip in OFOX recovery.",
        sections: [
          {
            h: "Patch and flash boot.img",
            body: [
              {
                ol: [
                  "Download a kernel manager app from {{#kernels/KSU Ultra .apk|KSU Ultra .apk in the Kernels tab}}, and download the boot.img that matches your exact XOS version from {{#roms/boot.img files|boot.img files in the ROMs tab}}.",
                  "Open the kernel manager app, choose Select a file and Patch, and pick the boot.img you downloaded.",
                  "Transfer the newly patched boot.img to your laptop and flash it to both slots in fastboot:",
                  "Reboot and enjoy.",
                ],
              },
              {
                code: [
                  "fastboot flash boot_a (file-path/drag and drop the boot.img here)",
                  "fastboot flash boot_b (file-path/drag and drop the boot.img here)",
                ],
              },
              {
                note: "Pre-patched boot images are also available under {{#kernels/Patched boot.img|Patched boot.img in the Kernels tab}} if your build is listed there.",
              },
            ],
          },
          {
            h: "Flash GKI kernels",
            body: [
              "Download your preferred kernel zip from {{#kernels/GKI kernels|GKI kernels in the Kernels tab}}, then flash it in OFOX recovery:",
              {
                ol: [
                  "Reboot to recovery ({{ofox-flash|OFOX recovery}}).",
                  "Choose the kernel.zip file and swipe to flash it.",
                  "Reboot and enjoy.",
                ],
              },
            ],
          },
        ],
      },
      {
        slug: "apps-backup-swiftbackup",
        category: "Rooting Guides",
        warning:
          "Backups can fail or be incomplete. Keep a copy of the folder on another device and don't wipe the phone until you have checked the backup is there. Not all apps restore their data.",
        title: "Apps backup using Swiftbackup",
        read: "3 min read",
        info: {
          Device: "GT 20 Pro",
          Requires: "Root",
          App: "Swiftbackup",
          Updated: "Oct 17",
        },
        intro:
          "Back up your apps and their data with Swiftbackup before flashing a ROM, then restore everything afterwards. You need root, a Google account, and a second device to keep the backup on, like a laptop.",
        sections: [
          {
            h: "Backup",
            body: [
              {
                ol: [
                  "Make sure the phone is rooted and that you gave Swiftbackup root access.",
                  "Sign in with a Google account.",
                  "Back up all apps and tick every option.",
                  'A folder named "swiftbackup" will appear in your files. Copy it to a second device, for example your laptop.',
                ],
              },
              {
                note: "Flashing a ROM usually wipes internal storage. If the backup only lives on the phone, it goes with it.",
              },
            ],
          },
          {
            h: "Restore",
            body: [
              {
                ol: [
                  'After flashing, copy the "swiftbackup" folder back to the phone before you open Swiftbackup.',
                  "Inside the folder, open the apks folder. You will find the Swiftbackup apk there. Install it and give it root access again.",
                  "Sign in with the same Google account you used for the backup.",
                  "Restore all apps and tick every box again.",
                ],
              },
              {
                note: "Use the same Google account both times, otherwise Swiftbackup won't pick up your backup.",
              },
            ],
          },
        ],
      },
    ],
  },
};
