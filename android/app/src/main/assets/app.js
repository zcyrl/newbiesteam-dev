(function () {
  "use strict";

  var S = window.SITE || {};
  var view = document.getElementById("view");
  var hero = document.getElementById("hero");
  var tabsBox = document.getElementById("tabs");
  var logo = document.getElementById("logo");
  var metaTheme = document.getElementById("meta-theme");
  var ADMIN_API = "http://127.0.0.1:4720";
  var isHost = false;

  var TABS = [
    ["roms", "ROMs"],
    ["app", "App"],
    ["modules", "Modules"],
    ["kernels", "Kernels"],
    ["recovery", "Recovery & Tools"],
    ["screenshots", "Screenshots"],
    ["updates", "Updates"],
    ["guides", "Guides"]
  ];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
  }

  function safeUrl(u) {
    if (!u) return null;
    if (u.charAt(0) === "#") return u;
    try {
      var x = new URL(u, location.href);
      return /^https?:$/.test(x.protocol) ? x.href : null;
    } catch (e) {
      return null;
    }
  }

  function resolveAssetUrl(u) {
    if (!u) return "";
    if (typeof u !== "string") return u;
    if (
      u.startsWith("http://") ||
      u.startsWith("https://") ||
      u.startsWith("data:") ||
      u.startsWith("blob:")
    ) {
      return u;
    }
    var clean = u.replace(/^(\.\/|\/)+/, "");
    // In Android APK WebView (file:///android_asset/...)
    if (window.location.protocol === "file:" || window.location.protocol === "content:") {
      // Everything under assets/ and icons/ ships inside the APK (fonts, sprite
      // SVGs, ROM banners, posted update images, logos) — serve locally first;
      // attachImgFallback retries the CDN when a newer asset isn't bundled yet.
      if (clean.startsWith("icons/") || clean.startsWith("assets/")) {
        return clean;
      }
      return "https://newbiesteam.pages.dev/" + clean;
    }
    return u;
  }

  function attachImgFallback(img, originalUrl) {
    if (!img) return;
    img.addEventListener("error", function () {
      if (this.dataset.fallbackApplied) return;
      this.dataset.fallbackApplied = "1";
      if (originalUrl) {
        var clean = String(originalUrl).replace(/^(\.\/|\/)+/, "");
        var surgeUrl = "https://newbiesteam.pages.dev/" + clean;
        if (this.src !== surgeUrl) {
          this.src = surgeUrl;
          return;
        }
      }
      this.src = "icons/icon-192.png";
      this.style.objectFit = "contain";
      this.style.opacity = "0.7";
    });
  }

  function prefersCalm() {
    return !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  /* ---------- deep linking, slugs, toasts, and aliases ---------- */
  function slugify(str) {
    if (!str) return "";
    return String(str)
      .toLowerCase()
      .trim()
      .replace(/\./g, "-")
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  var SLUG_ALIASES = {
    // Recovery & Tools
    "ofox": { tab: "recovery", slug: "ofox-r-12-0-xos-15-1-2" },
    "orangefox": { tab: "recovery", slug: "ofox-r-12-0-xos-15-1-2" },
    "orangefox-recovery": { tab: "recovery", slug: "ofox-r-12-0-xos-15-1-2" },
    "ofox-recovery": { tab: "recovery", slug: "ofox-r-12-0-xos-15-1-2" },
    "twrp": { tab: "recovery", slug: "ofox-r-12-0-xos-15-1-2" },
    "fenrir": { tab: "recovery", slug: "fenrir-a15" },
    "fenrir-a15": { tab: "recovery", slug: "fenrir-a15" },
    "fenrir-a14": { tab: "recovery", slug: "fenrir-a14" },

    // Universal & OEM Modules
    "remalwack": { tab: "modules", slug: "re-malwack-v8-2" },
    "re-malwack": { tab: "modules", slug: "re-malwack-v8-2" },
    "malwack": { tab: "modules", slug: "re-malwack-v8-2" },
    "viper": { tab: "modules", slug: "viper4android-v2-1-1" },
    "viper4android": { tab: "modules", slug: "viper4android-v2-1-1" },
    "v4a": { tab: "modules", slug: "viper4android-v2-1-1" },
    "hios-xos-fixes": { tab: "modules", slug: "hios-xos-fixes" },
    "xos-fixes": { tab: "modules", slug: "hios-xos-fixes" },
    "stock-touch": { tab: "modules", slug: "stock-touch-bbk" },

    // Kernels
    "vortex": { tab: "kernels", slug: "vortex" },
    "zixine": { tab: "kernels", slug: "zixine" },
    "ksu": { tab: "kernels", slug: "ksu-12845-hios-14-0-0-122-145" },

    // ROMs
    "hyperos": { tab: "roms", slug: "hyperos-2-0-by-softbrick" },
    "flyme": { tab: "roms", slug: "flyme-11-25-7-15-by-softbrick" },
    "originos": { tab: "roms", slug: "originos-5-by-softbrick" },
    "coloros": { tab: "roms", slug: "coloros-15-v2" },
    "hios": { tab: "roms", slug: "hios-14-official-firmware" },
    "matrixx": { tab: "roms", slug: "project-matrixx-11-1-0" },
    "pixel": { tab: "roms", slug: "pixel-experience" },
    "lineage": { tab: "roms", slug: "lineageos" },
    "xos-15-0-3": { tab: "roms", slug: "xos-15-0-3" },
    "xos15-0-3": { tab: "roms", slug: "xos-15-0-3" },
    "xos-15-1-2-180": { tab: "roms", slug: "xos-15-1-2-180" },
    "xos15-1-2-180": { tab: "roms", slug: "xos-15-1-2-180" },

    // Guides
    "unlock": { tab: "guides", slug: "unlock-bootloader" },
    "unlock-bootloader": { tab: "guides", slug: "unlock-bootloader" },
    "lock-bootloader": { tab: "guides", slug: "lock-bootloader" },
    "ofox-flash": { tab: "guides", slug: "ofox-flash" },
    "flash-port-rom": { tab: "guides", slug: "flash-port-rom" },
    "flash-aosp-rom": { tab: "guides", slug: "flash-aosp-rom" },
    "patched-and-gki-kernels": { tab: "guides", slug: "patched-and-gki-kernels" },
    "flash-fenrir": { tab: "guides", slug: "flash-fenrir" },
    "downgrade-xos": { tab: "guides", slug: "downgrade-xos" },
    "xos16-local-update": { tab: "guides", slug: "xos16-local-update" },
    "xos-16-local-update": { tab: "guides", slug: "xos16-local-update" },
    "local-update": { tab: "guides", slug: "xos16-local-update" },

    // App
    "app": { tab: "app", slug: "" },
    "apk": { tab: "app", slug: "" },
    "v1.2.1": { tab: "app", slug: "newbiesteam-app-v1-2-1" },
    "v1-2-1": { tab: "app", slug: "newbiesteam-app-v1-2-1" },
    "v1.2.0": { tab: "app", slug: "newbiesteam-app-v1-2-0" },
    "v1-2-0": { tab: "app", slug: "newbiesteam-app-v1-2-0" }
  };

  var toastTimer = null;
  var toastEl = null;

  function showToast(msg, duration) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "nb-toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      if (toastEl) toastEl.classList.remove("is-visible");
    }, duration || 2400);
  }

  function fallbackCopyText(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    } catch (e) {}
  }

  function copyElementDeepLink(name, hashPath) {
    var fullUrl = window.location.origin + window.location.pathname + hashPath;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullUrl).then(function () {
        showToast("📋 Link copied: " + hashPath);
      }).catch(function () {
        fallbackCopyText(fullUrl);
        showToast("📋 Link copied: " + hashPath);
      });
    } else {
      fallbackCopyText(fullUrl);
      showToast("📋 Link copied: " + hashPath);
    }
  }

  function highlightElement(el) {
    if (!el) return;
    el.classList.remove("card-target-highlight");
    void el.offsetWidth;
    el.classList.add("card-target-highlight");
    setTimeout(function () {
      el.classList.remove("card-target-highlight");
    }, 2600);
  }

  var PREFERRED_ALIASES = {
    "ofox-r-12-0-xos-15-1-2": "#ofox",
    "re-malwack-v8-2": "#re-malwack",
    "viper4android-v2-1-1": "#viper",
    "vortex": "#vortex",
    "zixine": "#zixine",
    "hyperos-2-0-by-softbrick": "#hyperos",
    "flyme-11-25-7-15-by-softbrick": "#flyme",
    "originos-5-by-softbrick": "#originos",
    "coloros-15-v2": "#coloros",
    "hios-14-official-firmware": "#hios",
    "newbiesteam-app-v1-2-1": "#app/v1-2-1",
    "newbiesteam-app-v1-2-0": "#app/v1-2-0",
    "unlock-bootloader": "#guides/unlock-bootloader",
    "lock-bootloader": "#guides/lock-bootloader",
    "ofox-flash": "#guides/ofox-flash",
    "xos16-local-update": "#guides/xos16-local-update",
    "xos-15-0-3": "#roms/xos-15-0-3",
    "xos-15-1-2-180": "#roms/xos-15-1-2-180"
  };

  function getItemCanonicalHash(it, tabName) {
    var s = slugify((it && (it.name || it.title || it.version)) || "");
    var tab = tabName || "roms";
    if (PREFERRED_ALIASES[s]) {
      return PREFERRED_ALIASES[s];
    }
    return "#" + tab + "/" + s;
  }

  function resolveRouteHash(hashString) {
    var raw = (hashString || location.hash || "").replace(/^#\/?/, "").trim();
    if (!raw) return { tab: "roms", slug: "" };

    var lowerRaw = raw.toLowerCase();
    if (SLUG_ALIASES[lowerRaw]) {
      return { tab: SLUG_ALIASES[lowerRaw].tab, slug: SLUG_ALIASES[lowerRaw].slug };
    }

    var parts = raw.split("/").map(function (p) {
      try { return decodeURIComponent(p); } catch (e) { return p; }
    });

    var firstPart = (parts[0] || "").toLowerCase();
    var isKnownTab = TABS.some(function (t) { return t[0] === firstPart; });

    if (isKnownTab) {
      var tab = firstPart;
      var slug = parts.slice(1).join("/");
      var lowerSlug = slug.toLowerCase();
      if (SLUG_ALIASES[lowerSlug] && SLUG_ALIASES[lowerSlug].tab === tab) {
        slug = SLUG_ALIASES[lowerSlug].slug;
      }
      return { tab: tab, slug: slug };
    }

    if (SLUG_ALIASES[firstPart]) {
      return { tab: SLUG_ALIASES[firstPart].tab, slug: SLUG_ALIASES[firstPart].slug };
    }

    var target = findItemGlobally(lowerRaw);
    if (target) {
      return { tab: target.tab, slug: target.slug };
    }

    return { tab: "roms", slug: "" };
  }

  function findItemGlobally(query) {
    if (!query) return null;
    var qClean = slugify(query);

    var guides = (S.guides && S.guides.items) || [];
    for (var gi = 0; gi < guides.length; gi++) {
      var g = guides[gi];
      if (g.slug === qClean || slugify(g.title) === qClean || qClean.indexOf(g.slug) !== -1) {
        return { tab: "guides", slug: g.slug };
      }
    }

    var searchTabs = ["recovery", "modules", "kernels", "roms", "app"];
    for (var ti = 0; ti < searchTabs.length; ti++) {
      var tabKey = searchTabs[ti];
      if (tabKey === "app") {
        var rels = S.appReleases || [];
        for (var ri = 0; ri < rels.length; ri++) {
          var rel = rels[ri];
          var rSlug = slugify(rel.name || ("app-" + rel.version));
          if (rSlug.indexOf(qClean) !== -1 || qClean.indexOf(slugify(rel.version)) !== -1) {
            return { tab: "app", slug: rSlug };
          }
        }
      } else {
        var groups = S[tabKey] || [];
        for (var grpi = 0; grpi < groups.length; grpi++) {
          var grp = groups[grpi];
          if (slugify(grp.title) === qClean) {
            return { tab: tabKey, slug: slugify(grp.title) };
          }
          if (grp.feature && slugify(grp.feature.name).indexOf(qClean) !== -1) {
            return { tab: tabKey, slug: slugify(grp.feature.name) };
          }
          var items = grp.items || [];
          for (var ii = 0; ii < items.length; ii++) {
            var it = items[ii];
            var itSlug = slugify(it.name);
            if (itSlug === qClean || itSlug.indexOf(qClean) !== -1 || qClean.indexOf(itSlug) !== -1) {
              return { tab: tabKey, slug: itSlug };
            }
          }
        }
      }
    }
    return null;
  }

  function findTargetElement(slug) {
    if (!slug) return null;
    var clean = slugify(slug);
    var el = document.getElementById("item-" + clean) ||
             document.getElementById("panel-" + clean) ||
             document.getElementById(clean);
    if (el) return el;

    el = view.querySelector('[data-slug="' + clean + '"]');
    if (el) return el;

    var tagged = view.querySelectorAll("[data-slug]");
    for (var i = 0; i < tagged.length; i++) {
      var s = tagged[i].getAttribute("data-slug");
      if (s && (s.indexOf(clean) !== -1 || clean.indexOf(s) !== -1)) {
        return tagged[i];
      }
    }

    var panels = view.querySelectorAll(".panel");
    for (var j = 0; j < panels.length; j++) {
      var h2 = panels[j].querySelector("h2");
      if (h2 && slugify(h2.textContent) === clean) {
        return panels[j];
      }
    }
    return null;
  }

  function getInstalledAppVersion() {
    // 1. Direct native AndroidBridge call
    if (window.AndroidBridge && typeof window.AndroidBridge.getAppVersion === "function") {
      try {
        var bridgeVer = window.AndroidBridge.getAppVersion();
        if (bridgeVer) {
          var cleanBridge = String(bridgeVer).trim().replace(/^v/i, "");
          if (cleanBridge) return cleanBridge;
        }
      } catch (e) {}
    }
    // 2. Direct injected global from native WebView
    if (window.__NBT_APP_VERSION__) {
      var direct = String(window.__NBT_APP_VERSION__).trim().replace(/^v/i, "");
      if (direct) return direct;
    }
    // 3. UserAgent match: NewbiesTeamAndroid/1.2.3 or NewbiesDevAndroid/1.2.3
    var appMatch = navigator.userAgent.match(/Newbies(?:Team|Dev)Android\/([0-9]+(?:\.[0-9]+)*)/i);
    if (appMatch && appMatch[1]) {
      return appMatch[1];
    }
    return null;
  }

  function getInstalledAppBuildCode() {
    // 1. Direct native AndroidBridge call
    if (window.AndroidBridge && typeof window.AndroidBridge.getAppVersionCode === "function") {
      try {
        var code = window.AndroidBridge.getAppVersionCode();
        if (code !== undefined && code !== null && String(code) !== "0") {
          return String(code).trim();
        }
      } catch (e) {}
    }
    // 2. Direct injected global from native WebView
    if (window.__NBT_BUILD_CODE__) {
      return String(window.__NBT_BUILD_CODE__).trim();
    }
    // 3. UserAgent match: (Build 8)
    var buildMatch = navigator.userAgent.match(/Newbies(?:Team|Dev)Android\/[^\s]+ \(Build (\d+)\)/i);
    if (buildMatch && buildMatch[1]) {
      return buildMatch[1];
    }
    return null;
  }

  function openAboutModal() {
    var existing = document.getElementById("ksu-about-modal");
    if (existing) existing.remove();

    var installedVer = getInstalledAppVersion();
    var buildCode = getInstalledAppBuildCode();
    var latestRelease = (S.appReleases && S.appReleases[0]) || { version: "v2.0.0" };
    var cleanLatest = (latestRelease.version || "2.0.0").replace(/^v/i, "");
    var dispVer = installedVer ? ("v" + installedVer + (buildCode ? " (" + buildCode + ")" : "")) : ("v" + cleanLatest);

    var modal = el("div", "ksu-modal-backdrop");
    modal.id = "ksu-about-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "About NewbiesTeam");

    var card = el("div", "ksu-about-sheet");

    // Header with back arrow & title
    var head = el("div", "ksu-sheet-head");
    var backBtn = el("button", "ksu-back-btn");
    backBtn.setAttribute("type", "button");
    backBtn.setAttribute("aria-label", "Close About dialog");
    backBtn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
    backBtn.addEventListener("click", closeAboutModal);
    head.appendChild(backBtn);

    var headTitle = el("div", "ksu-sheet-head-title", "About");
    head.appendChild(headTitle);

    var closeBtn = el("button", "ksu-close-btn");
    closeBtn.setAttribute("type", "button");
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
    closeBtn.addEventListener("click", closeAboutModal);
    head.appendChild(closeBtn);
    card.appendChild(head);

    // Hero section: Centered Logo + App Name + Version (matching SukiSU/KSU screenshot)
    var hero = el("div", "ksu-about-hero");

    var logoWrap = el("div", "ksu-logo-wrap");
    var logoImg = el("img", "ksu-about-logo");
    logoImg.src = resolveAssetUrl("assets/newbies-app-logo.svg");
    attachImgFallback(logoImg, "assets/newbies-app-logo.svg");
    logoImg.alt = "NewbiesTeam Logo";
    logoImg.width = 96;
    logoImg.height = 96;
    logoWrap.appendChild(logoImg);
    hero.appendChild(logoWrap);

    var appTitle = el("h2", "ksu-about-title", "NewbiesTeam");
    hero.appendChild(appTitle);

    var verBadge = el("div", "ksu-about-version", dispVer);
    hero.appendChild(verBadge);

    var devBadge = el("div", "ksu-about-device", "Infinix GT 20 Pro • X6871");
    hero.appendChild(devBadge);

    card.appendChild(hero);

    // Action Cards Group (GitHub, Telegram, Website)
    var actionsGroup = el("div", "ksu-card-group");

    // GitHub
    var ghLink = el("a", "ksu-list-item");
    ghLink.href = "https://github.com/zcyrl/newbiesteam-app";
    ghLink.target = "_blank";
    ghLink.rel = "noopener noreferrer";
    ghLink.innerHTML = '<div class="ksu-item-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg></div><div class="ksu-item-label">View source code at GitHub</div><div class="ksu-item-arrow"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg></div>';
    actionsGroup.appendChild(ghLink);

    // Telegram
    var tgLink = el("a", "ksu-list-item");
    tgLink.href = "https://t.me/NewbiesTeamBase";
    tgLink.target = "_blank";
    tgLink.rel = "noopener noreferrer";
    tgLink.innerHTML = '<div class="ksu-item-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.197 1.006.128.832.941z"/></svg></div><div class="ksu-item-label">Join our Telegram channel</div><div class="ksu-item-arrow"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg></div>';
    actionsGroup.appendChild(tgLink);

    // Official Web Portal
    var webLink = el("a", "ksu-list-item");
    webLink.href = "https://newbiesteam.pages.dev";
    webLink.target = "_blank";
    webLink.rel = "noopener noreferrer";
    webLink.innerHTML = '<div class="ksu-item-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/></svg></div><div class="ksu-item-label">Official Web Portal</div><div class="ksu-item-arrow"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg></div>';
    actionsGroup.appendChild(webLink);

    card.appendChild(actionsGroup);

    // Credits Section — Core Team & Roles
    var creditsGroup = el("div", "ksu-card-group ksu-credits-box");
    var credTitle = el("div", "ksu-credits-title", "Core Team & Roles");
    creditsGroup.appendChild(credTitle);

    var teamMembers = [
      {
        name: "Softbrick",
        handle: "@zcyrl",
        tg: "https://t.me/zcyrl",
        role: "Web/App maintainer and Tester",
        iconSvg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><polyline points="7 8 10 10 7 12"/><line x1="12" y1="12" x2="16" y2="12"/></svg>'
      },
      {
        name: "Abdul",
        handle: "@MBuTT3178",
        tg: "https://t.me/MBuTT3178",
        role: "Porter and Team Owner",
        iconSvg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>'
      },
      {
        name: "Mehraann",
        handle: "@mehraann19",
        tg: "https://t.me/mehraann19",
        role: "Developer and Porter",
        iconSvg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/></svg>'
      },
      {
        name: "Samarth",
        handle: "@FruitJuiceFx",
        tg: "https://t.me/FruitJuiceFx",
        role: "Banner artist and Tester",
        iconSvg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".7" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".7" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".7" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".7" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/></svg>'
      }
    ];

    teamMembers.forEach(function (m) {
      var row = el("div", "ksu-credit-item");
      row.innerHTML =
        '<div class="ksu-credit-icon" aria-hidden="true">' + m.iconSvg + '</div>' +
        '<div class="ksu-credit-info">' +
          '<div class="ksu-credit-name-row">' +
            '<span class="ksu-credit-name">' + m.name + '</span>' +
            '<a href="' + m.tg + '" target="_blank" rel="noopener noreferrer" class="ksu-credit-handle">' + m.handle + '</a>' +
          '</div>' +
          '<div class="ksu-credit-role">' + m.role + '</div>' +
        '</div>';
      creditsGroup.appendChild(row);
    });

    card.appendChild(creditsGroup);

    // Tagline / Signoff
    var signoff = el("div", "ksu-about-footer");
    signoff.innerHTML = "Control your phone, ROM, Theme and ideas.<br><small>Unofficial GT 20 Pro Community</small>";
    card.appendChild(signoff);

    modal.appendChild(card);
    document.body.appendChild(modal);

    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeAboutModal();
    });

    requestAnimationFrame(function () {
      modal.classList.add("is-active");
    });
  }

  function closeAboutModal() {
    var modal = document.getElementById("ksu-about-modal");
    if (!modal) return;
    modal.classList.remove("is-active");
    setTimeout(function () {
      if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
    }, 220);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAboutModal();
    }
  });

  function syncFooterAppVersion() {
    var footerAppVer = document.getElementById("footer-app-ver");
    if (!footerAppVer) return;

    footerAppVer.innerHTML =
      '<div class="footer-bottom-actions">' +
        '<button type="button" class="footer-app-pill footer-about-btn" id="footer-about-btn" title="About NewbiesTeam" aria-label="About NewbiesTeam">' +
          '<span class="footer-about-icon">ⓘ</span> About' +
        '</button>' +
      '</div>';

    var aboutBtn = document.getElementById("footer-about-btn");
    if (aboutBtn) {
      aboutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        openAboutModal();
      });
    }
  }

  window.addEventListener("nbt:app-ready", function () {
    syncFooterAppVersion();
  });

  /* ---------- nav, liquid glass cover, telegram, credit, theme ---------- */
  var tabLinks = [];
  TABS.forEach(function (t) {
    var a = el("a", "tab", t[1]);
    a.href = "#" + t[0];
    a.dataset.tab = t[0];
    tabsBox.appendChild(a);
    tabLinks.push(a);
  });

  var tabGlass = el("span", "tab-glass no-trans");
  tabGlass.setAttribute("aria-hidden", "true");
  var tabGlassLens = el("span", "tab-glass-lens no-trans");
  tabGlassLens.setAttribute("aria-hidden", "true");
  tabsBox.appendChild(tabGlass);
  tabsBox.appendChild(tabGlassLens);

  var tabGlassReady = false;
  var padX = 2;
  var padY = 1;

  function syncTabsFade() {
    var maxScroll = tabsBox.scrollWidth - tabsBox.clientWidth;
    if (maxScroll <= 2) {
      tabsBox.classList.remove("fade-l", "fade-r", "fade-lr");
      return;
    }
    var sl = tabsBox.scrollLeft;
    var fadeL = sl > 4;
    var fadeR = sl < maxScroll - 4;
    tabsBox.classList.toggle("fade-lr", fadeL && fadeR);
    tabsBox.classList.toggle("fade-l", fadeL && !fadeR);
    tabsBox.classList.toggle("fade-r", !fadeL && fadeR);
  }
  tabsBox.addEventListener("scroll", syncTabsFade, { passive: true });

  function syncTabGlass(activeEl, animate) {
    if (!activeEl) {
      tabGlass.style.opacity = "0";
      tabGlassLens.style.opacity = "0";
      tabGlassReady = false;
      syncTabsFade();
      return;
    }
    var toX = activeEl.offsetLeft - padX;
    var toY = activeEl.offsetTop - padY;
    var toW = activeEl.offsetWidth + padX * 2;
    var toH = activeEl.offsetHeight + padY * 2;
    var toTf = "translate3d(" + toX + "px," + toY + "px,0)";

    if (!animate || !tabGlassReady || prefersCalm()) {
      tabGlass.classList.add("no-trans");
      tabGlassLens.classList.add("no-trans");
      tabGlass.style.width = toW + "px";
      tabGlass.style.height = toH + "px";
      tabGlass.style.transform = toTf;
      tabGlass.style.opacity = "1";
      tabGlassLens.style.width = toW + "px";
      tabGlassLens.style.height = toH + "px";
      tabGlassLens.style.transform = toTf;
      tabGlassLens.style.opacity = "1";
      tabGlassReady = true;
      syncTabsFade();
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          tabGlass.classList.remove("no-trans");
          tabGlassLens.classList.remove("no-trans");
        });
      });
      return;
    }

    tabGlass.classList.remove("no-trans");
    tabGlassLens.classList.remove("no-trans");
    tabGlass.style.width = toW + "px";
    tabGlass.style.height = toH + "px";
    tabGlass.style.transform = toTf;
    tabGlass.style.opacity = "1";
    tabGlassLens.style.width = toW + "px";
    tabGlassLens.style.height = toH + "px";
    tabGlassLens.style.transform = toTf;
    tabGlassLens.style.opacity = "1";
    syncTabsFade();
  }

  /* Allow dragging/sliding the Liquid Glass pill across tabs by mouse or touch */
  var dragActive = false;
  var dragHoveredTab = null;

  function findTabAtClientX(clientX) {
    var best = null;
    var bestDist = Infinity;
    for (var i = 0; i < tabLinks.length; i++) {
      var a = tabLinks[i];
      var r = a.getBoundingClientRect();
      if (clientX >= r.left && clientX <= r.right) return a;
      var center = (r.left + r.right) * 0.5;
      var dist = Math.abs(clientX - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = a;
      }
    }
    return best;
  }

  tabsBox.addEventListener("pointerdown", function (e) {
    if (e.button && e.button !== 0) return;
    if (e.pointerType === "touch" && tabsBox.scrollWidth > tabsBox.clientWidth + 4) return;
    var startTab = e.target.closest("a.tab");
    if (!startTab) return;
    var startX = e.clientX;
    var moved = false;

    function onMove(ev) {
      if (Math.abs(ev.clientX - startX) > 6) moved = true;
      if (!moved) return;
      dragActive = true;
      var overTab = findTabAtClientX(ev.clientX);
      if (overTab && overTab !== dragHoveredTab) {
        dragHoveredTab = overTab;
        syncTabGlass(overTab, true);
      }
    }

    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (dragActive && dragHoveredTab) {
        var targetHash = dragHoveredTab.getAttribute("href");
        dragActive = false;
        var finalTab = dragHoveredTab;
        dragHoveredTab = null;
        if (targetHash && location.hash !== targetHash) {
          location.hash = targetHash;
        } else {
          syncTabGlass(finalTab, true);
        }
      } else {
        dragActive = false;
        dragHoveredTab = null;
      }
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  });

  var lastWinW = window.innerWidth;
  window.addEventListener("resize", function () {
    syncTabsFade();
    if (window.innerWidth === lastWinW) return;
    lastWinW = window.innerWidth;
    var cur = tabsBox.querySelector('a.tab[aria-current="page"]');
    if (cur) syncTabGlass(cur, false);
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      var cur = tabsBox.querySelector('a.tab[aria-current="page"]');
      if (cur && !tabGlassReady) syncTabGlass(cur, false);
      syncTabsFade();
    });
  }

  var tg = document.getElementById("tg");
  var ftg = document.getElementById("footer-tg");
  var tgUrl = safeUrl(S.telegram);
  if (tgUrl) {
    if (tg) tg.href = tgUrl;
    if (ftg) ftg.href = tgUrl;
  } else {
    if (tg) tg.hidden = true;
    if (ftg) ftg.hidden = true;
  }

  if (S.footerDisclaimer) document.getElementById("legal").textContent = S.footerDisclaimer;
  if (S.credit) document.getElementById("credit").textContent = S.credit;
  syncFooterAppVersion();

  var root = document.documentElement;
  var themeBtn = document.getElementById("theme");
  var themeLocked = false;
  var themePop = null;

  /* Twelve-theme palette (OpenCode-inspired set): every entry drives the full element
     set via CSS custom properties. AMOLED replaces the legacy Parchment light theme. */
  var NBT_THEMES = [
    { id: "dark",       label: "Obsidian",  swatch: "#34322e", scheme: "dark",  meta: "#1f1e1c" },
    { id: "amoled",     label: "AMOLED",    swatch: "#000000", scheme: "dark",  meta: "#000000" },
    { id: "mocha",      label: "Mocha",     swatch: "#2d2318", scheme: "dark",  meta: "#1d1712" },
    { id: "midnight",   label: "Midnight",  swatch: "#19223a", scheme: "dark",  meta: "#0e1320" },
    { id: "forest",     label: "Forest",    swatch: "#1c2a1c", scheme: "dark",  meta: "#111812" },
    { id: "dracula",    label: "Dracula",   swatch: "#343746", scheme: "dark",  meta: "#282a36" },
    { id: "macchiato",  label: "Macchiato", swatch: "#302f46", scheme: "dark",  meta: "#24273a" },
    { id: "everforest", label: "Everforest",swatch: "#3a4348", scheme: "dark",  meta: "#2d353b" },
    { id: "ayu",        label: "Ayu",       swatch: "#11151d", scheme: "dark",  meta: "#0b0e14" },
    { id: "cobalt",     label: "Cobalt",    swatch: "#14303e", scheme: "dark",  meta: "#122633" },
    { id: "carbonfox",  label: "Carbonfox", swatch: "#232340", scheme: "dark",  meta: "#161726" },
    { id: "latte",      label: "Latte",     swatch: "#fffcf5", scheme: "light", meta: "#f7f2e9" }
  ];

  function themeMetaOf(id) {
    for (var i = 0; i < NBT_THEMES.length; i++) if (NBT_THEMES[i].id === id) return NBT_THEMES[i];
    return NBT_THEMES[0];
  }

  function persistTheme(next) {
    var def = themeMetaOf(next);
    if (metaTheme) metaTheme.setAttribute("content", def.meta);
    try {
      localStorage.setItem("nb-theme", next);
    } catch (e) {}
  }

  function setThemeAttributes(next) {
    if (!NBT_THEMES.some(function (t) { return t.id === next; })) next = "dark";
    root.setAttribute("data-theme", next);
    root.setAttribute("data-scheme", themeMetaOf(next).scheme);
  }

  function closeThemeMenu() {
    if (themePop && themePop.parentNode) themePop.parentNode.removeChild(themePop);
    themePop = null;
    document.removeEventListener("pointerdown", onThemeDocDown, true);
    document.removeEventListener("keydown", onThemeDocKey, true);
  }
  function onThemeDocDown(ev) {
    if (themePop && !themePop.contains(ev.target) && !themeBtn.contains(ev.target)) closeThemeMenu();
  }
  function onThemeDocKey(ev) {
    if ((ev.key === "Escape" || ev.key === "Esc") && themePop) {
      ev.stopPropagation();
      closeThemeMenu();
    }
  }

  function openThemeMenu() {
    closeThemeMenu();
    var cur = root.getAttribute("data-theme") || "dark";
    var pop = el("div", "theme-popover");
    pop.setAttribute("role", "menu");
    pop.setAttribute("aria-label", "Choose theme");
    var head = el("div", "theme-popover-head");
    head.textContent = "Theme";
    pop.appendChild(head);
    NBT_THEMES.forEach(function (t) {
      var item = el("button", "theme-pop-item");
      item.setAttribute("type", "button");
      item.setAttribute("role", "menuitem");
      item.setAttribute("data-active", t.id === cur ? "true" : "false");
      var dot = el("span", "theme-pop-swatch");
      dot.style.background = t.swatch;
      var name = el("span", "theme-pop-label");
      name.textContent = t.label;
      item.appendChild(dot);
      item.appendChild(name);
      if (t.id === cur) {
        var ck = el("span", "theme-pop-check");
        ck.textContent = "\u2713";
        item.appendChild(ck);
      }
      item.addEventListener("click", function (ev) {
        ev.stopPropagation();
        if (t.id === cur) { closeThemeMenu(); return; }
        var rect = item.getBoundingClientRect();
        var cx = Math.round(rect.left + rect.width * 0.5);
        var cy = Math.round(rect.top + rect.height * 0.5);
        closeThemeMenu();
        applyAnimatedTheme(t.id, cx, cy);
      });
      pop.appendChild(item);
    });
    document.body.appendChild(pop);
    themePop = pop;
    var r = themeBtn.getBoundingClientRect();
    var popW = pop.offsetWidth || 176;
    var left = Math.min(Math.max(8, r.right - popW), window.innerWidth - popW - 8);
    pop.style.left = Math.round(Math.max(8, left)) + "px";
    pop.style.top = Math.round(r.bottom + 8) + "px";
    document.addEventListener("pointerdown", onThemeDocDown, true);
    document.addEventListener("keydown", onThemeDocKey, true);
  }

  function applyAnimatedTheme(next, cx, cy) {
    if (themeLocked) return;
    themeLocked = true;

    var cornerDist = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy));
    var maxR = Math.ceil(cornerDist * 1.25);

    if (prefersCalm() || !document.body.animate) {
      root.classList.add("theme-switching");
      setThemeAttributes(next);
      persistTheme(next);
      requestAnimationFrame(function () {
        root.classList.remove("theme-switching");
        themeLocked = false;
      });
      return;
    }

    if (typeof document.startViewTransition === "function") {
      root.style.setProperty("--vt-x", cx + "px");
      root.style.setProperty("--vt-y", cy + "px");
      root.style.setProperty("--vt-r", maxR + "px");
      root.classList.add("theme-switching");
      var vt;
      try {
        vt = document.startViewTransition(function () {
          setThemeAttributes(next);
          persistTheme(next);
        });
      } catch (err) {
        vt = null;
      }
      if (vt) {
        var unlock = function () {
          root.classList.remove("theme-switching");
          themeLocked = false;
        };
        vt.finished.then(unlock, unlock);
        return;
      }
      root.classList.remove("theme-switching");
    }

    var sy = window.scrollY || 0;
    var ripple = el("div", "theme-ripple");
    ripple.setAttribute("data-theme", next);
    ripple.setAttribute("data-scheme", themeMetaOf(next).scheme);
    ripple.style.clipPath = "circle(0px at " + cx + "px " + cy + "px)";
    var inner = el("div", "theme-ripple-inner");
    inner.style.transform = "translate3d(0," + (-sy) + "px,0)";
    var pageEl = document.querySelector(".page");
    var footEl = document.querySelector(".footer");
    if (pageEl) {
      var pageClone = pageEl.cloneNode(true);
      var cloneTabs = pageClone.querySelector(".tabs");
      if (cloneTabs && tabsBox.scrollLeft) cloneTabs.scrollLeft = tabsBox.scrollLeft;
      var cloneInput = pageClone.querySelector("#q");
      if (cloneInput && searchInput) cloneInput.value = searchInput.value;
      inner.appendChild(pageClone);
    }
    if (footEl) inner.appendChild(footEl.cloneNode(true));
    Array.prototype.forEach.call(inner.querySelectorAll("[id]"), function (n) {
      n.removeAttribute("id");
    });
    ripple.appendChild(inner);
    document.body.appendChild(ripple);

    var realNavEl = document.querySelector(".page .nav-wrap");
    var cloneNavEl = inner.querySelector(".nav-wrap");
    if (realNavEl && cloneNavEl) {
      var navDy = realNavEl.getBoundingClientRect().top - cloneNavEl.getBoundingClientRect().top;
      if (Math.abs(navDy) > 0.5) cloneNavEl.style.transform = "translate3d(0," + navDy + "px,0)";
    }
    var cloneTabsEl = inner.querySelector(".tabs");
    if (cloneTabsEl) cloneTabsEl.scrollLeft = tabsBox.scrollLeft;

    var rAnim = ripple.animate(
      {
        clipPath: [
          "circle(0px at " + cx + "px " + cy + "px)",
          "circle(" + maxR + "px at " + cx + "px " + cy + "px)"
        ]
      },
      {
        duration: 480,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        fill: "forwards"
      }
    );
    rAnim.onfinish = function () {
      ripple.style.clipPath = "circle(" + maxR + "px at " + cx + "px " + cy + "px)";
      root.classList.add("theme-switching");
      setThemeAttributes(next);
      persistTheme(next);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
          root.classList.remove("theme-switching");
          themeLocked = false;
        });
      });
    };
  }

  themeBtn.addEventListener("click", function (ev) {
    ev.stopPropagation();
    if (themePop) { closeThemeMenu(); return; }
    openThemeMenu();
  });

  /* ---------- floating download card (GDrive + Mirror) ---------- */
  var activeDlPop = null;
  var activeDlTrigger = null;

  function closeDownloadPopover() {
    if (activeDlPop && activeDlPop.parentNode) {
      activeDlPop.parentNode.removeChild(activeDlPop);
    }
    if (activeDlTrigger) {
      activeDlTrigger.removeAttribute("data-pop-open");
    }
    activeDlPop = null;
    activeDlTrigger = null;
  }

  function makeSvg(viewBox, w, h, innerPaths) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(h));
    svg.setAttribute("aria-hidden", "true");
    innerPaths.forEach(function (p) {
      var path = document.createElementNS(ns, "path");
      Object.keys(p).forEach(function (k) {
        path.setAttribute(k, p[k]);
      });
      svg.appendChild(path);
    });
    return svg;
  }

  function gdriveIconNode() {
    return makeSvg("0 0 87.3 78", 18, 16, [
      { d: "m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z", fill: "#0066da" },
      { d: "m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z", fill: "#00ac47" },
      { d: "m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z", fill: "#ea4335" },
      { d: "m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z", fill: "#00832d" },
      { d: "m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z", fill: "#2684fc" },
      { d: "m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z", fill: "#ffba00" }
    ]);
  }

  function mirrorIconNode() {
    return makeSvg("0 0 24 24", 16, 16, [
      {
        d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }
    ]);
  }

  function githubIconNode() {
    return makeSvg("0 0 24 24", 18, 18, [
      {
        d: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z",
        fill: "currentColor"
      }
    ]);
  }

  function sourceforgeIconNode() {
    return makeSvg("0 0 24 24", 18, 18, [
      {
        d: "M22.09 13.91c-.08-.4-.28-.77-.58-1.04-.3-.27-.69-.41-1.1-.41H17.7l1.9-5.11c.14-.38.15-.8.03-1.18-.12-.38-.37-.7-.71-.91-.34-.21-.75-.29-1.15-.22-.4.07-.76.28-1.01.59l-7.7 9.38c-.26.32-.38.73-.34 1.14.04.41.23.79.53 1.06.3.27.7.41 1.11.41h2.71l-1.9 5.11c-.14.38-.15.8-.03 1.18.12.38.37.7.71.91.34.21.75.29 1.15.22.4-.07.76-.28 1.01-.59l7.7-9.38c.26-.32.38-.73.34-1.15z",
        fill: "#ee5924"
      }
    ]);
  }

  function androidIconNode() {
    return makeSvg("0 0 24 24", 18, 18, [
      {
        d: "M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v6c0 .83.67 1.5 1.5 1.5S5 16.33 5 15.5v-6C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z",
        fill: "#3ddc84"
      }
    ]);
  }

  function megaIconNode() {
    return makeSvg("0 0 24 24", 18, 18, [
      { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z", fill: "#d9272e" },
      { d: "M16.5 16.5h-1.8v-4.8l-2.7 2.7-2.7-2.7v4.8H7.5V7.5h1.8l2.7 2.7 2.7-2.7h1.8v9z", fill: "#ffffff" }
    ]);
  }

  function telegramIconNode() {
    return makeSvg("0 0 24 24", 18, 18, [
      { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z", fill: "#2aabee" },
      { d: "M9.8 14.5l-.4 3.9c.6 0 .8-.3 1.1-.6l2.7-2.6 5.6 4.1c1 .6 1.8.3 2.1-.9l3.8-17.9c.4-1.6-.6-2.3-1.6-1.9L2.1 10.3c-1.5.6-1.5 1.4-.3 1.8l5.8 1.8 13.5-8.5c.6-.4 1.2-.2.7.2z", fill: "#ffffff" }
    ]);
  }

  function genericDownloadIconNode() {
    return makeSvg("0 0 24 24", 18, 18, [
      {
        d: "M12 3v11m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }
    ]);
  }

  function getDownloadSourceInfo(url, isMirror) {
    var raw = (url || "").trim();
    if (!raw || raw.charAt(0) === "#") {
      return {
        name: isMirror ? "Mirror Download" : "Direct Download",
        sub: isMirror ? "Backup download server" : "Primary download link",
        icon: isMirror ? mirrorIconNode() : genericDownloadIconNode()
      };
    }
    var host = "";
    try {
      var parsed = new URL(raw, window.location.href);
      host = (parsed.hostname || "").toLowerCase().replace(/^www\./, "");
    } catch (e) {
      var m = raw.match(/^[a-z]+:\/\/([^/:]+)/i);
      host = m ? m[1].toLowerCase().replace(/^www\./, "") : "";
    }

    // Google Drive
    if (host === "drive.google.com" || host === "docs.google.com") {
      return {
        name: isMirror ? "Google Drive (Mirror)" : "Google Drive",
        sub: isMirror ? "Backup Google Drive link" : "Primary download link",
        icon: gdriveIconNode()
      };
    }

    // GitHub
    if (host === "github.com" || host.endsWith(".github.com") || host === "raw.githubusercontent.com") {
      return {
        name: isMirror ? "GitHub (Mirror)" : "GitHub Releases",
        sub: isMirror ? "Backup GitHub repository" : "Official repository release",
        icon: githubIconNode()
      };
    }

    // SourceForge
    if (host === "sourceforge.net" || host.endsWith(".sourceforge.net") || host === "fsdn.com") {
      return {
        name: isMirror ? "SourceForge (Mirror)" : "SourceForge",
        sub: isMirror ? "Backup SourceForge mirror" : "Fast mirrors & direct file",
        icon: sourceforgeIconNode()
      };
    }

    // Google Android OTA / Googleapis
    if (host === "android.googleapis.com" || host.endsWith(".googleapis.com")) {
      return {
        name: isMirror ? "Google OTA (Mirror)" : "Google Android OTA",
        sub: isMirror ? "Backup official OTA package" : "Official Android firmware",
        icon: androidIconNode()
      };
    }

    // MEGA
    if (host === "mega.nz" || host === "mega.io" || host === "mega.co.nz") {
      return {
        name: isMirror ? "MEGA (Mirror)" : "MEGA",
        sub: isMirror ? "Backup MEGA cloud storage" : "Encrypted cloud storage",
        icon: megaIconNode()
      };
    }

    // Telegram
    if (host === "t.me" || host === "telegram.org") {
      return {
        name: isMirror ? "Telegram (Mirror)" : "Telegram",
        sub: isMirror ? "Backup Telegram file" : "Community channel file",
        icon: telegramIconNode()
      };
    }

    var cleanName = host;
    if (cleanName) {
      cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    } else {
      cleanName = isMirror ? "Mirror Download" : "Direct Download";
    }

    return {
      name: isMirror ? cleanName + " (Mirror)" : cleanName,
      sub: isMirror ? "Backup download server" : "Primary download link",
      icon: isMirror ? mirrorIconNode() : genericDownloadIconNode()
    };
  }

  function positionDownloadPopover() {
    if (!activeDlPop || !activeDlTrigger) return;
    var r = activeDlTrigger.getBoundingClientRect();
    var popRect = activeDlPop.getBoundingClientRect();
    var popW = popRect.width || 268;
    var popH = popRect.height || 152;
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    var left = r.right - popW;
    if (left < 12) left = 12;
    if (left + popW > vw - 12) left = Math.max(12, vw - popW - 12);

    var top = r.bottom + 8;
    if (top + popH > vh - 12 && r.top - popH - 8 >= 12) {
      top = r.top - popH - 8;
    }
    activeDlPop.style.left = Math.round(left) + "px";
    activeDlPop.style.top = Math.round(top) + "px";
  }

  function openDownloadPopover(triggerEl, item) {
    var primaryUrl = safeUrl(item && item.url);
    if (!primaryUrl) return;
    if (activeDlTrigger === triggerEl && activeDlPop) {
      closeDownloadPopover();
      return;
    }
    closeDownloadPopover();

    var pop = el("div", "dl-popover");
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-label", "Download options for " + (item.name || "file"));

    var head = el("div", "dl-pop-head");
    var titleWrap = el("div", "dl-pop-head-text");
    titleWrap.appendChild(el("div", "dl-pop-kicker", "Choose download source"));
    titleWrap.appendChild(el("div", "dl-pop-title", item.name || "Download file"));
    head.appendChild(titleWrap);

    var closeBtn = el("button", "dl-pop-close", "\u00d7");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close download options");
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeDownloadPopover();
    });
    head.appendChild(closeBtn);
    pop.appendChild(head);

    var actions = el("div", "dl-pop-actions");

    var primaryInfo = getDownloadSourceInfo(primaryUrl, false);
    var gBtn = el("a", "dl-pop-btn dl-pop-primary");
    gBtn.href = primaryUrl;
    if (primaryUrl.charAt(0) !== "#") {
      gBtn.target = "_blank";
      gBtn.rel = "noopener noreferrer";
    }
    var gIcon = el("span", "dl-pop-icon");
    gIcon.appendChild(primaryInfo.icon);
    gBtn.appendChild(gIcon);
    var gTxt = el("div", "dl-pop-btn-text");
    gTxt.appendChild(el("span", "dl-pop-btn-main", primaryInfo.name));
    gTxt.appendChild(el("span", "dl-pop-btn-sub", primaryInfo.sub));
    gBtn.appendChild(gTxt);
    gBtn.appendChild(el("span", "dl-pop-arrow", "\u2197"));
    gBtn.addEventListener("click", function () {
      setTimeout(closeDownloadPopover, 120);
    });
    actions.appendChild(gBtn);

    var mirrorUrl = safeUrl(item && (item.mirrorUrl || item.mirror));
    if (mirrorUrl) {
      var mirrorInfo = getDownloadSourceInfo(mirrorUrl, true);
      var mLink = el("a", "dl-pop-btn dl-pop-mirror");
      mLink.href = mirrorUrl;
      mLink.target = "_blank";
      mLink.rel = "noopener noreferrer";
      var mIcon = el("span", "dl-pop-icon");
      mIcon.appendChild(mirrorInfo.icon);
      mLink.appendChild(mIcon);
      var mTxt = el("div", "dl-pop-btn-text");
      mTxt.appendChild(el("span", "dl-pop-btn-main", mirrorInfo.name));
      mTxt.appendChild(el("span", "dl-pop-btn-sub", mirrorInfo.sub));
      mLink.appendChild(mTxt);
      mLink.appendChild(el("span", "dl-pop-arrow", "\u2197"));
      mLink.addEventListener("click", function () {
        setTimeout(closeDownloadPopover, 120);
      });
      actions.appendChild(mLink);
    } else {
      var mBtn = el("button", "dl-pop-btn dl-pop-mirror is-empty");
      mBtn.type = "button";
      var mIcon2 = el("span", "dl-pop-icon");
      mIcon2.appendChild(mirrorIconNode());
      mBtn.appendChild(mIcon2);
      var mTxt2 = el("div", "dl-pop-btn-text");
      var mainLbl = el("span", "dl-pop-btn-main", "Mirror");
      var subLbl = el("span", "dl-pop-btn-sub", "No mirror link available");
      mTxt2.appendChild(mainLbl);
      mTxt2.appendChild(subLbl);
      mBtn.appendChild(mTxt2);
      mBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        mainLbl.textContent = "No mirror link available";
        subLbl.textContent = "Check back later if primary link is unreachable";
        mBtn.classList.remove("shake");
        void mBtn.offsetWidth;
        mBtn.classList.add("shake");
      });
      actions.appendChild(mBtn);
    }

    pop.appendChild(actions);
    document.body.appendChild(pop);

    activeDlPop = pop;
    activeDlTrigger = triggerEl;
    triggerEl.setAttribute("data-pop-open", "true");
    positionDownloadPopover();
  }

  document.addEventListener("pointerdown", function (e) {
    if (!activeDlPop) return;
    if (activeDlPop.contains(e.target)) return;
    if (activeDlTrigger && activeDlTrigger.contains(e.target)) return;
    closeDownloadPopover();
  });
  window.addEventListener("scroll", function () {
    if (activeDlPop) positionDownloadPopover();
  }, { passive: true });
  window.addEventListener("resize", function () {
    if (activeDlPop) closeDownloadPopover();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && activeDlPop) closeDownloadPopover();
  });

  /* ---------- building blocks ---------- */
  function guideRedirectNode(guideSlug) {
    var link = el("a", "guide-redirect-link");
    link.href = "#guides/" + encodeURIComponent(guideSlug);
    link.appendChild(el("span", "guide-redirect-text", "Redirect to full guide"));
    link.appendChild(el("span", "guide-redirect-arrow", "\u2192"));
    return link;
  }

  function slugify(str) {
    return String(str || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function resolveItemCategory(tab, item) {
    if (!item) return "";
    if (item.category) return item.category;
    if (tab === "updates") return "Updates";
    if (tab === "guides") return item.category || "Guides";
    if (Array.isArray(window.SITE[tab])) {
      for (var i = 0; i < window.SITE[tab].length; i++) {
        var g = window.SITE[tab][i];
        if (g.feature && (g.feature === item || g.feature.name === item.name || (item.romId && g.feature.romId === item.romId))) {
          item.category = g.title;
          return g.title;
        }
        if (Array.isArray(g.items)) {
          for (var j = 0; j < g.items.length; j++) {
            var it = g.items[j];
            if (it === item || it.name === item.name || (item.id && it.id === item.id) || (item.romId && it.romId === item.romId)) {
              item.category = g.title;
              return g.title;
            }
          }
        }
      }
    }
    return "";
  }

  function romDetailsDrawer(d, guideSlug, item, tabName) {
    var drawer = el("div", "rom-drawer");
    var inner = el("div", "rom-drawer-inner");
    var body = el("div", "rom-drawer-body");

    if (d && d.base) {
      var baseBox = el("div", "rom-base");
      baseBox.appendChild(el("strong", "", "Ported from / Base:"));
      baseBox.appendChild(document.createTextNode(d.base));
      body.appendChild(baseBox);
    }

    function addSec(heading, items) {
      if (!items || !items.length) return;
      var sec = el("div", "rom-sec");
      sec.appendChild(el("h3", "", heading));
      var ul = el("ul");
      items.forEach(function (line) {
        ul.appendChild(el("li", "", line));
      });
      sec.appendChild(ul);
      body.appendChild(sec);
    }

    if (d) {
      addSec("Changelogs", d.changelogs);
      addSec("What is fixed", d.fixed);
      addSec("Bugs", d.bugs);
    }

    if (item && (item.note || item.description)) {
      var noteSec = el("div", "rom-sec");
      noteSec.appendChild(el("h3", "", "Description / Note"));
      noteSec.appendChild(el("p", "card-drawer-note", item.note || item.description));
      body.appendChild(noteSec);
    }

    // Screenshots link or "No screenshots available" tag
    if (item && item.name) {
      var rSlug = slugify(item.name);
      var romIdentifier = item.romId || rSlug;
      var hasScreens = Array.isArray(item.screenshots) && item.screenshots.length > 0;
      var screenSec = el("div", "rom-sec rom-sec-screenshots");

      if (hasScreens) {
        var strip = el("div", "rom-drawer-ss-strip");
        var previewShots = item.screenshots.slice(0, 3);
        previewShots.forEach(function (shot, pIdx) {
          var thumb = el("a", "rom-drawer-ss-thumb");
          thumb.href = "#screenshots/" + encodeURIComponent(romIdentifier);
          thumb.title = shot.caption || (item.name + " screenshot " + (pIdx + 1));
          var img = el("img", "rom-drawer-ss-img");
          img.src = resolveAssetUrl(shot.url);
          attachImgFallback(img, shot.url);
          img.alt = shot.caption || "Preview " + (pIdx + 1);
          img.loading = "lazy";
          img.decoding = "async";
          thumb.appendChild(img);
          thumb.addEventListener("click", function (ev) {
            ev.preventDefault();
            location.hash = "#screenshots/" + encodeURIComponent(romIdentifier);
          });
          strip.appendChild(thumb);
        });
        screenSec.appendChild(strip);

        var sLink = el("a", "rom-see-screenshots-btn");
        sLink.href = "#screenshots/" + encodeURIComponent(romIdentifier);
        sLink.title = "View screenshots for " + item.name;

        var iconSpan = el("span", "btn-icon", "\uD83D\uDDBC\uFE0F");
        var textSpan = el("span", "btn-text", "View Screenshots");
        var countSpan = el("span", "btn-badge", "(" + item.screenshots.length + ")");
        var arrowSpan = el("span", "btn-arrow", "\u2192");

        sLink.appendChild(iconSpan);
        sLink.appendChild(textSpan);
        sLink.appendChild(countSpan);
        sLink.appendChild(arrowSpan);
        sLink.addEventListener("click", function (ev) {
          ev.preventDefault();
          location.hash = "#screenshots/" + encodeURIComponent(romIdentifier);
        });
        screenSec.appendChild(sLink);
      } else {
        var noScreen = el("div", "rom-no-screenshots-tag");
        var iconSpan = el("span", "tag-icon", "\uD83D\uDCF7");
        var textSpan = el("span", "tag-text", "No screenshots available");
        noScreen.appendChild(iconSpan);
        noScreen.appendChild(textSpan);
        screenSec.appendChild(noScreen);
      }
      body.appendChild(screenSec);
    }

    if (guideSlug) {
      body.appendChild(guideRedirectNode(guideSlug));
    }

    // Developer Inline Action Bar
    if (item) {
      var devBar = el("div", "dev-inline-bar");
      var itemTab = tabName || (item.isRom ? "roms" : "modules");
      var itemCat = item.category || resolveItemCategory(itemTab, item) || "Latest";

      if (itemTab === "roms" || item.isRom) {
        var addPhotosBtn = el("button", "dev-action-btn", "📸 + Photos");
        addPhotosBtn.type = "button";
        addPhotosBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          openPublishModal("screenshots", "Screenshots", { romId: item.romId || slugify(item.name), romName: item.name });
        });
        devBar.appendChild(addPhotosBtn);
      }

      var editBtn = el("button", "dev-action-btn", "✎ Edit");
      editBtn.type = "button";
      editBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        openPublishModal(itemTab, itemCat, item, true);
      });
      devBar.appendChild(editBtn);

      var delBtn = el("button", "dev-action-btn btn-danger", "🗑 Delete");
      delBtn.type = "button";
      delBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        handleDeleteItem(itemTab, itemCat, item);
      });
      devBar.appendChild(delBtn);
      body.appendChild(devBar);
    }

    inner.appendChild(body);
    drawer.appendChild(inner);
    return drawer;
  }

  function guideOnlyDrawer(guideSlug, item, tabName) {
    var drawer = el("div", "rom-drawer card-guide-drawer");
    var inner = el("div", "rom-drawer-inner");
    var body = el("div", "rom-drawer-body card-guide-body");
    body.appendChild(guideRedirectNode(guideSlug));

    if (item) {
      var devBar = el("div", "dev-inline-bar");
      var itemTab = tabName || "roms";
      var itemCat = item.category || resolveItemCategory(itemTab, item) || "Firmware";

      var editBtn = el("button", "dev-action-btn", "✎ Edit");
      editBtn.type = "button";
      editBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        openPublishModal(itemTab, itemCat, item, true);
      });
      devBar.appendChild(editBtn);

      var delBtn = el("button", "dev-action-btn btn-danger", "🗑 Delete");
      delBtn.type = "button";
      delBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        handleDeleteItem(itemTab, itemCat, item);
      });
      devBar.appendChild(delBtn);
      body.appendChild(devBar);
    }

    inner.appendChild(body);
    drawer.appendChild(inner);
    return drawer;
  }

  function cardNode(it, tabName) {
    var url = safeUrl(it.url);
    var hasScreens = Array.isArray(it.screenshots) && it.screenshots.length > 0;
    var isRomItem = it.isRom || (it.category && /rom|firmware/i.test(it.category)) || (it.details && it.details.base);
    var isModule = (tabName === "modules") || (it.category && /module/i.test(it.category)) || (it.group && /module/i.test(it.group));
    var isToolOrKernel = (tabName === "kernels" || tabName === "recovery");
    var hasNote = !!(it.note || it.description);
    var hasDrawer = !!(it.details || it.guide || hasScreens || isRomItem || hasNote || isModule || isToolOrKernel);
    var c = el("div", hasDrawer ? "card has-drawer" : "card");

    var itemSlug = slugify(it.name);
    c.id = "item-" + itemSlug;
    c.setAttribute("data-slug", itemSlug);
    if (tabName) c.setAttribute("data-tab", tabName);

    var canonicalHash = getItemCanonicalHash(it, tabName);

    var top = el("div", "card-top");
    var left = el("div", "card-left");

    var titleWrap = el("div", "card-title-wrap");
    var titleAnchor = el("a", "name name-link", it.name);
    titleAnchor.href = canonicalHash;
    titleAnchor.title = "Direct link: " + canonicalHash + " (Right-click to copy link, or click to copy)";
    titleAnchor.addEventListener("click", function (e) {
      e.preventDefault();
      copyElementDeepLink(it.name, canonicalHash);
      if (location.hash !== canonicalHash) {
        history.pushState(null, "", canonicalHash);
      }
      highlightElement(c);
    });
    titleWrap.appendChild(titleAnchor);

    var copyBtn = el("button", "copy-link-btn");
    copyBtn.type = "button";
    copyBtn.setAttribute("aria-label", "Copy direct link for " + it.name);
    copyBtn.title = "Copy direct link";
    copyBtn.innerHTML = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
    copyBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      copyElementDeepLink(it.name, canonicalHash);
    });
    titleWrap.appendChild(copyBtn);
    left.appendChild(titleWrap);

    var meta = el("div", "meta");
    if (it.date) meta.appendChild(el("span", "", it.date));
    if (it.by) meta.appendChild(el("span", "", "By " + it.by));
    if (it.group) meta.appendChild(el("span", "", "Group: " + it.group));
    if (it.note) meta.appendChild(el("span", "", it.note));
    if (it.size) meta.appendChild(el("span", "", it.size));
    if (meta.childNodes.length) left.appendChild(meta);
    top.appendChild(left);

    var actions = el("div", "card-actions");
    if (hasDrawer) {
      var infoBtn = el("button", "info-btn", "i");
      infoBtn.type = "button";
      infoBtn.setAttribute("aria-expanded", "false");
      infoBtn.setAttribute("aria-label", "Show guide and info for " + it.name);
      infoBtn.title = "View screenshots, full guide & info";
      infoBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = c.classList.toggle("is-open");
        infoBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      actions.appendChild(infoBtn);
    }

    if (url) {
      var dlBtn = el("a", "dl", "Download");
      dlBtn.href = url;
      if (url.charAt(0) !== "#") {
        dlBtn.target = "_blank";
        dlBtn.rel = "noopener noreferrer";
      }
      dlBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        openDownloadPopover(dlBtn, it);
      });
      actions.appendChild(dlBtn);
    } else {
      actions.appendChild(el("span", "dl", "Soon"));
    }

    top.appendChild(actions);
    c.appendChild(top);

    c.addEventListener("contextmenu", function (e) {
      if (e.target.closest("a.dl") || e.target.closest(".info-btn")) return;
      copyElementDeepLink(it.name, canonicalHash);
    });

    if (it.details || hasScreens || isRomItem) {
      c.appendChild(romDetailsDrawer(it.details, it.guide, it, tabName));
    } else if (it.guide) {
      c.appendChild(guideOnlyDrawer(it.guide, it, tabName));
    } else {
      // In dev app, give all items an expandable info drawer with Edit/Delete controls
      c.classList.add("has-drawer");
      var defaultDrawer = el("div", "rom-drawer");
      var defaultInner = el("div", "rom-drawer-inner");
      var defaultBody = el("div", "rom-drawer-body");
      if (it.note || it.description) {
        defaultBody.appendChild(el("p", "card-drawer-note", it.note || it.description));
      }
      var devBar = el("div", "dev-inline-bar");
      var itemCat = it.category || resolveItemCategory(tabName || "modules", it) || "";
      var editBtn = el("button", "dev-action-btn", "✎ Edit");
      editBtn.type = "button";
      editBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        openPublishModal(tabName || "modules", itemCat, it, true);
      });
      devBar.appendChild(editBtn);

      var delBtn = el("button", "dev-action-btn btn-danger", "🗑 Delete");
      delBtn.type = "button";
      delBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        handleDeleteItem(tabName || "modules", itemCat, it);
      });
      devBar.appendChild(delBtn);
      defaultBody.appendChild(devBar);
      defaultInner.appendChild(defaultBody);
      defaultDrawer.appendChild(defaultInner);
      c.appendChild(defaultDrawer);

      if (!actions.querySelector(".info-btn")) {
        var infoBtn = el("button", "info-btn", "i");
        infoBtn.type = "button";
        infoBtn.setAttribute("aria-expanded", "false");
        infoBtn.setAttribute("aria-label", "Show info for " + it.name);
        infoBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          var open = c.classList.toggle("is-open");
          infoBtn.setAttribute("aria-expanded", open ? "true" : "false");
        });
        actions.insertBefore(infoBtn, actions.firstChild);
      }
    }
    return c;
  }

  function featureNode(f, isPriority, tabName) {
    var box = el("div", "feat-item");
    var tab = tabName || "roms";
    var itemSlug = slugify(f.name);
    box.id = "item-" + itemSlug;
    box.setAttribute("data-slug", itemSlug);
    box.setAttribute("data-tab", tab);
    var canonicalHash = getItemCanonicalHash(f, tab);

    var url = safeUrl(f.url);
    var hasScreens = Array.isArray(f.screenshots) && f.screenshots.length > 0;
    var isRomFeat = f.isRom || (f.category && /rom|firmware|latest/i.test(f.category)) || true;
    var hasDrawer = !!(f.details || f.guide || hasScreens || isRomFeat);
    if (f.image) {
      var img = el("img", "banner");
      img.src = resolveAssetUrl(f.image);
      attachImgFallback(img, f.image);
      img.alt = f.alt || f.name || "";
      img.width = f.width || 1200;
      img.height = f.height || 675;
      img.decoding = "async";
      if (isPriority) img.fetchPriority = "high";
      else img.loading = "lazy";
      if (url) {
        var imgLink = el("a", "banner-link");
        imgLink.href = url;
        imgLink.target = "_blank";
        imgLink.rel = "noopener noreferrer";
        imgLink.addEventListener("click", function (e) {
          e.preventDefault();
          var dlTarget = box.querySelector(".pill.dl") || imgLink;
          openDownloadPopover(dlTarget, f);
        });
        imgLink.appendChild(img);
        box.appendChild(imgLink);
      } else {
        box.appendChild(img);
      }
    }
    var row = el("div", "feat");
    var left = el("div");

    var titleWrap = el("div", "card-title-wrap");
    var titleLink = el("a", "name feat-title-link", f.name);
    titleLink.href = canonicalHash;
    titleLink.title = "Direct link: " + canonicalHash + " (Right-click to copy link, or click to copy)";
    titleLink.addEventListener("click", function (e) {
      e.preventDefault();
      copyElementDeepLink(f.name, canonicalHash);
      if (location.hash !== canonicalHash) {
        history.pushState(null, "", canonicalHash);
      }
      highlightElement(box);
    });
    titleWrap.appendChild(titleLink);

    var copyBtn = el("button", "copy-link-btn");
    copyBtn.type = "button";
    copyBtn.setAttribute("aria-label", "Copy direct link for " + f.name);
    copyBtn.title = "Copy direct link";
    copyBtn.innerHTML = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
    copyBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      copyElementDeepLink(f.name, canonicalHash);
    });
    titleWrap.appendChild(copyBtn);
    left.appendChild(titleWrap);

    var meta = el("div", "meta");
    if (f.date) meta.appendChild(el("span", "", "Release date: " + f.date));
    if (f.by) meta.appendChild(el("span", "", "By " + f.by));
    if (f.group) meta.appendChild(el("span", "", "Group: " + f.group));
    if (f.note) meta.appendChild(el("span", "", f.note));
    if (f.size) meta.appendChild(el("span", "", f.size));
    if (meta.childNodes.length) left.appendChild(meta);
    row.appendChild(left);

    var actions = el("div", "feat-actions");
    var infoBtn = null;
    if (hasDrawer) {
      infoBtn = el("button", "info-btn", "i");
      infoBtn.type = "button";
      infoBtn.setAttribute("aria-expanded", "false");
      infoBtn.setAttribute("aria-label", "Show ROM info, screenshots, changelogs, fixes and bugs");
      infoBtn.title = "View screenshots, changelogs, fixes & guide";
      infoBtn.addEventListener("click", function () {
        var open = box.classList.toggle("is-open");
        infoBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      actions.appendChild(infoBtn);
    }

    if (url) {
      var a = el("a", "pill dl", "Download");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        openDownloadPopover(a, f);
      });
      actions.appendChild(a);
    } else {
      actions.appendChild(el("span", "pill", "Upcoming"));
    }
    row.appendChild(actions);
    box.appendChild(row);

    box.addEventListener("contextmenu", function (e) {
      if (e.target.closest("a.banner-link") || e.target.closest(".pill.dl") || e.target.closest(".info-btn")) return;
      copyElementDeepLink(f.name, canonicalHash);
    });

    if (f.details || hasScreens || isRomFeat) {
      box.appendChild(romDetailsDrawer(f.details, f.guide, f, tabName));
    } else if (f.guide) {
      box.appendChild(guideOnlyDrawer(f.guide, f, tabName));
    }
    return box;
  }

  function panelNode(g, tabName) {
    var items = g.items || [];
    if (!g.feature && !items.length) {
      return null;
    }
    var isRomPanel = tabName === "roms" || (S.roms || []).some(function (c) {
      return c === g;
    });
    var p = el("section", "panel");
    var panelSlug = slugify(g.title);
    p.id = "panel-" + panelSlug;
    p.setAttribute("data-slug", panelSlug);
    if (tabName) p.setAttribute("data-tab", tabName);

    p.appendChild(el("h2", "", g.title));
    if (g.feature) {
      if (isRomPanel) g.feature.isRom = true;
      if (!g.feature.category) g.feature.category = g.title;
      p.appendChild(featureNode(g.feature, true, tabName));
    }
    if (items.length) {
      var hasBanners = items.some(function (it) {
        return !!it.image;
      });
      if (hasBanners) {
        var list = el("div", "feat-list");
        items.forEach(function (it) {
          if (isRomPanel) it.isRom = true;
          if (!it.category) it.category = g.title;
          list.appendChild(it.image ? featureNode(it, false, tabName) : cardNode(it, tabName));
        });
        p.appendChild(list);
      } else {
        var grid = el("div", "grid");
        items.forEach(function (it) {
          if (isRomPanel) it.isRom = true;
          if (!it.category) it.category = g.title;
          grid.appendChild(cardNode(it, tabName));
        });
        p.appendChild(grid);
      }
    } else if (!g.feature) {
      var grid = el("div", "grid");
      grid.appendChild(el("div", "empty", "Nothing here yet."));
      p.appendChild(grid);
    }

    // Developer '+' Card Trigger
    var addCard = el("div", "add-card-trigger");
    var addIcon = el("div", "add-card-icon", "+");
    var addLabel = el("div", "add-card-label", "Add to " + g.title);
    addCard.appendChild(addIcon);
    addCard.appendChild(addLabel);
    addCard.addEventListener("click", function () {
      openPublishModal(tabName || "roms", g.title);
    });
    p.appendChild(addCard);

    return p;
  }

  /* ---------- Updates & Changelogs tab + Host Upload ---------- */
  function openUploadModal() {
    var backdrop = el("div", "modal-backdrop");
    var modal = el("form", "modal");
    modal.appendChild(el("h3", "", "Publish Update / Changelog"));

    function field(label, inputEl) {
      var wrap = el("div", "modal-field");
      wrap.appendChild(el("label", "", label));
      wrap.appendChild(inputEl);
      return wrap;
    }

    var titleIn = el("input");
    titleIn.type = "text";
    titleIn.required = true;
    titleIn.placeholder = "e.g. OxygenOS 16 V1 Released";

    var tagIn = el("input");
    tagIn.type = "text";
    tagIn.value = "Update";
    tagIn.placeholder = "Update, New ROM, Changelog, Fix, News...";
    tagIn.setAttribute("list", "tag-presets");
    var dataList = el("datalist");
    dataList.id = "tag-presets";
    ["Update", "New ROM", "Changelog", "Feature", "Fix", "News"].forEach(function (t) {
      var o = el("option");
      o.value = t;
      dataList.appendChild(o);
    });
    modal.appendChild(dataList);

    var byIn = el("input");
    byIn.type = "text";
    byIn.value = S.credit || "Softbrick";
    byIn.placeholder = "Custom author name (e.g. Softbrick, MBuTT3178, fjrXTR...)";

    var bodyIn = el("textarea");
    bodyIn.required = true;
    bodyIn.placeholder = "Write the changelog, news, or paste https://... links or {{https://...|Link Text}}...";

    var urlIn = el("input");
    urlIn.type = "text";
    urlIn.placeholder = "Optional button link (e.g. https://drive.google.com/... or #roms)";

    var linkLabelIn = el("input");
    linkLabelIn.type = "text";
    linkLabelIn.placeholder = "Optional button label (e.g. Download, Screenshots, Open Link)";

    var imgIn = el("input");
    imgIn.type = "file";
    imgIn.accept = "image/*";

    var imgUrlIn = el("input");
    imgUrlIn.type = "text";
    imgUrlIn.placeholder = "Or paste an image URL / path (e.g. assets/hios16.webp or https://...)";

    modal.appendChild(field("Title", titleIn));
    modal.appendChild(field("Author Name (Posted By)", byIn));
    modal.appendChild(field("Category Tag", tagIn));
    modal.appendChild(field("Details / Changelog (Links supported)", bodyIn));
    modal.appendChild(field("Optional Link URL", urlIn));
    modal.appendChild(field("Optional Link Button Text", linkLabelIn));
    modal.appendChild(field("Upload Image File", imgIn));
    modal.appendChild(field("Or Image URL / Path", imgUrlIn));

    var statusMsg = el("div", "modal-status");
    statusMsg.hidden = true;
    modal.appendChild(statusMsg);

    var actions = el("div", "modal-actions");
    var cancelBtn = el("button", "modal-cancel", "Cancel");
    cancelBtn.type = "button";
    cancelBtn.addEventListener("click", function () {
      backdrop.remove();
    });

    var submitBtn = el("button", "upload-btn", "Publish Live");
    submitBtn.type = "submit";

    actions.appendChild(cancelBtn);
    actions.appendChild(submitBtn);
    modal.appendChild(actions);

    modal.addEventListener("submit", function (e) {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = "Publishing...";
      statusMsg.hidden = false;
      statusMsg.textContent = "Saving to data.js and deploying to Surge...";

      function sendPayload(imgData, imgName) {
        var payload = {
          title: titleIn.value.trim(),
          tag: tagIn.value.trim() || "Update",
          by: byIn.value.trim() || "Softbrick",
          body: bodyIn.value.trim(),
          url: urlIn.value.trim(),
          linkLabel: linkLabelIn.value.trim(),
          imageUrl: imgUrlIn.value.trim(),
          imageBase64: imgData || "",
          imageName: imgName || ""
        };
        fetch(ADMIN_API + "/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
          .then(function (r) { return r.json(); })
          .then(function (res) {
            if (res && res.ok) {
              S.updates = res.updates || S.updates;
              backdrop.remove();
              route(true);
            } else {
              statusMsg.textContent = "Error: " + ((res && res.error) || "Failed to publish");
              submitBtn.disabled = false;
              submitBtn.textContent = "Publish Live";
            }
          })
          .catch(function () {
            statusMsg.textContent = "Run 'server upload' in Kitty to use the local host dashboard.";
            submitBtn.disabled = false;
            submitBtn.textContent = "Publish Live";
          });
      }

      var file = imgIn.files && imgIn.files[0];
      if (file) {
        var reader = new FileReader();
        reader.onload = function () {
          sendPayload(reader.result, file.name);
        };
        reader.readAsDataURL(file);
      } else {
        sendPayload("", "");
      }
    });

    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) backdrop.remove();
    });
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    titleIn.focus();
  }

  function updateCardNode(u) {
    var card = el("article", "update-card");
    var top = el("div", "update-top");
    var meta = el("div", "update-meta");
    if (u.tag) meta.appendChild(el("span", "update-tag", u.tag));
    if (u.date) meta.appendChild(el("span", "", u.date));
    if (u.by) meta.appendChild(el("span", "", "By " + u.by));
    top.appendChild(meta);

    if (isHost && u.id) {
      var delBtn = el("button", "del-post-btn", "Delete");
      delBtn.type = "button";
      delBtn.addEventListener("click", function () {
        delBtn.disabled = true;
        delBtn.textContent = "Deleting...";
        fetch(ADMIN_API + "/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: u.id })
        })
          .then(function (r) { return r.json(); })
          .then(function (res) {
            if (res && res.ok) {
              S.updates = res.updates || [];
              route(true);
            }
          })
          .catch(function () {
            delBtn.disabled = false;
            delBtn.textContent = "Delete";
          });
      });
      top.appendChild(delBtn);
    }

    var updateSlug = u.id || slugify(u.title);
    card.id = "item-" + updateSlug;
    card.setAttribute("data-slug", updateSlug);
    card.setAttribute("data-tab", "updates");
    var canonicalHash = "#updates/" + updateSlug;

    card.appendChild(top);

    var titleWrap = el("div", "card-title-wrap");
    var h = el("h3", "update-title");
    var titleAnchor = el("a", "update-title-link", u.title);
    titleAnchor.href = canonicalHash;
    titleAnchor.title = "Direct link: " + canonicalHash + " (Right-click to copy link, or click to copy)";
    titleAnchor.addEventListener("click", function (e) {
      e.preventDefault();
      copyElementDeepLink(u.title, canonicalHash);
      if (location.hash !== canonicalHash) {
        history.pushState(null, "", canonicalHash);
      }
      highlightElement(card);
    });
    h.appendChild(titleAnchor);
    titleWrap.appendChild(h);

    var copyBtn = el("button", "copy-link-btn");
    copyBtn.type = "button";
    copyBtn.setAttribute("aria-label", "Copy direct link for " + u.title);
    copyBtn.title = "Copy direct link";
    copyBtn.innerHTML = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
    copyBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      copyElementDeepLink(u.title, canonicalHash);
    });
    titleWrap.appendChild(copyBtn);
    card.appendChild(titleWrap);

    card.addEventListener("contextmenu", function (e) {
      if (e.target.closest("a") || e.target.closest("button")) return;
      copyElementDeepLink(u.title, canonicalHash);
    });

    if (u.body) card.appendChild(richEl("p", "update-body", u.body));
    if (u.image) {
      var img = el("img", "update-img");
      img.src = resolveAssetUrl(u.image);
      attachImgFallback(img, u.image);
      img.alt = u.title || "";
      img.loading = "lazy";
      card.appendChild(img);
    }
    var url = safeUrl(u.url);
    if (url) {
      var foot = el("div", "update-foot");
      var defaultLabel = url.charAt(0) === "#" ? "Open Section \u2192" : "Open Link \u2192";
      var btnLabel = u.linkLabel ? u.linkLabel + " \u2192" : defaultLabel;
      var link = el("a", "pill dl", btnLabel);
      link.href = url;
      if (url.charAt(0) !== "#") {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      foot.appendChild(link);
      card.appendChild(foot);
    }

    // Developer Action Bar for Updates
    var devBar = el("div", "dev-inline-bar");
    var editBtn = el("button", "dev-action-btn", "✎ Edit");
    editBtn.type = "button";
    editBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      openPublishModal("updates", "Updates", u, true);
    });
    devBar.appendChild(editBtn);

    var delBtn = el("button", "dev-action-btn btn-danger", "🗑 Delete");
    delBtn.type = "button";
    delBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      handleDeleteItem("updates", "Updates", u);
    });
    devBar.appendChild(delBtn);
    card.appendChild(devBar);

    return card;
  }

  /* ---------- Official App Releases Tab & Card Nodes ---------- */
  function appReleaseCardNode(rel, isFeatured) {
    var card = el("article", isFeatured ? "card app-card app-card-featured" : "card app-card");

    var top = el("div", "app-card-top");
    var left = el("div", "app-card-left");

    var badgeRow = el("div", "app-badge-row");
    var vPill = el("span", "app-version-pill", rel.version);
    badgeRow.appendChild(vPill);

    if (rel.isLatest) {
      var latestPill = el("span", "app-badge-latest", "★ " + (rel.badge || "Latest Release"));
      badgeRow.appendChild(latestPill);
    }

    left.appendChild(badgeRow);

    var relSlug = slugify(rel.name || ("app-" + rel.version));
    card.id = "item-" + relSlug;
    card.setAttribute("data-slug", relSlug);
    card.setAttribute("data-tab", "app");
    var canonicalHash = "#app/" + relSlug;

    var titleWrap = el("div", "card-title-wrap");
    var h = el(isFeatured ? "h2" : "h3", "app-title");
    var titleAnchor = el("a", "app-title-link", rel.name);
    titleAnchor.href = canonicalHash;
    titleAnchor.title = "Direct link: " + canonicalHash + " (Right-click to copy link, or click to copy)";
    titleAnchor.addEventListener("click", function (e) {
      e.preventDefault();
      copyElementDeepLink(rel.name, canonicalHash);
      if (location.hash !== canonicalHash) {
        history.pushState(null, "", canonicalHash);
      }
      highlightElement(card);
    });
    h.appendChild(titleAnchor);
    titleWrap.appendChild(h);

    var copyBtn = el("button", "copy-link-btn");
    copyBtn.type = "button";
    copyBtn.setAttribute("aria-label", "Copy direct link for " + rel.name);
    copyBtn.title = "Copy direct link";
    copyBtn.innerHTML = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
    copyBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      copyElementDeepLink(rel.name, canonicalHash);
    });
    titleWrap.appendChild(copyBtn);
    left.appendChild(titleWrap);

    var meta = el("div", "meta");
    if (rel.date) meta.appendChild(el("span", "", rel.date));
    if (rel.size) meta.appendChild(el("span", "", rel.size));
    if (rel.by) meta.appendChild(el("span", "", "By " + rel.by));
    left.appendChild(meta);

    top.appendChild(left);

    // "i" info button on top-right of card header (consistent with ROM cards)
    var infoBtn = el("button", "info-btn", "i");
    infoBtn.type = "button";
    infoBtn.setAttribute("aria-expanded", "false");
    infoBtn.setAttribute("aria-label", "Show changes and updates for " + rel.version);
    infoBtn.title = "View changelog and updates";

    infoBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = card.classList.toggle("is-open");
      infoBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    top.appendChild(infoBtn);
    card.appendChild(top);

    card.addEventListener("contextmenu", function (e) {
      if (e.target.closest("a.pill") || e.target.closest(".info-btn")) return;
      copyElementDeepLink(rel.name, canonicalHash);
    });

    if (rel.summary) {
      var summaryP = el("p", "app-summary", rel.summary);
      card.appendChild(summaryP);
    }

    // Actions row: Download APK & GitHub
    var actions = el("div", "app-card-actions");

    if (rel.apkUrl) {
      var dl = el("a", "pill dl app-dl-pill", "📥 Download APK (" + rel.size + ")");
      dl.href = safeUrl(rel.apkUrl) || rel.apkUrl;
      dl.setAttribute("download", "NewbiesTeam-" + rel.version + ".apk");
      actions.appendChild(dl);
    }

    if (rel.releaseUrl) {
      var gh = el("a", "pill app-gh-pill", "🌐 GitHub");
      gh.href = safeUrl(rel.releaseUrl) || rel.releaseUrl;
      gh.target = "_blank";
      gh.rel = "noopener noreferrer";
      actions.appendChild(gh);
    }

    card.appendChild(actions);

    // Expandable Drawer for changelog and updates
    var drawer = el("div", "rom-drawer");
    var inner = el("div", "rom-drawer-inner");
    var body = el("div", "rom-drawer-body app-drawer-body");

    var changesHead = el("h4", "app-changes-title", "What's new in " + rel.version + ":");
    body.appendChild(changesHead);

    if (rel.changelog && rel.changelog.length) {
      var ul = el("ul", "app-changelog-list");
      rel.changelog.forEach(function (c) {
        var li = el("li", "", c);
        ul.appendChild(li);
      });
      body.appendChild(ul);
    }

    inner.appendChild(body);
    drawer.appendChild(inner);
    card.appendChild(drawer);

    return card;
  }

  function appReleasesNode() {
    var p = el("section", "panel app-releases-panel");
    var head = el("div", "app-releases-head");
    head.appendChild(el("h2", "", "Official App Releases"));
    p.appendChild(head);

    // Notice explaining Play Protect popup on unverified third-party APKs
    var notice = el("div", "app-notice");
    var noticeIcon = el("span", "app-notice-icon", "ℹ️");
    var noticeBody = el("p", "app-notice-text");
    noticeBody.innerHTML =
      '<strong>Play Protect Notice:</strong> If your device shows a security popup, this is only because the app is installed directly outside the Play Store. The app is completely open-source and safe \u2014 you can inspect the full source code anytime on <a href="https://github.com/zcyrl/newbiesteam-app" target="_blank" rel="noopener noreferrer">GitHub</a>.';
    notice.appendChild(noticeIcon);
    notice.appendChild(noticeBody);
    p.appendChild(notice);

    var releases = S.appReleases || [];
    if (!releases.length) {
      p.appendChild(el("div", "empty", "No app releases posted yet."));
      return p;
    }

    var list = el("div", "app-releases-grid");
    releases.forEach(function (rel, idx) {
      list.appendChild(appReleaseCardNode(rel, idx === 0));
    });
    p.appendChild(list);

    return p;
  }

  function updatesNode() {
    var p = el("section", "panel");
    var head = el("div", "updates-head");
    head.appendChild(el("h2", "", "Changelogs & Updates"));

    if (isHost) {
      var hostBar = el("div", "host-bar");
      hostBar.appendChild(el("span", "host-badge", "Host Mode"));
      var upBtn = el("button", "upload-btn", "+ Upload Update");
      upBtn.type = "button";
      upBtn.addEventListener("click", openUploadModal);
      hostBar.appendChild(upBtn);
      head.appendChild(hostBar);
    }

    p.appendChild(head);

    var items = S.updates || [];
    var list = el("div", "updates-list");
    if (!items.length) {
      list.appendChild(el("div", "empty", "No updates posted yet."));
    } else {
      items.forEach(function (u) {
        list.appendChild(updateCardNode(u));
      });
    }

    // Developer '+' Publish Update Card Trigger
    var addUpdateCard = el("div", "add-card-trigger");
    var addIcon = el("div", "add-card-icon", "+");
    var addLabel = el("div", "add-card-label", "Publish Update / Changelog");
    addUpdateCard.appendChild(addIcon);
    addUpdateCard.appendChild(addLabel);
    addUpdateCard.addEventListener("click", function () {
      openPublishModal("updates", "Updates");
    });
    list.appendChild(addUpdateCard);

    p.appendChild(list);
    return p;
  }

  /* ---------- Screenshots Gallery & Fullscreen Lightbox ---------- */
  var lightboxEl = null;
  var currentLightboxData = null;

  function openScreenshotLightbox(romName, screenshots, startIdx) {
    if (!screenshots || !screenshots.length) return;
    var idx = typeof startIdx === "number" ? startIdx : 0;
    if (idx < 0) idx = 0;
    if (idx >= screenshots.length) idx = screenshots.length - 1;

    currentLightboxData = {
      romName: romName,
      screenshots: screenshots,
      index: idx
    };

    if (!lightboxEl) {
      lightboxEl = document.createElement("div");
      lightboxEl.className = "lightbox-backdrop";
      lightboxEl.setAttribute("role", "dialog");
      lightboxEl.setAttribute("aria-modal", "true");
      lightboxEl.setAttribute("aria-label", "Screenshot Fullscreen Preview");

      var content = el("div", "lightbox-content");

      var topBar = el("div", "lightbox-topbar");
      var titleEl = el("div", "lightbox-title");
      var closeBtn = el("button", "lightbox-close", "\u2715");
      closeBtn.type = "button";
      closeBtn.setAttribute("aria-label", "Close preview");
      topBar.appendChild(titleEl);
      topBar.appendChild(closeBtn);
      content.appendChild(topBar);

      var mainArea = el("div", "lightbox-main");
      var prevBtn = el("button", "lightbox-nav lightbox-prev", "\u2039");
      prevBtn.type = "button";
      prevBtn.setAttribute("aria-label", "Previous screenshot");

      var imgWrap = el("div", "lightbox-img-wrap");
      var img = el("img", "lightbox-img");
      img.decoding = "async";
      imgWrap.appendChild(img);

      var nextBtn = el("button", "lightbox-nav lightbox-next", "\u203A");
      nextBtn.type = "button";
      nextBtn.setAttribute("aria-label", "Next screenshot");

      mainArea.appendChild(prevBtn);
      mainArea.appendChild(imgWrap);
      mainArea.appendChild(nextBtn);
      content.appendChild(mainArea);

      var bottomBar = el("div", "lightbox-bottombar");
      var captionEl = el("div", "lightbox-caption");
      var counterEl = el("div", "lightbox-counter");
      bottomBar.appendChild(captionEl);
      bottomBar.appendChild(counterEl);
      content.appendChild(bottomBar);

      lightboxEl.appendChild(content);
      document.body.appendChild(lightboxEl);

      closeBtn.addEventListener("click", closeScreenshotLightbox);
      lightboxEl.addEventListener("click", function (e) {
        if (e.target === lightboxEl || e.target === imgWrap) {
          closeScreenshotLightbox();
        }
      });

      prevBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        stepLightbox(-1);
      });

      nextBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        stepLightbox(1);
      });

      document.addEventListener("keydown", function (e) {
        if (!lightboxEl || !lightboxEl.classList.contains("is-open")) return;
        if (e.key === "Escape") {
          closeScreenshotLightbox();
        } else if (e.key === "ArrowLeft") {
          stepLightbox(-1);
        } else if (e.key === "ArrowRight") {
          stepLightbox(1);
        }
      });

      var touchStartX = 0;
      var touchEndX = 0;
      imgWrap.addEventListener(
        "touchstart",
        function (e) {
          touchStartX = e.changedTouches[0].screenX;
        },
        { passive: true }
      );
      imgWrap.addEventListener(
        "touchend",
        function (e) {
          touchEndX = e.changedTouches[0].screenX;
          var diff = touchEndX - touchStartX;
          if (Math.abs(diff) > 45) {
            if (diff > 0) stepLightbox(-1);
            else stepLightbox(1);
          }
        },
        { passive: true }
      );
    }

    updateLightboxView();
    lightboxEl.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function stepLightbox(delta) {
    if (!currentLightboxData) return;
    var len = currentLightboxData.screenshots.length;
    if (len <= 1) return;
    currentLightboxData.index = (currentLightboxData.index + delta + len) % len;
    updateLightboxView();
  }

  function updateLightboxView() {
    if (!currentLightboxData || !lightboxEl) return;
    var d = currentLightboxData;
    var shot = d.screenshots[d.index];
    var titleEl = lightboxEl.querySelector(".lightbox-title");
    var img = lightboxEl.querySelector(".lightbox-img");
    var captionEl = lightboxEl.querySelector(".lightbox-caption");
    var counterEl = lightboxEl.querySelector(".lightbox-counter");
    var prevBtn = lightboxEl.querySelector(".lightbox-prev");
    var nextBtn = lightboxEl.querySelector(".lightbox-next");

    if (titleEl) titleEl.textContent = d.romName;
    if (img) {
      img.src = resolveAssetUrl(shot.url);
      attachImgFallback(img, shot.url);
      img.alt = shot.caption || d.romName + " screenshot " + (d.index + 1);
    }
    if (captionEl) captionEl.textContent = shot.caption || "";
    if (counterEl) counterEl.textContent = d.index + 1 + " / " + d.screenshots.length;

    var multi = d.screenshots.length > 1;
    if (prevBtn) prevBtn.style.display = multi ? "" : "none";
    if (nextBtn) nextBtn.style.display = multi ? "" : "none";
  }

  function closeScreenshotLightbox() {
    if (lightboxEl) {
      lightboxEl.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    currentLightboxData = null;
  }

  function screenshotsNode(activeSlug) {
    var wrap = el("div", "screenshots-page");

    var header = el("div", "screenshots-hero");
    var title = el("h1", "screenshots-title", "Screenshots");
    var sub = el(
      "p",
      "screenshots-sub",
      "Dynamic interface previews and gallery for Infinix GT 20 Pro (X6871) ROMs"
    );
    header.appendChild(title);
    header.appendChild(sub);
    wrap.appendChild(header);

    // Collect all ROMs
    var allRoms = [];
    (S.roms || []).forEach(function (cat) {
      if (cat.feature) {
        allRoms.push(
          Object.assign({}, cat.feature, {
            category: cat.title,
            isFeature: true
          })
        );
      }
      (cat.items || []).forEach(function (it) {
        allRoms.push(
          Object.assign({}, it, {
            category: cat.title
          })
        );
      });
    });

    var totalScreens = allRoms.reduce(function (sum, r) {
      return sum + (Array.isArray(r.screenshots) ? r.screenshots.length : 0);
    }, 0);

    // Filter Bar
    var filterBar = el("div", "screenshots-filter-bar");
    var filterInner = el("div", "screenshots-filter-inner");

    var curFilter = activeSlug ? activeSlug : "all";

    // All ROMs chip
    var allPill = el(
      "button",
      "filter-chip" + (curFilter === "all" ? " is-active" : ""),
      "All ROMs"
    );
    allPill.type = "button";
    var allBadge = el("span", "chip-badge", String(allRoms.length));
    allPill.appendChild(allBadge);
    allPill.addEventListener("click", function () {
      selectFilter("all");
    });
    filterInner.appendChild(allPill);

    // Pills for each ROM
    var pillMap = {};
    allRoms.forEach(function (rom) {
      var rSlug = slugify(rom.name);
      var romIdentifier = rom.romId || rSlug;
      var count = Array.isArray(rom.screenshots) ? rom.screenshots.length : 0;
      var isActivePill = (curFilter === romIdentifier || curFilter === rSlug || (rom.romId && curFilter === rom.romId));
      var chip = el("button", "filter-chip" + (isActivePill ? " is-active" : ""));
      chip.type = "button";
      chip.appendChild(el("span", "chip-label", rom.name));
      if (count > 0) {
        chip.appendChild(el("span", "chip-badge has-count", String(count)));
      }
      chip.addEventListener("click", function () {
        selectFilter(romIdentifier);
      });
      pillMap[rSlug] = chip;
      if (rom.romId) pillMap[rom.romId] = chip;
      filterInner.appendChild(chip);
    });

    filterBar.appendChild(filterInner);
    wrap.appendChild(filterBar);

    // Gallery Container
    var gallery = el("div", "screenshots-gallery");
    var cardElements = [];

    allRoms.forEach(function (rom) {
      var rSlug = slugify(rom.name);
      var hasScreens = Array.isArray(rom.screenshots) && rom.screenshots.length > 0;

      var card = el("section", "rom-screen-card" + (hasScreens ? " has-screens" : " no-screens"));
      card.dataset.slug = rSlug;
      if (rom.romId) card.dataset.romId = rom.romId;

      var top = el("div", "screen-card-header");
      var left = el("div", "screen-card-meta");
      var h2 = el("h2", "screen-card-title", rom.name);
      left.appendChild(h2);

      var metaRow = el("div", "screen-card-sub");
      if (rom.category) metaRow.appendChild(el("span", "screen-cat-badge", rom.category));
      if (rom.by) metaRow.appendChild(el("span", "screen-by", "By " + rom.by));
      if (hasScreens) {
        metaRow.appendChild(
          el(
            "span",
            "screen-count-pill",
            rom.screenshots.length + " screenshot" + (rom.screenshots.length > 1 ? "s" : "")
          )
        );
      }
      left.appendChild(metaRow);
      top.appendChild(left);

      var right = el("div", "screen-card-actions");
      var jumpLink = el("a", "screen-jump-rom-link", "View in ROMs \u2197");
      jumpLink.href = "#roms";
      jumpLink.title = "Jump to " + rom.name + " download & info";
      right.appendChild(jumpLink);
      top.appendChild(right);

      card.appendChild(top);

      var body = el("div", "screen-card-body");
      if (hasScreens) {
        var grid = el("div", "screenshots-grid");
        rom.screenshots.forEach(function (shot, idx) {
          var itemEl = el("div", "screenshot-item");
          var thumbBtn = el("button", "screenshot-thumb-btn");
          thumbBtn.type = "button";
          thumbBtn.setAttribute(
            "aria-label",
            "View " + (shot.caption || rom.name) + " full size"
          );

          var img = el("img", "screenshot-img");
          img.src = resolveAssetUrl(shot.url);
          attachImgFallback(img, shot.url);
          img.alt = shot.caption || rom.name + " screenshot " + (idx + 1);
          img.loading = "lazy";
          img.decoding = "async";
          thumbBtn.appendChild(img);

          var overlay = el("div", "screenshot-overlay");
          var zoomIcon = el("span", "zoom-icon", "\u2922");
          overlay.appendChild(zoomIcon);
          thumbBtn.appendChild(overlay);

          thumbBtn.addEventListener("click", function () {
            openScreenshotLightbox(rom.name, rom.screenshots, idx);
          });

          // Instant Quick Delete Button (<16ms)
          var delBtn = el("button", "ss-quick-del-btn", "✕");
          delBtn.type = "button";
          delBtn.title = "Delete screenshot";
          delBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            e.preventDefault();
            handleDeleteScreenshot(rom, idx);
          });

          var thumbWrap = el("div", "ss-thumb-wrap");
          thumbWrap.appendChild(thumbBtn);
          thumbWrap.appendChild(delBtn);
          itemEl.appendChild(thumbWrap);

          if (shot.caption) {
            var cap = el("div", "screenshot-caption", shot.caption);
            itemEl.appendChild(cap);
          }

          grid.appendChild(itemEl);
        });

        // Screenshot '+' Tile at end of grid
        var addTile = el("div", "screenshot-add-tile");
        var addIcon = el("div", "add-card-icon", "+");
        var addLabel = el("div", "add-card-label", "Add Photos");
        addTile.appendChild(addIcon);
        addTile.appendChild(addLabel);
        addTile.addEventListener("click", function () {
          openPublishModal("screenshots", "Screenshots", { romId: rom.romId || slugify(rom.name), romName: rom.name });
        });
        grid.appendChild(addTile);

        body.appendChild(grid);
      } else {
        var emptyGrid = el("div", "screenshots-grid");
        var addTile = el("div", "screenshot-add-tile");
        var addIcon = el("div", "add-card-icon", "+");
        var addLabel = el("div", "add-card-label", "Add Photos");
        addTile.appendChild(addIcon);
        addTile.appendChild(addLabel);
        addTile.addEventListener("click", function () {
          openPublishModal("screenshots", "Screenshots", { romId: rom.romId || slugify(rom.name), romName: rom.name });
        });
        emptyGrid.appendChild(addTile);
        body.appendChild(emptyGrid);
      }

      card.appendChild(body);
      gallery.appendChild(card);
      cardElements.push({ slug: rSlug, romId: rom.romId || "", name: rom.name, el: card });
    });

    wrap.appendChild(gallery);

    function selectFilter(target) {
      curFilter = target;
      if (target === "all") {
        if (location.hash !== "#screenshots") {
          history.replaceState(null, "", "#screenshots");
        }
      } else {
        history.replaceState(null, "", "#screenshots/" + encodeURIComponent(target));
      }

      var match = allRoms.find(function (r) {
        return (
          r.romId === target ||
          slugify(r.romId) === slugify(target) ||
          slugify(r.name) === slugify(target)
        );
      });

      allPill.classList.toggle("is-active", target === "all");
      Object.keys(pillMap).forEach(function (k) {
        var isMatch = (
          k === target ||
          slugify(k) === slugify(target) ||
          (match && (k === match.romId || k === slugify(match.name)))
        );
        pillMap[k].classList.toggle("is-active", isMatch);
        if (isMatch) {
          pillMap[k].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
      });

      cardElements.forEach(function (item) {
        var isCardMatch = (
          target === "all" ||
          item.romId === target ||
          item.slug === target ||
          slugify(item.romId) === slugify(target) ||
          slugify(item.slug) === slugify(target) ||
          (match && (item.romId === match.romId || item.slug === slugify(match.name)))
        );
        if (isCardMatch) {
          item.el.style.display = "";
          if (target !== "all") {
            item.el.classList.add("card-highlight");
            item.el.scrollIntoView({ behavior: "smooth", block: "start" });
            setTimeout(function () {
              item.el.classList.remove("card-highlight");
            }, 1800);
          }
        } else {
          item.el.style.display = "none";
        }
      });
    }

    if (curFilter !== "all") {
      setTimeout(function () {
        selectFilter(curFilter);
      }, 50);
    }

    return wrap;
  }

  function guideTileNode(it) {
    var a = el("a", "tile");
    a.href = "#guides/" + encodeURIComponent(it.slug);
    a.appendChild(el("div", "name", it.title));
    var foot = el("div", "tile-foot");
    foot.appendChild(el("span", "", (it.by ? "By " + it.by + " \u00b7 " : "") + (it.read || "")));
    foot.appendChild(el("b", "", "Read"));
    a.appendChild(foot);
    return a;
  }

  function guidesNode(g) {
    var items = (g && g.items) || [];
    var cats = (g && g.categories) ? g.categories.slice() : [];
    items.forEach(function (it) {
      var c = it.category || "Guides";
      if (cats.indexOf(c) === -1) cats.push(c);
    });
    var frag = document.createDocumentFragment();

    var noticeText = (g && g.notice) || S.guidesNotice;
    if (noticeText) {
      var nb = el("div", "warn guides-notice");
      nb.appendChild(el("strong", "", "Notice"));
      nb.appendChild(el("p", "", noticeText));
      frag.appendChild(nb);
    }

    if (!items.length) {
      var p = el("section", "panel");
      p.appendChild(el("h2", "", (g && g.title) || "Guides"));
      var box = el("div", "tiles");
      box.appendChild(el("div", "empty", "No guides yet."));
      p.appendChild(box);
      frag.appendChild(p);
      return frag;
    }
    cats.forEach(function (cat) {
      var groupItems = items.filter(function (it) {
        return (it.category || "Guides") === cat;
      });
      if (!groupItems.length) return;
      var p = el("section", "panel");
      p.appendChild(el("h2", "", cat));
      var box = el("div", "tiles");
      groupItems.forEach(function (it) {
        box.appendChild(guideTileNode(it));
      });

      // Developer '+' Tile for Guides
      var addTile = el("div", "add-card-trigger guide-add-tile");
      var addIcon = el("div", "add-card-icon", "+");
      var addLabel = el("div", "add-card-label", "Add Guide");
      addTile.appendChild(addIcon);
      addTile.appendChild(addLabel);
      addTile.addEventListener("click", function () {
        openPublishModal("guides", cat);
      });
      box.appendChild(addTile);

      p.appendChild(box);
      frag.appendChild(p);
    });
    return frag;
  }

  /* ---------- guide reading page ---------- */
  function richEl(tag, cls, text) {
    var e = el(tag, cls);
    String(text).split(/(\{\{[^}]+\}\}|https?:\/\/[^\s<)]+)/).forEach(function (part) {
      var m = /^\{\{([^|}]+)\|([^}]+)\}\}$/.exec(part);
      if (m) {
        if (m[1].indexOf("dl:") === 0) {
          var dlUrl = safeUrl(m[1].slice(3));
          var pill = el("a", "guide-dl-pill", m[2]);
          if (dlUrl) {
            pill.href = dlUrl;
            pill.target = "_blank";
            pill.rel = "noopener noreferrer";
            pill.addEventListener("click", function (ev) {
              ev.preventDefault();
              ev.stopPropagation();
              var cleanName = m[2].replace(/^[\u2b07\s]+/, "").replace(/^Direct Download\s+/i, "") || m[2];
              openDownloadPopover(pill, { name: cleanName, url: dlUrl });
            });
          }
          e.appendChild(pill);
          return;
        }
        var a = el("a", "inlink", m[2]);
        if (/^https?:\/\//.test(m[1])) {
          var ext = safeUrl(m[1]);
          if (ext) {
            a.href = ext;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
          }
        } else {
          var targetHash = m[1].charAt(0) === "#" ? m[1] : "#guides/" + encodeURIComponent(m[1]);
          a.href = targetHash;
          a.addEventListener("click", function (ev) {
            if (location.hash === targetHash) {
              ev.preventDefault();
              route();
            }
          });
        }
        e.appendChild(a);
      } else if (/^https?:\/\/[^\s<)]+$/.test(part)) {
        var u = safeUrl(part);
        if (u) {
          var rawLink = el("a", "inlink", part);
          rawLink.href = u;
          rawLink.target = "_blank";
          rawLink.rel = "noopener noreferrer";
          e.appendChild(rawLink);
        } else {
          e.appendChild(document.createTextNode(part));
        }
      } else if (part) {
        e.appendChild(document.createTextNode(part));
      }
    });
    return e;
  }

  function listNode(tag, arr) {
    var l = el(tag);
    arr.forEach(function (t) {
      l.appendChild(richEl("li", "", t));
    });
    return l;
  }

  function copyIconNode(copied) {
    if (copied) {
      return makeSvg("0 0 24 24", 13, 13, [
        {
          d: "M20 6L9 17l-5-5",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2.4",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        }
      ]);
    }
    return makeSvg("0 0 24 24", 13, 13, [
      {
        d: "M9 9h10v10H9z",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      {
        d: "M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }
    ]);
  }

  function copyTextToClipboard(text, onDone) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onDone).catch(function () {
        fallbackCopy(text, onDone);
      });
    } else {
      fallbackCopy(text, onDone);
    }
  }

  function fallbackCopy(text, onDone) {
    try {
      var ta = el("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      ta.style.pointerEvents = "none";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      onDone();
    } catch (e) {}
  }

  function codeBlockNode(lines) {
    var wrap = el("div", "code-wrap");
    var text = lines.join("\n");
    var pre = el("pre");
    pre.appendChild(el("code", "", text));
    wrap.appendChild(pre);

    var btn = el("button", "copy-btn");
    btn.type = "button";
    btn.setAttribute("aria-label", "Copy commands");
    btn.title = "Copy commands to clipboard";
    var iconWrap = el("span", "copy-btn-icon");
    iconWrap.appendChild(copyIconNode(false));
    var lbl = el("span", "copy-btn-label", "Copy");
    btn.appendChild(iconWrap);
    btn.appendChild(lbl);

    var copyTimer = null;
    btn.addEventListener("click", function () {
      copyTextToClipboard(text, function () {
        iconWrap.replaceChildren(copyIconNode(true));
        lbl.textContent = "Copied";
        btn.dataset.copied = "true";
        if (copyTimer) clearTimeout(copyTimer);
        copyTimer = setTimeout(function () {
          iconWrap.replaceChildren(copyIconNode(false));
          lbl.textContent = "Copy";
          delete btn.dataset.copied;
        }, 1600);
      });
    });
    wrap.appendChild(btn);
    return wrap;
  }

  function articleNode(g) {
    var art = el("article", "article");

    var crumbs = el("div", "crumbs");
    var back = el("a", "", "Guides");
    back.href = "#guides";
    crumbs.appendChild(back);
    if (g.category) {
      crumbs.appendChild(document.createTextNode("  /  " + g.category));
    }
    crumbs.appendChild(document.createTextNode("  /  " + g.title));
    art.appendChild(crumbs);

    art.appendChild(el("h1", "", g.title));
    art.appendChild(el("p", "from", (g.by ? "By " + g.by + " \u00b7 " : "") + "From NewbiesTeam, for the GT 20 Pro"));

    var infoKeys = g.info ? Object.keys(g.info) : [];
    if (infoKeys.length) {
      var box = el("aside", "infobox");
      box.appendChild(el("h3", "", "Guide info"));
      var dl = el("dl");
      infoKeys.forEach(function (k) {
        var row = el("div");
        row.appendChild(el("dt", "", k));
        row.appendChild(el("dd", "", g.info[k]));
        dl.appendChild(row);
      });
      box.appendChild(dl);
      art.appendChild(box);
    }

    var intro = g.intro ? [].concat(g.intro) : [];
    intro.forEach(function (t) {
      art.appendChild(richEl("p", "", t));
    });

    var warnText = g.warning || S.guideWarning;
    if (warnText) {
      var wb = el("div", "warn");
      wb.appendChild(el("strong", "", "Warning"));
      wb.appendChild(richEl("p", "", warnText));
      art.appendChild(wb);
    }

    var sections = g.sections || [];
    var heads = [];

    if (sections.length > 1) {
      var toc = el("nav", "toc");
      toc.setAttribute("aria-label", "Contents");
      toc.appendChild(el("h3", "", "Contents"));
      var ol = el("ol");
      sections.forEach(function (s, i) {
        var li = el("li");
        var b = el("button", "", s.h);
        b.type = "button";
        b.addEventListener("click", function () {
          heads[i].scrollIntoView({ behavior: prefersCalm() ? "auto" : "smooth", block: "start" });
        });
        li.appendChild(b);
        ol.appendChild(li);
      });
      toc.appendChild(ol);
      art.appendChild(toc);
    }

    sections.forEach(function (s, i) {
      var h = el("h2", "", (i + 1) + "  " + s.h);
      heads.push(h);
      art.appendChild(h);
      (s.body || []).forEach(function (b) {
        if (typeof b === "string") art.appendChild(richEl("p", "", b));
        else if (b.ul) art.appendChild(listNode("ul", b.ul));
        else if (b.ol) art.appendChild(listNode("ol", b.ol));
        else if (b.code) art.appendChild(codeBlockNode(b.code));
        else if (b.note) art.appendChild(richEl("div", "note", b.note));
      });
    });

    var bk = el("a", "back", "Back to Guides");
    bk.href = "#guides";
    art.appendChild(bk);

    // Developer Action Bar for Guide Article
    var devBar = el("div", "dev-inline-bar");
    var editBtn = el("button", "dev-action-btn", "✎ Edit Guide");
    editBtn.type = "button";
    editBtn.addEventListener("click", function () {
      openPublishModal("guides", g.category || "Guides", g, true);
    });
    devBar.appendChild(editBtn);

    var delBtn = el("button", "dev-action-btn btn-danger", "🗑 Delete Guide");
    delBtn.type = "button";
    delBtn.addEventListener("click", function () {
      handleDeleteItem("guides", g.category || "Guides", g);
    });
    devBar.appendChild(delBtn);
    art.appendChild(devBar);

    return art;
  }

  function missingNode() {
    var art = el("article", "article");
    art.appendChild(el("h1", "", "Guide not found"));
    art.appendChild(el("p", "", "That guide doesn't exist or was moved."));
    var bk = el("a", "back", "Back to Guides");
    bk.href = "#guides";
    art.appendChild(bk);
    return art;
  }

  /* ---------- search ---------- */
  var searchBox = document.getElementById("searchbox");
  var searchInput = document.getElementById("search");
  var searchClear = document.getElementById("search-clear");
  var searchKbd = document.getElementById("search-kbd");

  function syncSearchControls() {
    var hasText = !!searchInput.value;
    if (searchClear) searchClear.hidden = !hasText;
    if (searchKbd) searchKbd.hidden = hasText;
  }

  var DEVICE_TOKENS = ["gt", "20", "pro", "gt20", "gt20pro", "x6871", "infinix"];

  function parseSearchQuery(q) {
    var rawWords = (q || "").toLowerCase().split(/\s+/).filter(Boolean);
    var specificWords = rawWords.filter(function (w) {
      return DEVICE_TOKENS.indexOf(w) === -1;
    });
    // If the search query consists purely of device tokens (e.g. "gt 20 pro", "gt 20", "x6871", "infinix"),
    // show all resources across tabs.
    var isBroadDeviceSearch = rawWords.length > 0 && specificWords.length === 0;
    var effectiveWords = isBroadDeviceSearch ? [] : (specificWords.length > 0 ? specificWords : rawWords);
    return {
      rawWords: rawWords,
      words: effectiveWords,
      isBroadDeviceSearch: isBroadDeviceSearch
    };
  }

  function matches(parsed, text) {
    if (parsed.isBroadDeviceSearch) return true;
    if (!parsed.words || !parsed.words.length) return false;
    text = (text || "").toLowerCase();
    return parsed.words.every(function (w) {
      return text.indexOf(w) !== -1;
    });
  }

  function itemText(it) {
    var d = it.details || {};
    var dTxt = [d.base, (d.changelogs || []).join(" "), (d.fixed || []).join(" "), (d.bugs || []).join(" ")].join(" ");
    return [it.name, it.by, it.date, it.size, it.group, it.note, it.alt, dTxt].join(" ");
  }

  function resultPanel(tabLabel, title, content) {
    var p = el("section", "panel");
    var h = el("h2");
    h.appendChild(el("span", "crumb", tabLabel));
    h.appendChild(document.createTextNode(title));
    p.appendChild(h);
    p.appendChild(content);
    return p;
  }

  function searchNode(q) {
    var parsed = parseSearchQuery(q);
    var words = parsed.words;
    var frag = document.createDocumentFragment();
    var count = 0;

    TABS.forEach(function (t) {
      if (t[0] === "guides" || t[0] === "updates") return;
      (S[t[0]] || []).forEach(function (g) {
        var catHit = matches(parsed, g.title || "");
        if (g.feature) {
          var f = g.feature;
          if (catHit || matches(parsed, [f.name, f.date, f.alt].join(" "))) {
            frag.appendChild(resultPanel(t[1], g.title, featureNode(f, false, t[0])));
            count++;
          }
        }
        var all = g.items || [];
        var hits = catHit
          ? all
          : all.filter(function (it) {
              return matches(parsed, itemText(it) + " " + g.title);
            });
        if (!hits.length) return;
        var hasBanners = hits.some(function (it) {
          return !!it.image;
        });
        if (hasBanners) {
          var list = el("div", "feat-list");
          hits.forEach(function (it) {
            list.appendChild(it.image ? featureNode(it, false, t[0]) : cardNode(it, t[0]));
          });
          frag.appendChild(resultPanel(t[1], g.title, list));
        } else {
          var grid = el("div", "grid");
          hits.forEach(function (it) {
            grid.appendChild(cardNode(it, t[0]));
          });
          frag.appendChild(resultPanel(t[1], g.title, grid));
        }
        count += hits.length;
      });
    });

    var uHits = (S.updates || []).filter(function (u) {
      return matches(parsed, [u.title, u.body, u.tag, u.by, u.date].join(" "));
    });
    if (uHits.length) {
      var uList = el("div", "updates-list");
      uHits.forEach(function (u) {
        uList.appendChild(updateCardNode(u));
      });
      frag.appendChild(resultPanel("Updates", "Changelogs & Updates", uList));
      count += uHits.length;
    }

    var aHits = (S.appReleases || []).filter(function (rel) {
      return matches(parsed, [rel.name, rel.version, rel.summary, (rel.changelog || []).join(" "), rel.by].join(" "));
    });
    if (aHits.length) {
      var aList = el("div", "app-releases-grid");
      aHits.forEach(function (rel) {
        aList.appendChild(appReleaseCardNode(rel, false));
      });
      frag.appendChild(resultPanel("App", "Official App Releases", aList));
      count += aHits.length;
    }

    var gl = (S.guides && S.guides.items) || [];
    var gCats = (S.guides && S.guides.categories) ? S.guides.categories.slice() : [];
    gl.forEach(function (g) {
      var c = g.category || "Guides";
      if (gCats.indexOf(c) === -1) gCats.push(c);
    });
    gCats.forEach(function (cat) {
      var gHits = gl.filter(function (g) {
        if ((g.category || "Guides") !== cat) return false;
        var txt = [g.title, g.category, g.by, [].concat(g.intro || []).join(" ")];
        (g.sections || []).forEach(function (s) {
          txt.push(s.h);
        });
        return matches(parsed, txt.join(" "));
      });
      if (gHits.length) {
        var box = el("div", "tiles");
        gHits.forEach(function (it) {
          box.appendChild(guideTileNode(it));
        });
        frag.appendChild(resultPanel("Guides", cat, box));
        count += gHits.length;
      }
    });

    var out = document.createDocumentFragment();
    if (!count) {
      var p = el("section", "panel");
      p.appendChild(el("div", "empty", "No results for \u201c" + q + "\u201d."));
      out.appendChild(p);
    } else {
      var noteText = parsed.isBroadDeviceSearch
        ? count + " resources found for \u201c" + q + "\u201d (Infinix GT 20 Pro · X6871)"
        : count + (count === 1 ? " result" : " results") + " for \u201c" + q + "\u201d";
      out.appendChild(
        el("p", "results-note", noteText)
      );
      out.appendChild(frag);
    }
    return out;
  }

  function runSearch() {
    syncSearchControls();
    var q = searchInput.value.trim();
    if (!q) {
      route(true);
      return;
    }
    hero.hidden = true;
    view.replaceChildren(searchNode(q));
    document.title = "Search \u2014 NewbiesTeam";
    tabLinks.forEach(function (a) {
      a.removeAttribute("aria-current");
    });
    syncTabGlass(null, false);
  }

  searchInput.addEventListener("input", runSearch);
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && searchInput.value) {
      searchInput.value = "";
      runSearch();
    }
  });
  if (searchClear) {
    searchClear.addEventListener("click", function () {
      searchInput.value = "";
      runSearch();
      searchInput.focus();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && !searchBox.hidden && document.activeElement !== searchInput) {
      var tag = document.activeElement && document.activeElement.tagName;
      if (tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    }
  });

  tabsBox.addEventListener("click", function (e) {
    var a = e.target.closest("a.tab");
    if (!a) return;
    if (searchInput.value && a.getAttribute("href") === (location.hash || "#roms")) {
      e.preventDefault();
      searchInput.value = "";
      syncSearchControls();
      route();
    }
  });
  if (logo) {
    var logoAnimTimer = null;
    var triggerLogoAnimation = function () {
      logo.classList.add("animating");
      clearTimeout(logoAnimTimer);
      logoAnimTimer = setTimeout(function () {
        logo.classList.remove("animating");
      }, 3400);
    };

    logo.addEventListener("pointerdown", triggerLogoAnimation, { passive: true });
    logo.addEventListener("click", function (e) {
      triggerLogoAnimation();
      if (searchInput.value && (location.hash === "#roms" || !location.hash)) {
        e.preventDefault();
        searchInput.value = "";
        syncSearchControls();
        route();
      }
    });
  }

  /* ---------- routing ---------- */
  function route(keepScroll) {
    closeDownloadPopover();
    closeTabOverview();
    if (keepScroll !== true && searchInput.value) {
      searchInput.value = "";
      syncSearchControls();
    }

    var resolved = resolveRouteHash(location.hash);
    var tab = resolved.tab || "roms";
    var slug = resolved.slug || "";

    if (tab === "guides" && slug === "flash-custom-recovery") {
      slug = "ofox-flash";
    }

    var known = TABS.filter(function (t) {
      return t[0] === tab;
    })[0];
    if (!known) {
      tab = "roms";
      known = TABS[0];
      slug = "";
    }

    var isArticle = tab === "guides" && !!slug;
    hero.hidden = isArticle;
    searchBox.hidden = isArticle;

    var node, title;
    if (isArticle) {
      var found = ((S.guides && S.guides.items) || []).filter(function (g) {
        return g.slug === slug;
      })[0];
      node = found ? articleNode(found) : missingNode();
      title = (found ? found.title : "Guide not found") + " \u2014 NewbiesTeam";
    } else {
      node = document.createDocumentFragment();
      if (tab !== "guides" && tab !== "updates" && tab !== "screenshots" && tab !== "app" && S.disclaimer) {
        var dw = el("div", "warn");
        dw.appendChild(el("strong", "", "Use at your own risk"));
        dw.appendChild(el("p", "", S.disclaimer));
        node.appendChild(dw);
      }
      if (tab === "guides") {
        node.appendChild(guidesNode(S.guides || { title: "Guides", items: [] }));
      } else if (tab === "updates") {
        node.appendChild(updatesNode());
      } else if (tab === "app") {
        node.appendChild(appReleasesNode());
      } else if (tab === "screenshots") {
        node.appendChild(screenshotsNode(slug));
      } else {
        (S[tab] || []).forEach(function (g) {
          var p = panelNode(g, tab);
          if (p) node.appendChild(p);
        });
      }
      title = (tab === "app" ? "App Releases" : known[1]) + " \u2014 NewbiesTeam";
    }

    view.replaceChildren(node);
    document.title = title;

    var activeTabEl = null;
    tabLinks.forEach(function (a) {
      if (a.dataset.tab === tab) {
        a.setAttribute("aria-current", "page");
        activeTabEl = a;
        if (tabsBox.scrollWidth > tabsBox.clientWidth) {
          var targetLeft = a.offsetLeft - (tabsBox.clientWidth - a.offsetWidth) / 2;
          tabsBox.scrollTo({ left: Math.max(0, targetLeft), behavior: prefersCalm() ? "auto" : "smooth" });
        }
      } else {
        a.removeAttribute("aria-current");
      }
    });
    syncTabGlass(activeTabEl, true);

    // Deep navigation element targeting
    var targetEl = null;
    if (!isArticle && slug && tab !== "guides") {
      targetEl = findTargetElement(slug);
    }

    if (targetEl) {
      if (targetEl.classList.contains("has-drawer") || targetEl.querySelector(".rom-drawer")) {
        targetEl.classList.add("is-open");
        var infoBtn = targetEl.querySelector(".info-btn");
        if (infoBtn) infoBtn.setAttribute("aria-expanded", "true");
      }
      requestAnimationFrame(function () {
        targetEl.scrollIntoView({ behavior: prefersCalm() ? "auto" : "smooth", block: "center" });
        highlightElement(targetEl);
      });
    } else if (keepScroll !== true) {
      window.scrollTo(0, 0);
    }
  }

  /* Host Mode: active automatically on localhost:4720, or toggled by the host with Ctrl+Shift+U */
  try {
    if (location.hostname === "127.0.0.1" || location.hostname === "localhost" || localStorage.getItem("nb-host") === "1") {
      isHost = true;
    }
  } catch (e) {}

  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.shiftKey && (e.key === "U" || e.key === "u")) {
      e.preventDefault();
      isHost = !isHost;
      try {
        if (isHost) localStorage.setItem("nb-host", "1");
        else localStorage.removeItem("nb-host");
      } catch (err) {}
      route(true);
    }
  });

  function b64ToBytes(b64) {
    var bin = atob(b64);
    var arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr;
  }

  function fetchRemoteUpdates() {
    var deletedMap = {};
    (S.deletedIds || []).forEach(function (id) {
      deletedMap[id] = true;
    });

    // 1. Fetch live updates.json with cache-busting
    var jsonUrls = [
      "https://newbiesteam.pages.dev/updates.json?t=" + Date.now(),
      "https://newbiesteam.surge.sh/updates.json?t=" + Date.now(),
      "https://newbiesbase.surge.sh/updates.json?t=" + Date.now()
    ];

    function tryFetchJson(idx) {
      if (idx >= jsonUrls.length) return Promise.resolve(null);
      return fetch(jsonUrls[idx], { cache: "no-store", headers: { "Cache-Control": "no-cache" } })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .catch(function () {
          return tryFetchJson(idx + 1);
        });
    }

    tryFetchJson(0).then(function (posts) {
      if (Array.isArray(posts) && posts.length > 0) {
        var clean = posts.filter(function (u) {
          return u && u.id && !deletedMap[u.id];
        });
        if (clean.length > 0) {
          var seen = {};
          var merged = [];
          clean.forEach(function (u) {
            var key = u.id || (u.title + "|" + u.date);
            if (!seen[key]) {
              seen[key] = true;
              merged.push(u);
            }
          });
          S.updates = merged;
          if (location.hash.indexOf("#updates") === 0 || (searchInput && searchInput.value)) {
            route(true);
          }
        }
      }
    }).catch(function () {});

    var channel = S.feedChannel;
    var pubB64 = S.devPubKey;
    if (!channel || !pubB64 || !window.crypto || !window.crypto.subtle || !window.TextEncoder) return;

    var endpoint = "https://ntfy.sh/" + encodeURIComponent(channel) + "/json?poll=1&since=all";
    Promise.all([
      window.crypto.subtle.importKey(
        "spki",
        b64ToBytes(pubB64),
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["verify"]
      ),
      fetch(endpoint, { method: "GET" }).then(function (r) { return r.text(); })
    ])
      .then(function (pair) {
        var pubKey = pair[0];
        var rawText = pair[1] || "";
        var lines = rawText.split("\n").filter(Boolean);
        var checks = lines.map(function (line) {
          var ev, post;
          try {
            ev = JSON.parse(line);
            if (!ev || ev.event !== "message" || !ev.message) return Promise.resolve(null);
            post = JSON.parse(ev.message);
          } catch (e) {
            return Promise.resolve(null);
          }
          if (!post || !post.id || !post.sig || deletedMap[post.id]) return Promise.resolve(null);
          var canonical = [
            post.id || "",
            post.date || "",
            post.tag || "",
            post.by || "",
            post.title || "",
            post.body || "",
            post.url || "",
            post.linkLabel || "",
            post.image || ""
          ].join("\n");
          var dataBytes = new TextEncoder().encode(canonical);
          var sigBytes;
          try {
            sigBytes = b64ToBytes(post.sig);
          } catch (e) {
            return Promise.resolve(null);
          }
          return window.crypto.subtle
            .verify("RSASSA-PKCS1-v1_5", pubKey, sigBytes, dataBytes)
            .then(function (ok) {
              if (!ok) return null;
              var item = {
                id: String(post.id),
                date: String(post.date || ""),
                tag: String(post.tag || "Update"),
                by: String(post.by || "Dev"),
                title: String(post.title || ""),
                body: String(post.body || "")
              };
              if (post.url) item.url = String(post.url);
              if (post.linkLabel) item.linkLabel = String(post.linkLabel);
              if (post.image) item.image = String(post.image);
              return item;
            })
            .catch(function () { return null; });
        });
        return Promise.all(checks);
      })
      .then(function (verifiedList) {
        if (!verifiedList) return;
        var valid = verifiedList.filter(Boolean).reverse();
        if (!valid.length) return;
        var existing = (S.updates || []).filter(function (u) {
          return u && !deletedMap[u.id];
        });
        var seen = {};
        var merged = [];
        valid.concat(existing).forEach(function (u) {
          if (!u) return;
          var key = u.id || (u.title + "|" + u.date);
          if (seen[key]) return;
          seen[key] = true;
          merged.push(u);
        });
        if (merged.length !== existing.length) {
          S.updates = merged;
          if (location.hash.indexOf("#updates") === 0 || searchInput.value) {
            route(true);
          }
        }
      })
      .catch(function () {});
  }

  /* ==========================================================================
     Tab Readmes / Overview System (Simple & grounded)
     ========================================================================== */
  var TAB_READMES = {
    roms: {
      icon: "💿",
      badge: "ROMs",
      title: "Custom ROMs & Ported OS",
      description: "Port ROMs (HiOS, HyperOS, OxygenOS), AOSP builds (PixelOS, Axion, InfinityX), and official stock XOS fastboot firmware for the Infinix GT 20 Pro (X6871 / X6853).",
      highlights: [
        { icon: "📱", label: "Port ROMs", desc: "HiOS 16.3, HyperOS 3 V2, and OxygenOS 16" },
        { icon: "⚡", label: "AOSP ROMs", desc: "PixelOS Android 16, Axion V2.4, and InfinityX V3.7" },
        { icon: "📦", label: "Stock XOS", desc: "Official fastboot firmware for Android 14 and 15" },
        { icon: "🛡️", label: "Boot Images", desc: "Stock boot.img files ready for root patching" }
      ],
      getStats: function () {
        var count = 0;
        var ports = 0;
        (S.roms || []).forEach(function (g) {
          if (g.feature) count++;
          if (Array.isArray(g.items)) {
            count += g.items.length;
            if (/port/i.test(g.title || "")) ports += g.items.length;
          }
        });
        return [
          count + " ROMs & Images",
          (ports ? ports + " Port ROMs" : null),
          "Stock XOS 14 & 15"
        ].filter(Boolean);
      },
      warning: "⚠️ Bootloader unlocking (UBL) is required. Always back up your stock boot and NVRAM partitions in OrangeFox before flashing any ROM."
    },
    app: {
      icon: "📱",
      badge: "App",
      title: "Official NewbiesTeam Android App",
      description: "Official Android companion app for Infinix GT 20 Pro with automatic update alerts, offline guide caching, and fast performance.",
      highlights: [
        { icon: "⚡", label: "Update Alerts", desc: "Background notifications when new ROMs, kernels, or modules drop" },
        { icon: "📖", label: "Offline Guides", desc: "Access installation and recovery guides even without internet" },
        { icon: "🚀", label: "Fast & Smooth", desc: "Lightweight client optimized for 120Hz display responsiveness" },
        { icon: "📦", label: "All Releases", desc: "Full history of releases with direct APK downloads and changelogs" }
      ],
      getStats: function () {
        var count = (S.appReleases || []).length;
        return [
          count + " Official Releases",
          "v1.2.1 Latest",
          "6.0 MB APK"
        ];
      },
      warning: "💡 If you see an install prompt, note that the app is distributed directly outside Google Play Store. It is 100% open-source on GitHub."
    },
    modules: {
      icon: "🧩",
      badge: "Modules",
      title: "Magisk & KernelSU Modules",
      description: "Tested systemless modules for Magisk, KernelSU, and APatch. Includes ViPER4Android audio, system adblocking, and status bar styling.",
      highlights: [
        { icon: "🔊", label: "ViPER4Android", desc: "Sound processing, bass boost, and equalizer" },
        { icon: "🛡️", label: "Re-Malwack", desc: "System hosts adblock and malware protection" },
        { icon: "🎨", label: "iOS Statusbar", desc: "iOS-style status bar layout for HiOS / XOS 16" },
        { icon: "🧩", label: "Universal", desc: "Compatible with Magisk, KernelSU, and APatch" }
      ],
      getStats: function () {
        var count = 0;
        (S.modules || []).forEach(function (g) {
          if (Array.isArray(g.items)) count += g.items.length;
        });
        return [
          count + " Tested Modules",
          "Magisk / KernelSU",
          "Safe on GT 20 Pro"
        ];
      },
      warning: "💡 Flash modules one by one. If your phone gets stuck in a bootloop, boot into OrangeFox Recovery and delete the module from /data/adb/modules."
    },
    kernels: {
      icon: "⚡",
      badge: "Kernels",
      title: "Kernels & Root Boot Images",
      description: "Kernels, patched boot images, and root manager APKs for the GT 20 Pro. Used for rooting with KernelSU and flashing custom GKI builds.",
      highlights: [
        { icon: "🛡️", label: "KernelSU APKs", desc: "KSU Ultra V1 and KernelSU Next managers" },
        { icon: "⚡", label: "Patched Boot", desc: "Pre-patched stock boot (15.1.2.180) for instant root" },
        { icon: "🔧", label: "GKI Kernels", desc: "Custom GKI kernel builds (Vortex, Zixine)" },
        { icon: "📦", label: "Clean Root", desc: "Kernel-level root without modifying system files" }
      ],
      getStats: function () {
        var count = 0;
        (S.kernels || []).forEach(function (g) {
          if (Array.isArray(g.items)) count += g.items.length;
        });
        return [
          count + " Kernel & Root Files",
          "KernelSU Supported",
          "GKI & Stock Patched"
        ];
      },
      warning: "⚠️ Make sure the kernel or patched boot matches your exact XOS build number. Flashing the wrong version will cause a bootloop."
    },
    recovery: {
      icon: "🛠️",
      badge: "Recovery",
      title: "Recovery & Flashing Tools",
      description: "OrangeFox recovery, Fenrir images, Penumbra flashing tool, and essential root utility apps to flash files, take backups, and unbrick.",
      highlights: [
        { icon: "🦊", label: "OrangeFox", desc: "OFOX R12.0 recovery with touchscreen support" },
        { icon: "🐺", label: "Fenrir", desc: "Custom boot and recovery images for Android 14 & 15" },
        { icon: "🛠️", label: "Penumbra", desc: "CLI and GUI flash tools for Windows and Linux" },
        { icon: "📱", label: "Root Apps", desc: "Swift Backup, Scene, and MT Manager Pro" }
      ],
      getStats: function () {
        var count = 0;
        (S.recovery || []).forEach(function (g) {
          if (Array.isArray(g.items)) count += g.items.length;
        });
        return [
          count + " Recovery & Tools",
          "OrangeFox & Fenrir",
          "PC Flashing Tools"
        ];
      },
      warning: "⭐ Crucial: Never re-lock your bootloader while on custom recovery or modified boot, or the device will hard brick."
    },
    screenshots: {
      icon: "📸",
      badge: "Screenshots",
      title: "ROM Screenshots Gallery",
      description: "Real screenshots from custom ROMs running on the Infinix GT 20 Pro. Preview launcher style, status bar, and settings before flashing.",
      highlights: [
        { icon: "📸", label: "HiOS 16.3", desc: "Settings, launcher, and system screenshots" },
        { icon: "📸", label: "HyperOS 3", desc: "Control center, lock screen, and UI previews" },
        { icon: "🔍", label: "Lightbox", desc: "Tap any thumbnail to view and swipe fullscreen" },
        { icon: "🔗", label: "ROM Linked", desc: "Open screenshots directly from any ROM's info drawer" }
      ],
      getStats: function () {
        var totalScreens = 0;
        var romsWithScreens = 0;
        (S.roms || []).forEach(function (g) {
          if (g.feature && Array.isArray(g.feature.screenshots) && g.feature.screenshots.length) {
            totalScreens += g.feature.screenshots.length;
            romsWithScreens++;
          }
          if (Array.isArray(g.items)) {
            g.items.forEach(function (it) {
              if (Array.isArray(it.screenshots) && it.screenshots.length) {
                totalScreens += it.screenshots.length;
                romsWithScreens++;
              }
            });
          }
        });
        return [
          totalScreens + " Real Screenshots",
          romsWithScreens + " ROMs Covered",
          "Fullscreen Lightbox"
        ];
      },
      warning: "💡 Tap any screenshot to expand fullscreen. Use arrow keys or swipe left/right to browse."
    },
    updates: {
      icon: "📢",
      badge: "Updates",
      title: "News & Community Releases",
      description: "Release notes, new ROM/kernel drops, bug fixes, and safety warnings from the Newbies Team.",
      highlights: [
        { icon: "📢", label: "Release Notes", desc: "Changelogs for new ROMs and recovery builds" },
        { icon: "🔧", label: "Bug Fixes", desc: "Known bugs, fixes, and community workarounds" },
        { icon: "🚨", label: "Safety Alerts", desc: "Warnings about dangerous official OTA updates" },
        { icon: "💬", label: "Telegram", desc: "Direct links to Newbies Team community discussions" }
      ],
      getStats: function () {
        var count = (S.updates || []).length;
        return [
          count + " Updates Posted",
          "Live Cloud Feed",
          "Verified Posts"
        ];
      },
      warning: "🔔 Check here before accepting official Infinix OTA updates if you have root or custom recovery installed."
    },
    guides: {
      icon: "📖",
      badge: "Guides",
      title: "Step-by-Step Guides",
      description: "Beginner-friendly guides for bootloader unlock, flashing OrangeFox, installing port ROMs, downgrading XOS, and backups.",
      highlights: [
        { icon: "🔓", label: "Bootloader", desc: "How to unlock and re-lock your bootloader safely" },
        { icon: "🦊", label: "OrangeFox", desc: "How to flash custom recovery using fastboot" },
        { icon: "💿", label: "Port & AOSP", desc: "Step-by-step flashing instructions for ROMs" },
        { icon: "💾", label: "Backups", desc: "How to back up and restore apps with Swift Backup" }
      ],
      getStats: function () {
        var count = (S.guides && Array.isArray(S.guides.items)) ? S.guides.items.length : 0;
        return [
          count + " Step-by-Step Guides",
          "Terminal Commands",
          "X6871 Tested"
        ];
      },
      warning: "📌 Read every step before typing terminal commands. Keep your phone charged above 50% before flashing."
    }
  };

  var activeHoldIndicator = null;
  var activeOverviewPopover = null;
  var activeOverviewBackdrop = null;
  var activeHoldTabKey = null;
  var popoverOpenedAt = 0;
  var holdFired = false;
  var currentHoldTab = null;
  var holdRaf = null;
  var holdStartTs = null;
  var HOLD_DURATION_MS = 2000;

  function hideHoldIndicator() {
    if (holdRaf) {
      cancelAnimationFrame(holdRaf);
      holdRaf = null;
    }
    holdStartTs = null;
    if (activeHoldIndicator) {
      activeHoldIndicator.remove();
      activeHoldIndicator = null;
    }
  }

  function showHoldIndicator(tabEl, onComplete) {
    hideHoldIndicator();
    if (!tabEl) return;
    var rect = tabEl.getBoundingClientRect();
    var ind = el("div", "tab-hold-indicator");
    ind.innerHTML =
      '<svg class="tab-hold-svg" viewBox="0 0 24 24" aria-hidden="true">' +
        '<circle class="tab-hold-track" cx="12" cy="12" r="9.5"></circle>' +
        '<circle class="tab-hold-fill" cx="12" cy="12" r="9.5"></circle>' +
      '</svg>' +
      '<span class="tab-hold-text">Hold for README</span>';
    document.body.appendChild(ind);

    var isMobile = window.innerWidth <= 640;
    var isBelow = isMobile || rect.top < 38;
    ind.classList.toggle("is-below", isBelow);

    var left = rect.left + rect.width / 2;
    var top = isBelow ? rect.bottom + 8 : rect.top - 8;
    ind.style.left = Math.round(left) + "px";
    ind.style.top = Math.round(top) + "px";

    ind.classList.add("is-visible");
    var fill = ind.querySelector(".tab-hold-fill");

    holdStartTs = null;
    function animTick(now) {
      if (!holdStartTs) holdStartTs = now;
      var elapsed = now - holdStartTs;
      var progress = Math.min(1, elapsed / HOLD_DURATION_MS);
      if (fill) {
        fill.style.strokeDashoffset = (59.7 * (1 - progress)).toFixed(2);
      }
      if (progress < 1) {
        holdRaf = requestAnimationFrame(animTick);
      } else {
        hideHoldIndicator();
        if (typeof onComplete === "function") {
          onComplete();
        }
      }
    }
    holdRaf = requestAnimationFrame(animTick);
    activeHoldIndicator = ind;
  }

  function positionTabOverview(pop, arrow, tabEl) {
    if (!pop || !tabEl) return;
    if (window.innerWidth <= 640) {
      pop.style.left = "";
      pop.style.top = "";
      return;
    }

    var tabRect = tabEl.getBoundingClientRect();
    var popW = pop.offsetWidth || 430;
    var popH = pop.offsetHeight || 380;
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    var tabCenterX = tabRect.left + tabRect.width / 2;
    var left = tabCenterX - popW / 2;
    if (left < 14) left = 14;
    if (left + popW > vw - 14) left = vw - popW - 14;

    var top = tabRect.bottom + 10;
    var placeAbove = false;
    if (top + popH > vh - 14 && tabRect.top - popH - 10 >= 14) {
      top = tabRect.top - popH - 10;
      placeAbove = true;
    }

    pop.style.left = Math.round(left) + "px";
    pop.style.top = Math.round(top) + "px";
    pop.classList.toggle("is-above", placeAbove);

    if (arrow) {
      var arrowX = tabCenterX - left - 6;
      if (arrowX < 18) arrowX = 18;
      if (arrowX > popW - 24) arrowX = popW - 24;
      arrow.style.left = Math.round(arrowX) + "px";
    }
  }

  function closeTabOverview() {
    popoverOpenedAt = 0;
    holdFired = false;
    currentHoldTab = null;
    activeHoldTabKey = null;
    if (activeOverviewPopover) {
      activeOverviewPopover.remove();
      activeOverviewPopover = null;
    }
    if (activeOverviewBackdrop) {
      activeOverviewBackdrop.remove();
      activeOverviewBackdrop = null;
    }
    tabLinks.forEach(function (a) {
      a.removeAttribute("aria-expanded");
    });
  }

  function openTabOverview(tabKey, tabEl) {
    closeTabOverview();
    var readme = TAB_READMES[tabKey];
    if (!readme) return;

    popoverOpenedAt = Date.now();
    activeHoldTabKey = tabKey;
    currentHoldTab = tabEl;

    var pop = el("div", "tab-overview-popover");
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-modal", "true");
    pop.setAttribute("aria-label", readme.title + " Overview");

    var arrow = el("div", "tab-overview-arrow");
    arrow.setAttribute("aria-hidden", "true");
    pop.appendChild(arrow);

    var head = el("div", "tab-overview-head");
    var iconBox = el("div", "tab-overview-icon-box", readme.icon);
    head.appendChild(iconBox);

    var titles = el("div", "tab-overview-titles");
    var tagRow = el("div", "tab-overview-tag-row");
    tagRow.appendChild(el("span", "tab-overview-badge", readme.badge));
    tagRow.appendChild(el("span", "tab-overview-hint", "README & Overview"));
    titles.appendChild(tagRow);
    titles.appendChild(el("h3", "tab-overview-title", readme.title));
    head.appendChild(titles);

    var closeBtn = el("button", "tab-overview-close", "\u00d7");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close overview");
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeTabOverview();
    });
    head.appendChild(closeBtn);
    pop.appendChild(head);

    var stats = typeof readme.getStats === "function" ? readme.getStats() : [];
    if (stats && stats.length) {
      var statsBox = el("div", "tab-overview-stats");
      stats.forEach(function (st) {
        statsBox.appendChild(el("span", "tab-overview-stat-pill", st));
      });
      pop.appendChild(statsBox);
    }

    pop.appendChild(el("p", "tab-overview-desc", readme.description));

    if (readme.highlights && readme.highlights.length) {
      var hlWrap = el("div", "tab-overview-highlights");
      hlWrap.appendChild(el("div", "tab-overview-sec-title", "What\u2019s in this section"));
      var grid = el("div", "tab-overview-grid");
      readme.highlights.forEach(function (h) {
        var feat = el("div", "tab-overview-feat");
        feat.appendChild(el("span", "tab-overview-feat-ico", h.icon));
        var featBody = el("div", "tab-overview-feat-body");
        featBody.appendChild(el("strong", "", h.label));
        featBody.appendChild(el("span", "", h.desc));
        feat.appendChild(featBody);
        grid.appendChild(feat);
      });
      hlWrap.appendChild(grid);
      pop.appendChild(hlWrap);
    }

    if (readme.warning) {
      var alert = el("div", "tab-overview-alert");
      alert.appendChild(el("span", "tab-overview-alert-ico", "💡"));
      alert.appendChild(el("div", "tab-overview-alert-txt", readme.warning));
      pop.appendChild(alert);
    }

    var actions = el("div", "tab-overview-actions");
    var openBtn = el("button", "tab-overview-btn tab-overview-btn-primary");
    openBtn.type = "button";
    var knownTab = TABS.filter(function (t) { return t[0] === tabKey; })[0];
    var tabLabel = knownTab ? knownTab[1] : "Tab";
    openBtn.innerHTML = '<span>Explore ' + tabLabel + '</span>' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    openBtn.addEventListener("click", function () {
      closeTabOverview();
      if (location.hash !== "#" + tabKey) {
        location.hash = "#" + tabKey;
      }
    });

    var ghostBtn = el("button", "tab-overview-btn tab-overview-btn-ghost", "Close");
    ghostBtn.type = "button";
    ghostBtn.addEventListener("click", function () {
      closeTabOverview();
    });

    actions.appendChild(ghostBtn);
    actions.appendChild(openBtn);
    pop.appendChild(actions);

    var backdrop = el("div", "tab-overview-backdrop");
    backdrop.addEventListener("click", function (e) {
      if (Date.now() - popoverOpenedAt < 400) return;
      closeTabOverview();
    });
    document.body.appendChild(backdrop);
    document.body.appendChild(pop);

    activeOverviewPopover = pop;
    activeOverviewBackdrop = backdrop;
    tabEl.setAttribute("aria-expanded", "true");

    positionTabOverview(pop, arrow, tabEl);
  }

  function initTabReadmeHoldListeners() {
    var indicatorTimeout = null;
    var touchStartX = 0;
    var touchStartY = 0;

    function cancelHold() {
      if (indicatorTimeout) {
        clearTimeout(indicatorTimeout);
        indicatorTimeout = null;
      }
      hideHoldIndicator();
    }

    tabLinks.forEach(function (tabEl) {
      var tabKey = tabEl.dataset.tab;
      if (!tabKey) return;

      tabEl.setAttribute("draggable", "false");

      // Desktop hover
      tabEl.addEventListener("mouseenter", function () {
        if (activeOverviewPopover && activeHoldTabKey === tabKey) {
          return;
        }
        cancelHold();
        if (activeOverviewPopover) {
          closeTabOverview();
        }

        currentHoldTab = tabEl;
        activeHoldTabKey = tabKey;
        holdFired = false;

        indicatorTimeout = setTimeout(function () {
          showHoldIndicator(tabEl, function () {
            holdFired = true;
            if (navigator.vibrate) {
              try { navigator.vibrate(25); } catch (e) {}
            }
            openTabOverview(tabKey, tabEl);
          });
        }, 120);
      });

      tabEl.addEventListener("mouseleave", function () {
        cancelHold();
      });

      // Mobile touch
      tabEl.addEventListener("touchstart", function (e) {
        if (!e.touches || !e.touches[0]) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;

        cancelHold();
        if (activeOverviewPopover) {
          closeTabOverview();
        }

        currentHoldTab = tabEl;
        activeHoldTabKey = tabKey;
        holdFired = false;

        indicatorTimeout = setTimeout(function () {
          showHoldIndicator(tabEl, function () {
            holdFired = true;
            if (navigator.vibrate) {
              try { navigator.vibrate(30); } catch (e) {}
            }
            openTabOverview(tabKey, tabEl);
          });
        }, 80);
      }, { passive: true });

      tabEl.addEventListener("touchmove", function (e) {
        if (!e.touches || !e.touches[0]) return;
        var dx = Math.abs(e.touches[0].clientX - touchStartX);
        var dy = Math.abs(e.touches[0].clientY - touchStartY);
        if (dx > 22 || dy > 22) {
          cancelHold();
        }
      }, { passive: true });

      tabEl.addEventListener("touchend", function (e) {
        if (holdFired || (Date.now() - popoverOpenedAt < 600)) {
          if (e.cancelable) e.preventDefault();
        }
        cancelHold();
      });

      tabEl.addEventListener("touchcancel", function () {
        cancelHold();
      });

      tabEl.addEventListener("contextmenu", function (e) {
        e.preventDefault();
      });

      tabEl.addEventListener("click", function (e) {
        if (holdFired || (Date.now() - popoverOpenedAt < 600)) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        cancelHold();
        if (activeOverviewPopover) {
          closeTabOverview();
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" || e.keyCode === 27) {
        cancelHold();
        closeTabOverview();
      }
    });

    document.addEventListener("pointerdown", function (e) {
      if (!activeOverviewPopover) return;
      if (Date.now() - popoverOpenedAt < 450) return;
      if (activeOverviewPopover.contains(e.target)) return;
      if (currentHoldTab && currentHoldTab.contains(e.target)) return;
      closeTabOverview();
    });

    window.addEventListener("resize", function () {
      if (activeOverviewPopover && currentHoldTab) {
        var arrow = activeOverviewPopover.querySelector(".tab-overview-arrow");
        positionTabOverview(activeOverviewPopover, arrow, currentHoldTab);
      }
    }, { passive: true });
  }


  /* ==========================================================================
     Developer Engine State & Configuration
     ========================================================================== */
  var CONFIG = {
    submissionChannel: "nbt_sub_8d0b5336c092d316a726be04",
    relayUrl: "https://ntfy.envs.net/nbt_sub_8d0b5336c092d316a726be04",
    relayFallbackUrl: "https://ntfy.sh/nbt_sub_8d0b5336c092d316a726be04",
    liveFeedUrl: "https://newbiesteam.pages.dev/data.js",
    authManifestUrl: "https://newbiesteam.pages.dev/auth-manifest.json",
    authManifestFallbackUrl: "https://newbiesteam.surge.sh/auth-manifest.json"
  };

  /* Live app version label for presence/identity — resolved from the native bridge
     (Android APK) or the latest published release in data.js as fallback. No hardcoding. */
  function getDevAppVersionLabel() {
    try {
      if (window.AndroidBridge && typeof window.AndroidBridge.getAppVersion === "function") {
        return "NewbiesDev v" + window.AndroidBridge.getAppVersion();
      }
    } catch (_) {}
    if (window.__NBT_APP_VERSION__) return "NewbiesDev v" + window.__NBT_APP_VERSION__;
    var latest = (window.SITE && window.SITE.appReleases && window.SITE.appReleases[0] && window.SITE.appReleases[0].version) || "3.0.0";
    return "NewbiesDev v" + String(latest).replace(/^v/i, "");
  }

  var currentKey = null;
  var currentUser = null;
  var presenceInterval = null;
  var compressedBannerBase64 = null;
  var batchScreenshots = []; // Array of { dataUrl, caption }

  // 1. Initial startup check for persistent optimistic cache & pending mutations
  try {
    var rawOpt = localStorage.getItem("nbt_optimistic_site");
    if (rawOpt) {
      var opt = JSON.parse(rawOpt);
      if (opt && opt.site && (opt.site.roms || opt.site.updates || opt.site.guides)) {
        window.SITE = opt.site;
        S = window.SITE;
      }
    }
  } catch (_) {}

  function saveOptimisticSite() {
    try {
      localStorage.setItem("nbt_optimistic_site", JSON.stringify({
        ts: Date.now(),
        site: window.SITE
      }));
    } catch (e) {
      console.warn("Could not save optimistic site to localStorage:", e);
    }
  }

  function recordPendingMutation(mutation) {
    try {
      var list = [];
      var raw = localStorage.getItem("nbt_pending_mutations");
      if (raw) list = JSON.parse(raw);
      var cutoff = Date.now() - 15 * 60 * 1000;
      list = list.filter(function (m) { return m && m.ts > cutoff; });
      list.push(mutation);
      localStorage.setItem("nbt_pending_mutations", JSON.stringify(list));
    } catch (_) {}
  }

  function mergePendingMutations(freshSite) {
    try {
      var raw = localStorage.getItem("nbt_pending_mutations");
      if (!raw) return freshSite;
      var list = JSON.parse(raw);
      if (!Array.isArray(list) || !list.length) return freshSite;

      var cutoff = Date.now() - 15 * 60 * 1000;
      var remaining = [];

      list.forEach(function (m) {
        if (!m || m.ts < cutoff) return;
        var tab = m.type || m.section;
        var act = m.action;
        var data = m.data || {};
        var targetName = m.targetName || data.name || data.title;
        var targetCat = m.targetCategory || data.category;

        if (act === "edit") {
          var matched = false;
          if (tab === "updates" && Array.isArray(freshSite.updates)) {
            var u = freshSite.updates.find(function (x) { return x.id === m.targetId || x.title === targetName; });
            if (u) {
              matched = true;
              if (u.title === data.title && u.body === data.body && u.tag === data.tag) {
                return;
              }
              Object.assign(u, data);
              remaining.push(m);
            }
          } else if (tab === "guides") {
            var gItems = Array.isArray(freshSite.guides) ? freshSite.guides : (freshSite.guides && freshSite.guides.items);
            if (Array.isArray(gItems)) {
              var g = gItems.find(function (x) { return x.slug === m.targetId || x.title === targetName; });
              if (g) {
                matched = true;
                if (g.title === data.title && g.readTime === data.readTime) {
                  return;
                }
                Object.assign(g, data);
                remaining.push(m);
              }
            }
          } else if (Array.isArray(freshSite[tab])) {
            for (var i = 0; i < freshSite[tab].length; i++) {
              var cat = freshSite[tab][i];
              if (cat.feature && (cat.feature.name === targetName || (m.targetId && (cat.feature.romId === m.targetId || cat.feature.id === m.targetId)))) {
                matched = true;
                if (cat.feature.name === data.name && cat.feature.url === data.url && cat.feature.date === data.date && (!data.note || cat.feature.note === data.note)) {
                  return;
                }
                Object.assign(cat.feature, data);
                remaining.push(m);
                break;
              }
              if (Array.isArray(cat.items)) {
                var it = cat.items.find(function (x) { return x.name === targetName || (m.targetId && (x.id === m.targetId || x.romId === m.targetId)); });
                if (it) {
                  matched = true;
                  if (it.name === data.name && it.url === data.url && it.date === data.date && (!data.note || it.note === data.note)) {
                    return;
                  }
                  Object.assign(it, data);
                  remaining.push(m);
                  break;
                }
              }
            }
          }
          if (!matched) {
            remaining.push(m);
          }
        } else if (act === "add") {
          var exists = false;
          if (tab === "updates" && Array.isArray(freshSite.updates)) {
            exists = freshSite.updates.some(function (x) { return x.id === data.id || x.title === data.title; });
            if (!exists) {
              freshSite.updates.unshift(data);
              remaining.push(m);
            }
          } else if (tab === "guides") {
            var gItems = Array.isArray(freshSite.guides) ? freshSite.guides : (freshSite.guides && freshSite.guides.items);
            if (Array.isArray(gItems)) {
              exists = gItems.some(function (x) { return x.slug === data.slug || x.title === data.title; });
              if (!exists) {
                gItems.unshift(data);
                remaining.push(m);
              }
            }
          } else if (Array.isArray(freshSite[tab])) {
            for (var i = 0; i < freshSite[tab].length; i++) {
              var c = freshSite[tab][i];
              if (c.feature && (c.feature.name === data.name || (data.romId && c.feature.romId === data.romId))) { exists = true; break; }
              if (Array.isArray(c.items) && c.items.some(function (x) { return x.name === data.name || (data.romId && x.romId === data.romId); })) { exists = true; break; }
            }
            if (!exists) {
              var targetGrp = freshSite[tab].find(function (c) { return targetCat && c.title.toLowerCase() === targetCat.toLowerCase(); });
              if (!targetGrp) {
                targetGrp = { title: targetCat || "Latest", items: [] };
                freshSite[tab].push(targetGrp);
              }
              if (!Array.isArray(targetGrp.items)) targetGrp.items = [];
              targetGrp.items.unshift(data);
              remaining.push(m);
            }
          }
        } else if (act === "delete") {
          if (tab === "updates" && Array.isArray(freshSite.updates)) {
            var len = freshSite.updates.length;
            freshSite.updates = freshSite.updates.filter(function (x) { return x.id !== m.targetId && x.title !== targetName; });
            if (freshSite.updates.length < len) remaining.push(m);
          } else if (tab === "guides") {
            var gItems = Array.isArray(freshSite.guides) ? freshSite.guides : (freshSite.guides && freshSite.guides.items);
            if (Array.isArray(gItems)) {
              var len = gItems.length;
              var filtered = gItems.filter(function (x) { return x.slug !== m.targetId && x.title !== targetName; });
              if (Array.isArray(freshSite.guides)) freshSite.guides = filtered;
              else freshSite.guides.items = filtered;
              if (filtered.length < len) remaining.push(m);
            }
          } else if (Array.isArray(freshSite[tab])) {
            freshSite[tab].forEach(function (c) {
              if (c.feature && (c.feature.name === targetName || (m.targetId && c.feature.romId === m.targetId))) {
                delete c.feature;
                remaining.push(m);
              }
              if (Array.isArray(c.items)) {
                var len = c.items.length;
                c.items = c.items.filter(function (x) { return x.name !== targetName && (!m.targetId || (x.id !== m.targetId && x.romId !== m.targetId)); });
                if (c.items.length < len) remaining.push(m);
              }
            });
          }
        } else if (act === "delete_screenshot") {
          var targetRomId = m.romId || targetName;
          var targetUrl = m.url;
          if (Array.isArray(freshSite.roms)) {
            for (var i = 0; i < freshSite.roms.length; i++) {
              var c = freshSite.roms[i];
              var rom = (c.feature && (c.feature.romId === targetRomId || c.feature.name === targetRomId)) ? c.feature : null;
              if (!rom && Array.isArray(c.items)) {
                rom = c.items.find(function (x) { return x.romId === targetRomId || x.name === targetRomId; });
              }
              if (rom && Array.isArray(rom.screenshots) && targetUrl) {
                var len = rom.screenshots.length;
                rom.screenshots = rom.screenshots.filter(function (s) {
                  return s.url !== targetUrl && (!s.url || !targetUrl || (!s.url.endsWith(targetUrl) && !targetUrl.endsWith(s.url)));
                });
                if (rom.screenshots.length < len) remaining.push(m);
                break;
              }
            }
          }
        }
      });

      localStorage.setItem("nbt_pending_mutations", JSON.stringify(remaining));
      return freshSite;
    } catch (e) {
      console.warn("Could not merge pending mutations:", e);
      return freshSite;
    }
  }

  // 2. Device UUID & Single-User Persistence via AndroidBridge or localStorage
  function getDeviceId() {
    if (window.AndroidBridge && typeof window.AndroidBridge.getDeviceId === "function") {
      try {
        var bridgeId = window.AndroidBridge.getDeviceId();
        if (bridgeId) return String(bridgeId);
      } catch (_) {}
    }
    var localId = null;
    try {
      localId = localStorage.getItem("nbt_device_uuid");
    } catch (_) {}
    if (!localId) {
      localId = "dev-" + Math.random().toString(36).substring(2, 10) + "-" + Date.now().toString(36);
      try {
        localStorage.setItem("nbt_device_uuid", localId);
      } catch (_) {}
    }
    return localId;
  }

  function savePersistentSession(sessionData) {
    var jsonStr = JSON.stringify(sessionData);
    try {
      localStorage.setItem("nbt_dev_saved_session", jsonStr);
    } catch (_) {}
    if (window.AndroidBridge && typeof window.AndroidBridge.saveDevState === "function") {
      try {
        window.AndroidBridge.saveDevState(jsonStr);
      } catch (_) {}
    }
  }

  function getPersistentSession() {
    if (window.AndroidBridge && typeof window.AndroidBridge.getDevState === "function") {
      try {
        var raw = window.AndroidBridge.getDevState();
        if (raw && typeof raw === "string" && raw.trim().startsWith("{")) {
          return JSON.parse(raw);
        }
      } catch (_) {}
    }
    try {
      var raw = localStorage.getItem("nbt_dev_saved_session");
      if (raw && typeof raw === "string" && raw.trim().startsWith("{")) {
        return JSON.parse(raw);
      }
    } catch (_) {}
    return null;
  }

  function clearPersistentSession() {
    currentKey = null;
    currentUser = null;
    try {
      localStorage.removeItem("nbt_dev_saved_session");
    } catch (_) {}
    if (window.AndroidBridge && typeof window.AndroidBridge.clearDevState === "function") {
      try {
        window.AndroidBridge.clearDevState();
      } catch (_) {}
    }
  }

  function cleanKeyString(raw) {
    if (!raw) return "";
    return String(raw)
      .trim()
      .replace(/^["']+|["']+$/g, "")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/\s+/g, "");
  }

  async function sha256Hex(str) {
    var enc = new TextEncoder();
    var data = enc.encode(str);
    var hashBuf = await crypto.subtle.digest("SHA-256", data);
    var hashArr = Array.from(new Uint8Array(hashBuf));
    return hashArr.map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  // 3. Online Auth Verification & Manifest Loading
  async function fetchOnlineAuthManifest() {
    var urls = [
      CONFIG.authManifestUrl + "?t=" + Date.now(),
      CONFIG.authManifestFallbackUrl + "?t=" + Date.now(),
      "https://newbiesbase.surge.sh/auth-manifest.json?t=" + Date.now(),
      "http://127.0.0.1:4720/auth-manifest.json?t=" + Date.now(),
      "auth-manifest.json?t=" + Date.now()
    ];
    for (var i = 0; i < urls.length; i++) {
      try {
        var res = await fetch(urls[i], { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
        if (res.ok) {
          var manifest = await res.json();
          if (manifest && manifest.keys) return manifest;
        }
      } catch (_) {}
    }
    return null;
  }

  async function verifyKeyOnline(rawKey) {
    var clean = cleanKeyString(rawKey);
    if (!clean) return { ok: false, error: "Please enter your 32-character developer key." };
    var hash = null;
    try {
      hash = await sha256Hex(clean);
    } catch (err) {
      return { ok: false, error: "SHA-256 crypto is not supported in this browser environment." };
    }
    var manifest = await fetchOnlineAuthManifest();
    if (!manifest || !manifest.keys) {
      return { ok: false, error: "Unable to reach auth server. Check your network connection." };
    }
    var matched = null;
    var slots = Object.keys(manifest.keys);
    for (var i = 0; i < slots.length; i++) {
      var slotId = slots[i];
      var item = manifest.keys[slotId];
      if (item.key_hash && item.key_hash.toLowerCase() === hash.toLowerCase()) {
        matched = Object.assign({ slotId: slotId }, item);
        break;
      }
    }
    if (!matched) {
      return { ok: false, error: "Invalid developer key. Check spelling or contact an Admin." };
    }
    if (matched.revoked) {
      return { ok: false, revoked: true, error: "This developer key was rotated or revoked by Admin." };
    }
    return {
      ok: true,
      keyString: clean,
      keyHash: hash,
      slot: matched.slotId,
      name: matched.name || matched.slotId,
      role: matched.role || "team",
      canAutoPush: Boolean(matched.can_auto_push),
      requiresVerification: Boolean(matched.requires_verification),
      autoPushSections: matched.auto_push_sections || (matched.can_auto_push ? ["*"] : []),
      allowedSections: matched.allowed_sections || ["*"],
      allowedActions: matched.allowed_actions || ["add", "edit", "delete"],
      description: matched.description || "",
      bound_device_id: matched.bound_device_id,
      bound_user_name: matched.bound_user_name,
      key_version: matched.key_version || 1
    };
  }

  // 4. Client-side Image Compression (WebP via Canvas)
  function compressImageFile(file, maxWidth, maxHeight, quality) {
    if (!maxWidth) maxWidth = 1280;
    if (!maxHeight) maxHeight = 1280;
    if (!quality) quality = 0.88;

    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = reject;
      reader.onload = function (e) {
        var img = new Image();
        img.onerror = reject;
        img.onload = function () {
          var width = img.width;
          var height = img.height;
          if (width > maxWidth || height > maxHeight) {
            var ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          var canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          var ctx = canvas.getContext("2d");
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);
          var dataUrl = canvas.toDataURL("image/webp", quality);
          resolve(dataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function compressAvatarFile(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = reject;
      reader.onload = function (e) {
        var img = new Image();
        img.onerror = reject;
        img.onload = function () {
          var size = Math.min(img.width, img.height);
          var startX = (img.width - size) / 2;
          var startY = (img.height - size) / 2;
          var canvas = document.createElement("canvas");
          canvas.width = 160;
          canvas.height = 160;
          var ctx = canvas.getContext("2d");
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, startX, startY, size, size, 0, 0, 160, 160);
          var dataUrl = canvas.toDataURL("image/webp", 0.90);
          resolve(dataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // 5. Cloud Relay & Local Daemon Dispatch
  async function dispatchSubmission(submission) {
    var jsonString = JSON.stringify(submission);
    var isDesktopLocalhost = (
      typeof window !== "undefined" &&
      window.location &&
      (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") &&
      window.location.protocol.startsWith("http")
    );

    if (isDesktopLocalhost) {
      try {
        var res = await fetch("http://127.0.0.1:4720/dev-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: jsonString,
          signal: AbortSignal.timeout(1000)
        });
        if (res.ok) {
          var resData = await res.json().catch(function () { return { ok: true }; });
          if (resData.ok) {
            return { ok: true, direct: true };
          }
        }
      } catch (_) {}
    }

    var relayUrls = [
      CONFIG.relayUrl,
      CONFIG.relayUrl + "_b",
      CONFIG.relayFallbackUrl,
      CONFIG.relayFallbackUrl + "_b"
    ].filter(Boolean);

    var lastError = null;
    for (var i = 0; i < relayUrls.length; i++) {
      var url = relayUrls[i];
      for (var attempt = 0; attempt < 2; attempt++) {
        try {
          var res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Title": "NBT Submission: " + (submission.title || submission.type),
              "Priority": "high",
              "Tags": "inbox_tray,zap"
            },
            body: jsonString,
            signal: AbortSignal.timeout(8000)
          });
          if (res.status === 429) {
            await new Promise(function (r) { setTimeout(r, 1500); });
            continue;
          }
          if (!res.ok) {
            throw new Error("Relay returned status " + res.status);
          }
          return { ok: true };
        } catch (err) {
          lastError = err;
          await new Promise(function (r) { setTimeout(r, 600); });
        }
      }
    }
    throw lastError || new Error("Failed to dispatch submission over all relay channels");
  }

  async function dispatchDeviceClaim(session) {
    var payload = {
      type: "device_claim",
      id: "claim-" + Date.now(),
      key: session.key,
      deviceId: session.deviceId,
      name: session.name,
      photo: session.photo ? "attached" : "",
      timestamp: session.activatedAt
    };
    try {
      await fetch(CONFIG.relayUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Title": "NBT Device Claim: " + session.name,
          "Priority": "default"
        },
        body: JSON.stringify(payload)
      });
    } catch (_) {}
  }

  function sendPresenceHeartbeat() {
    if (!currentKey || !currentUser) return;
    var payload = {
      type: "presence",
      key: currentKey,
      deviceId: getDeviceId(),
      name: currentUser.name,
      appVersion: getDevAppVersionLabel(),
      timestamp: Date.now()
    };
    try {
      fetch(CONFIG.relayUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(function () {});
    } catch (_) {}
  }

  function startPresenceHeartbeat() {
    if (presenceInterval) clearInterval(presenceInterval);
    sendPresenceHeartbeat();
    presenceInterval = setInterval(sendPresenceHeartbeat, 60000);
  }

  // 6. Live Feed Sync with persistent optimistic mutation overlay
  // Mirrors are tried in order: Cloudflare Pages primary -> Surge -> Surge base mirror.
  var LIVE_FEED_URLS = [
    "https://newbiesteam.pages.dev/data.js",
    "https://newbiesteam.surge.sh/data.js",
    "https://newbiesbase.surge.sh/data.js"
  ];

  async function fetchLiveSiteData(isManual) {
    var pfpDot = document.getElementById("dev-pfp-dot");
    var statusText = document.getElementById("dev-status-text");
    var lastSyncedText = document.getElementById("dev-last-synced");

    if (pfpDot) pfpDot.className = "dev-pfp-dot is-syncing";
    if (statusText) statusText.textContent = "🟡 Syncing with Server...";

    var now = Date.now();
    var fetchedFresh = false;
    var fetchedSource = "";

    for (var i = 0; i < LIVE_FEED_URLS.length && !fetchedFresh; i++) {
      try {
        var feedUrl = LIVE_FEED_URLS[i] + "?t=" + now;
        var res = await fetch(feedUrl, { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
        if (res.ok) {
          var text = await res.text();
          try {
            var fn = new Function("window", text + "; return window.SITE;");
            var freshSite = fn({});
            if (freshSite && (freshSite.roms || freshSite.updates || freshSite.guides)) {
              freshSite = mergePendingMutations(freshSite);
              window.SITE = freshSite;
              S = window.SITE;
              saveOptimisticSite();
              fetchedFresh = true;
              fetchedSource = LIVE_FEED_URLS[i].replace(/^https:\/\//, "");
            }
          } catch (e) {
            console.warn("Could not evaluate live data.js from " + LIVE_FEED_URLS[i] + ":", e);
          }
        }
      } catch (err) {
        console.warn("Live fetch failed for " + LIVE_FEED_URLS[i] + ":", err);
      }
    }

    if (!fetchedFresh) {
      try {
        var rawOpt = localStorage.getItem("nbt_optimistic_site");
        if (rawOpt) {
          var opt = JSON.parse(rawOpt);
          if (opt && opt.site) {
            window.SITE = opt.site;
            S = window.SITE;
          }
        }
      } catch (_) {}
    }

    if (pfpDot) pfpDot.className = "dev-pfp-dot is-online";
    if (statusText) statusText.textContent = fetchedFresh ? "🟢 Online · Key Verified" : "🟠 Offline · Local changes kept";
    // Invariant: "Last synced" is only ever updated with VERIFIED network data.
    if (lastSyncedText && fetchedFresh) {
      lastSyncedText.textContent = "Last synced: " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    requestAnimationFrame(function () {
      route(true);
    });

    if (isManual) {
      if (fetchedFresh) {
        showToast("✔ Live site data synced from " + fetchedSource);
      } else {
        showToast("⚠️ Could not reach server; keeping local changes.");
      }
    }
  }

  // 6b. Granular Access Level & Permission Validator
  function checkDevPermission(session, section, action) {
    if (!session) return { allowed: false, autoPush: false, reason: "No active developer session" };
    if (session.role === "admin") return { allowed: true, autoPush: true, reason: "Admin master access" };

    var s = String(section || "").toLowerCase().trim();
    var a = String(action || "add").toLowerCase().trim();
    if (s === "update" || s === "news") s = "updates";
    if (s === "rom") s = "roms";
    if (s === "guide") s = "guides";
    if (s === "module") s = "modules";
    if (s === "kernel") s = "kernels";
    if (s === "screenshot") s = "screenshots";

    // 1. Check allowed sections
    var allowedSecs = session.allowedSections || ["*"];
    if (!allowedSecs.includes("*") && !allowedSecs.includes("all") && !allowedSecs.includes(s)) {
      return { allowed: false, autoPush: false, reason: "Your developer key is restricted from section: " + s };
    }

    // 2. Check allowed actions
    var allowedActs = session.allowedActions || ["add", "edit", "delete"];
    if (!allowedActs.includes("*") && !allowedActs.includes("all") && !allowedActs.includes(a)) {
      return { allowed: false, autoPush: false, reason: "Your developer key is restricted from action: " + a };
    }

    // 3. Check Auto-Push vs PC Verification
    if (session.requiresVerification) {
      return { allowed: true, autoPush: false, reason: "Requires PC verification from Softbrick" };
    }

    if (!session.canAutoPush) {
      return { allowed: true, autoPush: false, reason: "Auto-push disabled (requires PC verification)" };
    }

    var autoSecs = session.autoPushSections || ["*"];
    if (autoSecs.includes("*") || autoSecs.includes("all") || autoSecs.includes(s)) {
      return { allowed: true, autoPush: true, reason: "Auto-push authorized" };
    }

    return { allowed: true, autoPush: false, reason: "Section " + s + " requires PC verification" };
  }

  // 7. Deletion Handlers (<16ms Optimistic UI)
  function handleDeleteItem(tab, categoryTitle, item) {
    var perm = checkDevPermission(currentUser, tab, "delete");
    if (!perm.allowed) {
      showToast("⚠️ " + perm.reason);
      return;
    }
    var label = item.name || item.title || "item";
    if (!confirm('Are you sure you want to delete "' + label + '"?')) {
      return;
    }

    if (tab === "updates") {
      if (Array.isArray(window.SITE.updates)) {
        window.SITE.updates = window.SITE.updates.filter(function (u) {
          return u.id !== item.id && u.title !== item.title;
        });
      }
    } else if (tab === "guides") {
      if (Array.isArray(window.SITE.guides)) {
        window.SITE.guides = window.SITE.guides.filter(function (g) {
          return g.slug !== item.slug && g.title !== item.title;
        });
      } else if (window.SITE.guides && Array.isArray(window.SITE.guides.items)) {
        window.SITE.guides.items = window.SITE.guides.items.filter(function (g) {
          return g.slug !== item.slug && g.title !== item.title;
        });
      }
    } else if (Array.isArray(window.SITE[tab])) {
      window.SITE[tab].forEach(function (grp) {
        if (grp.feature && (grp.feature.name === item.name || grp.feature.slug === item.slug)) {
          delete grp.feature;
        }
        if (Array.isArray(grp.items)) {
          grp.items = grp.items.filter(function (it) {
            return it.name !== item.name;
          });
        }
      });
    }

    saveOptimisticSite();
    route(true);
    showToast('✔ "' + label + '" deleted.');

    var payload = {
      id: "sub-" + Date.now(),
      action: "delete",
      key: currentKey,
      deviceId: getDeviceId(),
      submitterRole: currentUser ? currentUser.role : "team",
      submitterName: currentUser ? currentUser.name : "Developer",
      canAutoPush: true,
      type: tab,
      section: tab,
      targetCategory: categoryTitle,
      targetName: label,
      targetId: item.id || item.slug || label,
      title: "[Delete] " + label,
      data: { name: label, id: item.id || item.slug || "" }
    };
    recordPendingMutation({
      id: payload.id,
      action: "delete",
      type: tab,
      section: tab,
      targetCategory: categoryTitle,
      targetName: label,
      targetId: item.id || item.slug || label,
      ts: Date.now()
    });
    dispatchSubmission(payload).catch(function (e) {
      console.warn("Delete dispatch failed:", e);
    });
  }

  function handleDeleteScreenshot(rom, idx) {
    var perm = checkDevPermission(currentUser, "screenshots", "delete");
    if (!perm.allowed) {
      showToast("⚠️ " + perm.reason);
      return;
    }
    if (!confirm("Delete this screenshot?")) return;
    var removed = null;
    if (Array.isArray(rom.screenshots)) {
      removed = rom.screenshots.splice(idx, 1)[0];
    }
    saveOptimisticSite();
    route(true);
    if (perm.autoPush) {
      showToast("✔ Screenshot deleted. (Live Auto-Push)");
    } else {
      showToast("✔ Screenshot deletion queued for PC verification.");
    }

    var payload = {
      id: "sub-" + Date.now(),
      action: "delete_screenshot",
      key: currentKey,
      deviceId: getDeviceId(),
      submitterRole: currentUser ? currentUser.role : "team",
      submitterName: currentUser ? currentUser.name : "Developer",
      canAutoPush: perm.autoPush,
      type: "screenshots",
      section: "screenshots",
      romId: rom.romId || slugify(rom.name),
      targetName: rom.name,
      title: "[Delete Screenshot] " + rom.name + " (" + (idx + 1) + ")",
      data: {
        romName: rom.name,
        romId: rom.romId || slugify(rom.name),
        index: idx,
        url: removed ? removed.url : ""
      }
    };
    recordPendingMutation({
      id: payload.id,
      action: "delete_screenshot",
      type: "screenshots",
      section: "screenshots",
      romId: rom.romId || slugify(rom.name),
      url: removed ? removed.url : "",
      ts: Date.now()
    });
    dispatchSubmission(payload).catch(function (e) {
      console.warn("Screenshot delete dispatch failed:", e);
    });
  }

  // 8. Popover & Live Team Roster
  async function loadTeamRoster() {
    var manifest = await fetchOnlineAuthManifest();
    var rosterList = document.getElementById("popover-roster-list");
    if (!rosterList) return;
    rosterList.innerHTML = "";
    if (!manifest || !manifest.keys) {
      rosterList.appendChild(el("div", "empty", "Roster offline."));
      return;
    }
    Object.keys(manifest.keys).forEach(function (slotId) {
      var k = manifest.keys[slotId];
      var item = el("div", "roster-item");
      var img = el("img", "roster-avatar");
      var photoSrc = k.photo || "icons/icon-192.png";
      img.src = resolveAssetUrl(photoSrc);
      attachImgFallback(img, photoSrc);
      img.alt = k.name || slotId;
      item.appendChild(img);

      var info = el("div", "roster-info");
      var name = el("div", "roster-name", k.name || slotId);
      var roleText = (k.role || "team").toUpperCase();
      if (k.revoked) {
        roleText += " · REVOKED";
      } else if (k.role === "admin") {
        roleText += " · MASTER";
      } else if (k.requires_verification || !k.can_auto_push) {
        roleText += " · PC REVIEW";
      } else if (Array.isArray(k.auto_push_sections) && k.auto_push_sections.length && !k.auto_push_sections.includes("*")) {
        roleText += " · " + k.auto_push_sections.join(",").toUpperCase();
      } else {
        roleText += " · AUTO";
      }
      var role = el("div", "roster-role", roleText);
      info.appendChild(name);
      info.appendChild(role);
      item.appendChild(info);

      var dot = el("div", "roster-dot" + (k.revoked ? " revoked" : (k.bound_device_id ? " active" : "")));
      dot.title = k.revoked ? "Revoked" : (k.bound_device_id ? "Active on device" : "Available");
      item.appendChild(dot);

      rosterList.appendChild(item);
    });
  }

  function initDevPopover() {
    var pfpBtn = document.getElementById("dev-pfp-btn");
    var popover = document.getElementById("dev-pfp-popover");
    var changeAvatarInput = document.getElementById("change-avatar-input");
    var syncBtn = document.getElementById("popover-sync-btn");
    var handleBtn = document.getElementById("popover-handle-btn");
    var logoutBtn = document.getElementById("popover-logout-btn");

    if (pfpBtn && popover) {
      pfpBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var isHidden = popover.hasAttribute("hidden");
        if (isHidden) {
          popover.removeAttribute("hidden");
          loadTeamRoster();
        } else {
          popover.setAttribute("hidden", "");
        }
      });

      document.addEventListener("click", function (e) {
        if (!popover.hasAttribute("hidden") && !popover.contains(e.target) && !pfpBtn.contains(e.target)) {
          popover.setAttribute("hidden", "");
        }
      });
    }

    if (changeAvatarInput) {
      changeAvatarInput.addEventListener("change", function (e) {
        if (e.target.files && e.target.files[0] && currentUser) {
          compressAvatarFile(e.target.files[0]).then(function (b64) {
            currentUser.photo = b64;
            savePersistentSession(currentUser);
            var pfpImg = document.getElementById("dev-pfp-img");
            var popAvatarImg = document.getElementById("popover-avatar-img");
            if (pfpImg) pfpImg.src = b64;
            if (popAvatarImg) popAvatarImg.src = b64;
            showToast("✔ Profile photo updated!");
          });
        }
      });
    }

    if (syncBtn) {
      syncBtn.addEventListener("click", function () {
        fetchLiveSiteData(true);
      });
    }

    if (handleBtn) {
      handleBtn.addEventListener("click", function () {
        if (!currentUser) return;
        var newHandle = prompt("Enter new developer handle:", currentUser.name);
        if (newHandle && newHandle.trim()) {
          currentUser.name = newHandle.trim();
          savePersistentSession(currentUser);
          var pfpHandle = document.getElementById("dev-pfp-handle");
          if (pfpHandle) pfpHandle.textContent = currentUser.name;
          showToast("✔ Handle changed to @" + currentUser.name);
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        if (confirm("Lock Developer Hub and log out?")) {
          clearPersistentSession();
          if (popover) popover.setAttribute("hidden", "");
          var gateScreen = document.getElementById("gatekeeper-screen");
          if (gateScreen) gateScreen.classList.add("active");
          showToast("Hub locked.");
        }
      });
    }
  }

  // 9. Gatekeeper Overlay & Profile Setup
  function initGatekeeper() {
    var gateScreen = document.getElementById("gatekeeper-screen");
    var setupScreen = document.getElementById("profile-setup-screen");
    var keyForm = document.getElementById("key-form");
    var keyInput = document.getElementById("dev-key-input");
    var keyError = document.getElementById("key-error");
    var toggleKeyBtn = document.getElementById("toggle-key-visibility");
    var profileForm = document.getElementById("profile-setup-form");
    var setupNameInput = document.getElementById("setup-name-input");
    var setupError = document.getElementById("setup-error");
    var setupPhotoInput = document.getElementById("setup-photo-input");
    var setupChooseBtn = document.getElementById("setup-choose-photo-btn");
    var setupAvatarTrigger = document.getElementById("setup-avatar-trigger");
    var setupAvatarPreview = document.getElementById("setup-avatar-preview");

    if (toggleKeyBtn && keyInput) {
      toggleKeyBtn.addEventListener("click", function () {
        keyInput.type = keyInput.type === "password" ? "text" : "password";
      });
    }

    var pendingVerifiedKey = null;
    var selectedAvatarBase64 = null;

    if (setupChooseBtn && setupPhotoInput) {
      setupChooseBtn.addEventListener("click", function () { setupPhotoInput.click(); });
    }
    if (setupAvatarTrigger && setupPhotoInput) {
      setupAvatarTrigger.addEventListener("click", function () { setupPhotoInput.click(); });
    }
    if (setupPhotoInput) {
      setupPhotoInput.addEventListener("change", function (e) {
        if (e.target.files && e.target.files[0]) {
          compressAvatarFile(e.target.files[0]).then(function (b64) {
            selectedAvatarBase64 = b64;
            if (setupAvatarPreview) setupAvatarPreview.src = b64;
          }).catch(function (err) {
            console.warn("Avatar compress error:", err);
          });
        }
      });
    }

    function unlockWithSession(session) {
      currentKey = session.key;
      currentUser = session;
      if (gateScreen) gateScreen.classList.remove("active");
      if (setupScreen) setupScreen.classList.remove("active");

      var pfpImg = document.getElementById("dev-pfp-img");
      var popAvatarImg = document.getElementById("popover-avatar-img");
      var pfpHandle = document.getElementById("dev-pfp-handle");
      var pfpRole = document.getElementById("dev-pfp-role");

      var photoUrl = session.photo || "icons/icon-192.png";
      if (pfpImg) {
        pfpImg.src = resolveAssetUrl(photoUrl);
        attachImgFallback(pfpImg, photoUrl);
      }
      if (popAvatarImg) {
        popAvatarImg.src = resolveAssetUrl(photoUrl);
        attachImgFallback(popAvatarImg, photoUrl);
      }
      if (pfpHandle) pfpHandle.textContent = session.name || "Developer";
      if (pfpRole) {
        if (session.role === "admin") {
          pfpRole.textContent = "ADMIN · MASTER";
        } else if (session.requiresVerification || !session.canAutoPush) {
          pfpRole.textContent = "TEAM · PC REVIEW";
        } else if (Array.isArray(session.autoPushSections) && session.autoPushSections.length && !session.autoPushSections.includes("*")) {
          pfpRole.textContent = "TEAM · " + session.autoPushSections.join(",").toUpperCase();
        } else {
          pfpRole.textContent = "TEAM · AUTO-PUSH";
        }
      }

      startPresenceHeartbeat();
      loadTeamRoster();
      fetchLiveSiteData();
    }

    var saved = getPersistentSession();
    if (saved && saved.key && saved.name) {
      unlockWithSession(saved);
    } else {
      if (gateScreen) gateScreen.classList.add("active");
    }

    if (keyForm) {
      keyForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        var raw = keyInput ? keyInput.value : "";
        if (keyError) keyError.textContent = "";
        var unlockBtn = document.getElementById("unlock-btn");
        if (unlockBtn) unlockBtn.disabled = true;

        var res = await verifyKeyOnline(raw);
        if (unlockBtn) unlockBtn.disabled = false;

        if (!res.ok) {
          if (keyError) keyError.textContent = res.error || "Key validation failed.";
          return;
        }

        pendingVerifiedKey = res;
        if (res.bound_user_name) {
          var s = {
            key: res.keyString,
            slot: res.slot,
            name: res.bound_user_name,
            role: res.role,
            canAutoPush: res.canAutoPush,
            requiresVerification: res.requiresVerification,
            autoPushSections: res.autoPushSections,
            allowedSections: res.allowedSections,
            allowedActions: res.allowedActions,
            description: res.description,
            photo: "icons/icon-192.png",
            deviceId: getDeviceId(),
            activatedAt: Date.now()
          };
          savePersistentSession(s);
          unlockWithSession(s);
          showToast("✔ Welcome back, " + s.name + "!");
        } else {
          if (gateScreen) gateScreen.classList.remove("active");
          if (setupScreen) setupScreen.classList.add("active");
          if (setupNameInput) setupNameInput.value = res.name || "";
        }
      });
    }

    if (profileForm) {
      profileForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var nameVal = setupNameInput ? setupNameInput.value.trim() : "";
        if (!nameVal) {
          if (setupError) setupError.textContent = "Please enter your developer handle.";
          return;
        }
        var s = {
          key: pendingVerifiedKey.keyString,
          slot: pendingVerifiedKey.slot,
          name: nameVal,
          role: pendingVerifiedKey.role,
          canAutoPush: pendingVerifiedKey.canAutoPush,
          requiresVerification: pendingVerifiedKey.requiresVerification,
          autoPushSections: pendingVerifiedKey.autoPushSections,
          allowedSections: pendingVerifiedKey.allowedSections,
          allowedActions: pendingVerifiedKey.allowedActions,
          description: pendingVerifiedKey.description,
          photo: selectedAvatarBase64 || "icons/icon-192.png",
          deviceId: getDeviceId(),
          activatedAt: Date.now()
        };
        savePersistentSession(s);
        dispatchDeviceClaim(s);
        unlockWithSession(s);
        showToast("✔ Profile saved! Welcome to NewbiesDev Hub.");
      });
    }
  }

  // 10. Context-Aware Publish Modal Engine
  function renderBatchScreenshotsPreview() {
    var list = document.getElementById("ss-batch-preview-list");
    if (!list) return;
    list.innerHTML = "";
    batchScreenshots.forEach(function (item, idx) {
      var row = el("div", "ss-preview-item");
      row.style.cssText = "display:flex; align-items:center; gap:8px; padding:6px; background:var(--panel); border-radius:8px; border:1px solid var(--line);";

      var img = el("img");
      img.src = item.dataUrl;
      img.style.cssText = "width:42px; height:60px; object-fit:cover; border-radius:4px;";
      row.appendChild(img);

      var capIn = el("input");
      capIn.type = "text";
      capIn.placeholder = "Caption (optional)...";
      capIn.value = item.caption || "";
      capIn.style.cssText = "flex:1; padding:6px 10px; font-size:0.82rem; border-radius:6px; border:1px solid var(--line); background:var(--bg); color:var(--fg);";
      capIn.addEventListener("input", function () {
        item.caption = capIn.value;
      });
      row.appendChild(capIn);

      var rmBtn = el("button", "", "✕");
      rmBtn.type = "button";
      rmBtn.style.cssText = "background:none; border:none; color:#ff6b6b; font-size:16px; cursor:pointer; padding:4px 8px;";
      rmBtn.addEventListener("click", function () {
        batchScreenshots.splice(idx, 1);
        renderBatchScreenshotsPreview();
      });
      row.appendChild(rmBtn);

      list.appendChild(row);
    });
  }

  function openPublishModal(tab, categoryTitle, itemToEdit, isEdit) {
    var modal = document.getElementById("publish-modal");
    var titleEl = document.getElementById("publish-modal-title");
    var submitTextEl = document.getElementById("publish-submit-text");
    var actionIn = document.getElementById("form-action");
    var tabIn = document.getElementById("form-tab");
    var catIn = document.getElementById("form-category");
    var editIdIn = document.getElementById("form-edit-id");
    var origNameIn = document.getElementById("form-orig-name");
    var nameIn = document.getElementById("form-name");
    var byIn = document.getElementById("form-by");
    var dateIn = document.getElementById("form-date");
    var urlIn = document.getElementById("form-url");
    var sizeIn = document.getElementById("form-size");
    var noteIn = document.getElementById("form-note");
    var baseIn = document.getElementById("form-base");
    var changelogsIn = document.getElementById("form-changelogs");
    var fixedIn = document.getElementById("form-fixed");
    var bugsIn = document.getElementById("form-bugs");
    var guideSlugIn = document.getElementById("form-guide-slug");
    var updateTagIn = document.getElementById("form-update-tag");
    var updateBodyIn = document.getElementById("form-update-body");
    var updateUrlIn = document.getElementById("form-update-url");
    var updateLinkLabelIn = document.getElementById("form-update-link-label");
    var guideReadIn = document.getElementById("form-guide-read");
    var guideIntroIn = document.getElementById("form-guide-intro");
    var guideWarningIn = document.getElementById("form-guide-warning");
    var guideStepsIn = document.getElementById("form-guide-steps");
    var autoAnnounceCheck = document.getElementById("auto-announce-check");
    var formError = document.getElementById("form-error");

    var groupTitleRow = document.getElementById("group-title-row");
    var rowMeta = document.getElementById("row-meta");
    var rowUrls = document.getElementById("row-urls");
    var fieldNoteWrap = document.getElementById("field-note-wrap");
    var romExtra = document.getElementById("rom-extra-fields");
    var bannerWrap = document.getElementById("field-banner-wrap");
    var ssExtra = document.getElementById("screenshot-extra-fields");
    var updateExtra = document.getElementById("update-extra-fields");
    var guideExtra = document.getElementById("guide-extra-fields");
    var autoAnnounceWrap = document.getElementById("auto-announce-wrapper");
    var bannerPreview = document.getElementById("image-compression-preview");

    compressedBannerBase64 = null;
    batchScreenshots = [];
    if (bannerPreview) bannerPreview.textContent = "";
    if (formError) formError.textContent = "";

    actionIn.value = isEdit ? "edit" : "add";
    tabIn.value = tab || "roms";
    if (isEdit && itemToEdit && (!categoryTitle || categoryTitle === "")) {
      categoryTitle = itemToEdit.category || resolveItemCategory(tab, itemToEdit);
    }
    catIn.value = categoryTitle || "";
    editIdIn.value = isEdit && itemToEdit ? (itemToEdit.id || itemToEdit.romId || itemToEdit.slug || itemToEdit.name || "") : "";
    origNameIn.value = isEdit && itemToEdit ? (itemToEdit.name || itemToEdit.title || "") : "";

    titleEl.textContent = isEdit ? ("Edit " + (itemToEdit.name || itemToEdit.title || "Item")) : ("Add to " + (categoryTitle || tab));
    submitTextEl.textContent = isEdit ? "Save Changes" : "Publish to Live Hub";

    byIn.value = (isEdit && itemToEdit && (itemToEdit.by || itemToEdit.author)) ? (itemToEdit.by || itemToEdit.author) : (currentUser ? currentUser.name : "");
    dateIn.value = (isEdit && itemToEdit && itemToEdit.date) ? itemToEdit.date : new Date().toISOString().split("T")[0];
    nameIn.value = isEdit && itemToEdit ? (itemToEdit.name || itemToEdit.title || "") : "";
    urlIn.value = isEdit && itemToEdit ? (itemToEdit.url || "") : "";
    sizeIn.value = isEdit && itemToEdit ? (itemToEdit.size || "") : "";
    noteIn.value = isEdit && itemToEdit ? (itemToEdit.note || itemToEdit.description || "") : "";

    // Hide all extra sections by default
    groupTitleRow.style.display = "none";
    rowMeta.style.display = "none";
    rowUrls.style.display = "none";
    fieldNoteWrap.style.display = "none";
    romExtra.style.display = "none";
    bannerWrap.style.display = "none";
    ssExtra.style.display = "none";
    updateExtra.style.display = "none";
    guideExtra.style.display = "none";
    autoAnnounceWrap.style.display = "none";

    if (tab === "roms") {
      groupTitleRow.style.display = "";
      rowMeta.style.display = "";
      rowUrls.style.display = "";
      fieldNoteWrap.style.display = "";
      romExtra.style.display = "flex";
      bannerWrap.style.display = "";
      autoAnnounceWrap.style.display = isEdit ? "none" : "";

      if (isEdit && itemToEdit.details) {
        baseIn.value = itemToEdit.details.base || "";
        changelogsIn.value = (itemToEdit.details.changelogs || []).join("\n");
        fixedIn.value = (itemToEdit.details.fixed || []).join("\n");
        bugsIn.value = (itemToEdit.details.bugs || []).join("\n");
      } else {
        baseIn.value = "";
        changelogsIn.value = "";
        fixedIn.value = "";
        bugsIn.value = "";
      }
      guideSlugIn.value = (isEdit && itemToEdit.guide) ? itemToEdit.guide : "";
    } else if (tab === "modules" || tab === "kernels" || tab === "recovery") {
      groupTitleRow.style.display = "";
      rowMeta.style.display = "";
      rowUrls.style.display = "";
      fieldNoteWrap.style.display = "";
      autoAnnounceWrap.style.display = isEdit ? "none" : "";
    } else if (tab === "screenshots") {
      ssExtra.style.display = "flex";
      var ssSelect = document.getElementById("form-ss-rom-select");
      ssSelect.innerHTML = "";
      var allRoms = [];
      (S.roms || []).forEach(function (cat) {
        if (cat.feature) allRoms.push(cat.feature);
        (cat.items || []).forEach(function (it) { allRoms.push(it); });
      });
      allRoms.forEach(function (r) {
        var opt = document.createElement("option");
        opt.value = r.romId || slugify(r.name);
        opt.textContent = r.name;
        if (itemToEdit && (itemToEdit.romId === opt.value || itemToEdit.romName === r.name)) {
          opt.selected = true;
        }
        ssSelect.appendChild(opt);
      });
      renderBatchScreenshotsPreview();
    } else if (tab === "updates") {
      groupTitleRow.style.display = "";
      rowMeta.style.display = "";
      updateExtra.style.display = "flex";
      updateTagIn.value = (isEdit && itemToEdit.tag) ? itemToEdit.tag : "Update";
      updateBodyIn.value = (isEdit && itemToEdit.body) ? itemToEdit.body : "";
      updateUrlIn.value = (isEdit && itemToEdit.link) ? itemToEdit.link : "";
      updateLinkLabelIn.value = (isEdit && itemToEdit.linkLabel) ? itemToEdit.linkLabel : "";
    } else if (tab === "guides") {
      groupTitleRow.style.display = "";
      rowMeta.style.display = "";
      guideExtra.style.display = "flex";
      guideReadIn.value = (isEdit && itemToEdit.readTime) ? itemToEdit.readTime : "3 min read";
      guideIntroIn.value = (isEdit && itemToEdit.intro) ? itemToEdit.intro : "";
      guideWarningIn.value = (isEdit && itemToEdit.warning) ? itemToEdit.warning : "";
      guideStepsIn.value = (isEdit && itemToEdit.steps) ? itemToEdit.steps.join("\n") : "";
    }

    modal.classList.add("active");
  }

  function closePublishModal() {
    var modal = document.getElementById("publish-modal");
    if (modal) modal.classList.remove("active");
    compressedBannerBase64 = null;
    batchScreenshots = [];
  }

  function initPublishModal() {
    var modal = document.getElementById("publish-modal");
    var closeBtn = document.getElementById("publish-modal-close");
    var cancelBtn = document.getElementById("publish-cancel-btn");
    var form = document.getElementById("publish-form");
    var bannerInput = document.getElementById("form-image-input");
    var bannerPreview = document.getElementById("image-compression-preview");
    var ssPhotosInput = document.getElementById("form-ss-photos-input");

    if (closeBtn) closeBtn.addEventListener("click", closePublishModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closePublishModal);
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closePublishModal();
      });
    }

    if (bannerInput) {
      bannerInput.addEventListener("change", async function (e) {
        if (e.target.files && e.target.files[0]) {
          var file = e.target.files[0];
          var origKb = Math.round(file.size / 1024);
          try {
            compressedBannerBase64 = await compressImageFile(file, 1280, 1280, 0.88);
            var compKb = Math.round(compressedBannerBase64.length * 0.75 / 1024);
            if (bannerPreview) {
              bannerPreview.textContent = "✔ WebP compressed: " + origKb + " KB → ~" + compKb + " KB";
            }
          } catch (err) {
            console.warn("Banner compress failed:", err);
          }
        }
      });
    }

    if (ssPhotosInput) {
      ssPhotosInput.addEventListener("change", async function (e) {
        var files = Array.from(e.target.files || []).slice(0, 10);
        for (var i = 0; i < files.length; i++) {
          try {
            var b64 = await compressImageFile(files[i], 1440, 2560, 0.88);
            batchScreenshots.push({ dataUrl: b64, caption: "" });
          } catch (err) {
            console.warn("Screenshot compress failed:", err);
          }
        }
        renderBatchScreenshotsPreview();
        ssPhotosInput.value = "";
      });
    }

    if (form) {
      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        var action = document.getElementById("form-action").value;
        var tab = document.getElementById("form-tab").value;
        var cat = document.getElementById("form-category").value;
        var editId = document.getElementById("form-edit-id").value;
        var origName = document.getElementById("form-orig-name").value;
        var name = document.getElementById("form-name").value.trim();
        var by = document.getElementById("form-by").value.trim() || (currentUser ? currentUser.name : "NewbiesTeam");
        var date = document.getElementById("form-date").value.trim() || new Date().toISOString().split("T")[0];
        var url = document.getElementById("form-url").value.trim();
        var size = document.getElementById("form-size").value.trim();
        var note = document.getElementById("form-note").value.trim();
        var autoAnnounceCheck = document.getElementById("auto-announce-check");
        var formError = document.getElementById("form-error");

        if (formError) formError.textContent = "";

        if (tab !== "screenshots" && !name) {
          if (formError) formError.textContent = "Please enter a name or title.";
          return;
        }

        var submissionItem = null;

        if (tab === "screenshots") {
          if (!batchScreenshots.length) {
            if (formError) formError.textContent = "Please select at least one photo to upload.";
            return;
          }
          var ssSelect = document.getElementById("form-ss-rom-select");
          var targetRomId = ssSelect ? ssSelect.value : "";
          var allRoms = [];
          (S.roms || []).forEach(function (c) {
            if (c.feature) allRoms.push(c.feature);
            (c.items || []).forEach(function (it) { allRoms.push(it); });
          });
          var targetRom = allRoms.find(function (r) {
            return (r.romId || slugify(r.name)) === targetRomId || slugify(r.name) === slugify(targetRomId);
          });
          if (!targetRom) {
            if (formError) formError.textContent = "Could not find selected ROM.";
            return;
          }
          if (!Array.isArray(targetRom.screenshots)) targetRom.screenshots = [];
          batchScreenshots.forEach(function (s) {
            targetRom.screenshots.push({ url: s.dataUrl, caption: s.caption || "" });
          });
          submissionItem = {
            romName: targetRom.name,
            romId: targetRom.romId || slugify(targetRom.name),
            screenshots: batchScreenshots.map(function (s) { return { url: s.dataUrl, caption: s.caption || "" }; })
          };
        } else if (tab === "updates") {
          var body = document.getElementById("form-update-body").value.trim();
          if (!body) {
            if (formError) formError.textContent = "Please enter the update or changelog text.";
            return;
          }
          var tag = document.getElementById("form-update-tag").value.trim() || "Update";
          var updUrl = document.getElementById("form-update-url").value.trim() || null;
          var linkLabel = document.getElementById("form-update-link-label").value.trim() || null;

          if (action === "add") {
            submissionItem = {
              id: "upd-" + Date.now(),
              title: name,
              date: date,
              by: by,
              tag: tag,
              body: body,
              link: updUrl,
              linkLabel: linkLabel
            };
            if (!Array.isArray(window.SITE.updates)) window.SITE.updates = [];
            window.SITE.updates.unshift(submissionItem);
          } else {
            var targetUpd = (window.SITE.updates || []).find(function (u) {
              return u.id === editId || u.title === origName;
            });
            if (targetUpd) {
              targetUpd.title = name;
              targetUpd.date = date;
              targetUpd.by = by;
              targetUpd.tag = tag;
              targetUpd.body = body;
              targetUpd.link = updUrl;
              targetUpd.linkLabel = linkLabel;
              submissionItem = targetUpd;
            } else {
              submissionItem = {
                id: editId || ("upd-" + Date.now()),
                title: name,
                date: date,
                by: by,
                tag: tag,
                body: body,
                link: updUrl,
                linkLabel: linkLabel
              };
              if (!Array.isArray(window.SITE.updates)) window.SITE.updates = [];
              window.SITE.updates.unshift(submissionItem);
            }
          }
        } else if (tab === "guides") {
          var guideSteps = document.getElementById("form-guide-steps").value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
          var guideIntro = document.getElementById("form-guide-intro").value.trim();
          var guideWarning = document.getElementById("form-guide-warning").value.trim();
          var guideRead = document.getElementById("form-guide-read").value.trim() || "3 min read";

          if (action === "add") {
            submissionItem = {
              title: name,
              author: by,
              slug: slugify(name),
              category: cat || "Guides",
              readTime: guideRead,
              intro: guideIntro,
              warning: guideWarning,
              steps: guideSteps
            };
            if (!window.SITE.guides) window.SITE.guides = { items: [], categories: ["Guides"] };
            if (Array.isArray(window.SITE.guides)) {
              window.SITE.guides.push(submissionItem);
            } else {
              if (!Array.isArray(window.SITE.guides.items)) window.SITE.guides.items = [];
              window.SITE.guides.items.push(submissionItem);
            }
          } else {
            var gList = Array.isArray(window.SITE.guides) ? window.SITE.guides : ((window.SITE.guides && window.SITE.guides.items) || []);
            var targetGuide = gList.find(function (g) {
              return g.slug === editId || g.title === origName;
            });
            if (targetGuide) {
              targetGuide.title = name;
              targetGuide.author = by;
              targetGuide.readTime = guideRead;
              targetGuide.intro = guideIntro;
              targetGuide.warning = guideWarning;
              targetGuide.steps = guideSteps;
              submissionItem = targetGuide;
            } else {
              submissionItem = {
                title: name,
                author: by,
                slug: editId || slugify(name),
                category: cat || "Guides",
                readTime: guideRead,
                intro: guideIntro,
                warning: guideWarning,
                steps: guideSteps
              };
              if (Array.isArray(window.SITE.guides)) window.SITE.guides.push(submissionItem);
              else {
                if (!window.SITE.guides) window.SITE.guides = { items: [], categories: ["Guides"] };
                if (!Array.isArray(window.SITE.guides.items)) window.SITE.guides.items = [];
                window.SITE.guides.items.push(submissionItem);
              }
            }
          }
        } else {
          // tab is roms, modules, kernels, recovery
          var newItem = {
            name: name,
            by: by,
            date: date,
            url: url,
            size: size || null,
            note: note || null,
            description: note || null
          };
          if (tab === "roms") {
            newItem.isRom = true;
            newItem.romId = editId || slugify(name);
            if (compressedBannerBase64) {
              newItem.image = compressedBannerBase64;
            }
            var changelogs = document.getElementById("form-changelogs").value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
            var fixed = document.getElementById("form-fixed").value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
            var bugs = document.getElementById("form-bugs").value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
            var base = document.getElementById("form-base").value.trim();
            var gSlug = document.getElementById("form-guide-slug").value.trim();
            if (gSlug) newItem.guide = gSlug;
            if (base || changelogs.length || fixed.length || bugs.length) {
              newItem.details = {
                base: base || "GT 20 Pro",
                changelogs: changelogs,
                fixed: fixed,
                bugs: bugs
              };
            }
          }

          var groupList = window.SITE[tab];
          if (!Array.isArray(groupList)) { window.SITE[tab] = []; groupList = window.SITE[tab]; }

          if (action === "add") {
            var grp = groupList.find(function (g) { return g.title === cat; });
            if (!grp) {
              grp = { title: cat || "Latest", items: [] };
              groupList.push(grp);
            }
            if (!Array.isArray(grp.items)) grp.items = [];
            newItem.category = cat;
            grp.items.unshift(newItem);
            submissionItem = newItem;

            // Auto-announcement to Updates tab if checked
            if (autoAnnounceCheck && autoAnnounceCheck.checked) {
              var autoAnnounce = {
                id: "upd-" + Date.now(),
                title: "New Release: " + newItem.name,
                date: newItem.date,
                by: currentUser ? currentUser.name : newItem.by,
                tag: cat || "Release",
                body: (newItem.details && newItem.details.changelogs && newItem.details.changelogs.length)
                  ? newItem.details.changelogs.join("\n")
                  : (newItem.note || (newItem.name + " is now available for download.")),
                link: "#" + tab + "/" + slugify(newItem.name),
                linkLabel: "View in " + (tab.charAt(0).toUpperCase() + tab.slice(1))
              };
              if (!Array.isArray(window.SITE.updates)) window.SITE.updates = [];
              window.SITE.updates.unshift(autoAnnounce);

              var announcePayload = {
                id: "sub-" + Date.now() + "-ann",
                action: "add",
                key: currentKey,
                deviceId: getDeviceId(),
                submitterRole: currentUser ? currentUser.role : "team",
                submitterName: currentUser ? currentUser.name : "Developer",
                canAutoPush: true,
                type: "updates",
                section: "updates",
                targetCategory: "Updates",
                targetName: autoAnnounce.title,
                targetId: autoAnnounce.id,
                title: "[Add] " + autoAnnounce.title,
                data: autoAnnounce
              };
              dispatchSubmission(announcePayload).catch(function (e) {
                console.warn("Relay announce dispatch error:", e);
              });
            }
          } else {
            // Find across ALL groups in window.SITE[tab]
            var targetItem = null;
            var targetGrp = null;
            var isFeat = false;

            for (var gi = 0; gi < groupList.length; gi++) {
              var curG = groupList[gi];
              if (curG.feature && (curG.feature.name === origName || curG.feature.name === name || (editId && (curG.feature.romId === editId || curG.feature.id === editId)))) {
                targetItem = curG.feature;
                targetGrp = curG;
                isFeat = true;
                break;
              }
              if (Array.isArray(curG.items)) {
                var found = curG.items.find(function (it) {
                  return (it.name && it.name === origName) || (it.name && it.name === name) || (editId && (it.id === editId || it.romId === editId || it.slug === editId));
                });
                if (found) {
                  targetItem = found;
                  targetGrp = curG;
                  break;
                }
              }
            }

            if (targetItem) {
              Object.assign(targetItem, newItem);
              if (targetGrp) {
                targetItem.category = targetGrp.title;
                cat = targetGrp.title;
              }
              submissionItem = targetItem;
            } else {
              var grp = groupList.find(function (g) { return g.title === cat; });
              if (!grp) {
                grp = { title: cat || "Latest", items: [] };
                groupList.push(grp);
              }
              if (!Array.isArray(grp.items)) grp.items = [];
              newItem.category = cat;
              grp.items.unshift(newItem);
              submissionItem = newItem;
            }
          }
        }

        var perm = checkDevPermission(currentUser, tab, action);
        if (!perm.allowed) {
          if (formError) formError.textContent = perm.reason;
          return;
        }

        var resolvedTargetName = (action === "edit" ? (origName || name) : name) || (submissionItem && (submissionItem.name || submissionItem.title)) || "Submission";
        var resolvedTargetId = action === "edit" ? (editId || origName || name) : (submissionItem && (submissionItem.id || submissionItem.slug || submissionItem.name || editId));

        var submissionPayload = {
          id: "sub-" + Date.now(),
          action: action,
          key: currentKey,
          deviceId: getDeviceId(),
          submitterRole: currentUser ? currentUser.role : "team",
          submitterName: currentUser ? currentUser.name : "Developer",
          canAutoPush: perm.autoPush,
          type: tab,
          section: tab,
          targetCategory: cat,
          targetName: resolvedTargetName,
          targetId: resolvedTargetId,
          title: (action === "edit" ? "[Edit] " : "[Add] ") + (name || origName || resolvedTargetName),
          data: submissionItem || newItem
        };

        recordPendingMutation({
          id: submissionPayload.id,
          action: action,
          type: tab,
          section: tab,
          targetCategory: cat,
          targetName: resolvedTargetName,
          targetId: resolvedTargetId,
          data: submissionItem || newItem,
          ts: Date.now()
        });

        saveOptimisticSite();
        closePublishModal();
        requestAnimationFrame(function () {
          route(true);
        });

        if (perm.autoPush) {
          showToast("✔ " + (action === "edit" ? "Saved changes!" : "Published successfully!") + " (Live Auto-Push)");
        } else {
          showToast("✔ Submitted to Admin! Awaiting PC verification.");
        }

        dispatchSubmission(submissionPayload).catch(function (err) {
          console.warn("Relay submission dispatch failed:", err);
          showToast("⚠️ Server sync queued or failed: " + err.message);
        });
      });
    }
  }


  window.addEventListener("hashchange", function () {
    route();
  });

  function initInitialView() {
    var initialQ = "";
    try {
      var urlParams = new URLSearchParams(window.location.search);
      initialQ = urlParams.get("q") || urlParams.get("search") || "";
      if (!initialQ && window.location.hash.indexOf("#search") === 0) {
        var parts = window.location.hash.split("=");
        if (parts.length > 1) initialQ = decodeURIComponent(parts.slice(1).join("="));
      }
    } catch (_) {}

    if (initialQ && searchInput) {
      searchInput.value = initialQ;
      runSearch();
    } else {
      route();
    }
  }

  initInitialView();
  initTabReadmeHoldListeners();
  initGatekeeper();
  initDevPopover();
  initPublishModal();
  fetchLiveSiteData();
})();
