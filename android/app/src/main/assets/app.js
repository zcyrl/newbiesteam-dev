/**
 * NewbiesDev Hub — Mobile Developer Client Engine v3 (Material 3 Adaptive)
 * Direct Web Data Sync, Real-Time Content Editing & Deletion,
 * Single-User Device Lock, and Native 120 FPS Performance.
 */

const CONFIG = {
  // Submission relay channel (24/7 autonomous cloud relay with multi-region failover)
  submissionChannel: "nbt_sub_8d0b5336c092d316a726be04",
  relayUrl: "https://ntfy.envs.net/nbt_sub_8d0b5336c092d316a726be04",
  relayFallbackUrl: "https://ntfy.sh/nbt_sub_8d0b5336c092d316a726be04",
  liveFeedUrl: "https://newbiesteam.surge.sh/data.js",

  // 32-character high-entropy developer keys with single-user bindings
  keys: {
    "NBT-ADM-orTWTao8d46rNzvrIBBgOjIS": {
      role: "admin",
      name: "Softbrick (Owner)",
      canAutoPush: true,
      status: "active",
      revoked: false,
      bound_device_id: "a9d9d2e5-b608-4703-8a7e-2b40b39ffc11",
      bound_user_name: "Softbrick",
      bound_photo: null,
      headline: "Master Admin Active",
      description: "Full access enabled. Any ROM, guide, screenshot, or news you upload or edit is auto-pushed live immediately."
    },
    "NBT-DEV1-ZPYYluKXiW1kZxsoOWiFx3I": {
      role: "team",
      name: "Team Member 1",
      canAutoPush: false,
      status: "active",
      revoked: false,
      bound_device_id: null,
      bound_user_name: null,
      bound_photo: null,
      headline: "Team Member 1 Active",
      description: "Updates & News post immediately. ROMs, Guides, and Screenshots are sent to the terminal tool for confirmation."
    },
    "NBT-DEV2-p1CXkO2WfRLCROYFivPN5UH": {
      role: "team",
      name: "Team Member 2",
      canAutoPush: false,
      status: "active",
      revoked: false,
      bound_device_id: null,
      bound_user_name: null,
      bound_photo: null,
      headline: "Team Member 2 Active",
      description: "Updates & News post immediately. ROMs, Guides, and Screenshots are sent to the terminal tool for confirmation."
    },
    "NBT-DEV3-nbqMbAwxXaHuObtNzPr2d6B": {
      role: "team",
      name: "Team Member 3",
      canAutoPush: false,
      status: "active",
      revoked: false,
      bound_device_id: null,
      bound_user_name: null,
      bound_photo: null,
      headline: "Team Member 3 Active",
      description: "Updates & News post immediately. ROMs, Guides, and Screenshots are sent to the terminal tool for confirmation."
    },
    "NBT-DEV4-ptRLMWQkMiQSQrouMT9ZB06": {
      role: "team",
      name: "Team Member 4",
      canAutoPush: false,
      status: "revoked",
      revoked: true,
      bound_device_id: null,
      bound_user_name: null,
      bound_photo: null,
      headline: "Key Revoked",
      description: "This key has been revoked by Softbrick."
    },
  }
};

// Global State
let currentKey = null;
let currentUser = null;
let pendingKeyObj = null;
let activeCategory = "rom";
let activeLiveCat = "roms";
let currentTheme = "auto";
let selectedAvatarBase64 = null;
let selectedScreenshots = []; // Array of up to 10 { id, base64, caption, width, height, sizeStr }
let compressedImages = {
  rom: null,
  screenshots: null,
  news: null
};

// ----------------------------------------------------
// 1. Device UUID Generation & Single-User Persistence
// ----------------------------------------------------
function getDeviceId() {
  if (window.AndroidBridge && typeof window.AndroidBridge.getDeviceId === "function") {
    try {
      const bridgeId = window.AndroidBridge.getDeviceId();
      if (bridgeId) return String(bridgeId);
    } catch (_) {}
  }
  let localId = null;
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
  const jsonStr = JSON.stringify(sessionData);
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
      const raw = window.AndroidBridge.getDevState();
      if (raw && typeof raw === "string" && raw.trim().startsWith("{")) {
        return JSON.parse(raw);
      }
    } catch (_) {}
  }
  try {
    const raw = localStorage.getItem("nbt_dev_saved_session");
    if (raw && typeof raw === "string" && raw.trim().startsWith("{")) {
      return JSON.parse(raw);
    }
  } catch (_) {}
  return null;
}

function cleanKeyString(raw) {
  if (!raw) return "";
  return String(raw)
    .trim()
    .replace(/^["']+|["']+$/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, "");
}

function findKey(entered) {
  const clean = cleanKeyString(entered);
  if (!clean) return null;

  if (CONFIG.keys[clean]) {
    return { keyString: clean, ...CONFIG.keys[clean] };
  }

  const lowerClean = clean.toLowerCase();
  for (const [k, v] of Object.entries(CONFIG.keys)) {
    if (k.toLowerCase() === lowerClean) {
      return { keyString: k, ...v };
    }
  }
  return null;
}

// ----------------------------------------------------
// 2. Material 3 Adaptive Theme System
// ----------------------------------------------------
function initTheme() {
  try {
    const saved = localStorage.getItem("nbt_dev_theme") || "auto";
    setTheme(saved);
  } catch (_) {
    setTheme("auto");
  }

  // Listen to OS changes when in Auto mode
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (currentTheme === "auto") {
        applyThemeDOM("auto");
      }
    });
  }
}

function setTheme(theme) {
  currentTheme = theme;
  try {
    localStorage.setItem("nbt_dev_theme", theme);
  } catch (_) {}
  applyThemeDOM(theme);
}

function applyThemeDOM(theme) {
  const root = document.documentElement;
  const iconSpan = document.getElementById("theme-btn-icon");
  const labelSpan = document.getElementById("theme-btn-label");

  if (theme === "auto") {
    root.removeAttribute("data-theme");
    if (iconSpan) iconSpan.textContent = "🌓";
    if (labelSpan) labelSpan.textContent = "Auto";
  } else if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
    if (iconSpan) iconSpan.textContent = "🌙";
    if (labelSpan) labelSpan.textContent = "Dark";
  } else if (theme === "light") {
    root.setAttribute("data-theme", "light");
    if (iconSpan) iconSpan.textContent = "☀️";
    if (labelSpan) labelSpan.textContent = "Light";
  }
}

function toggleTheme() {
  if (currentTheme === "auto") {
    setTheme("dark");
  } else if (currentTheme === "dark") {
    setTheme("light");
  } else {
    setTheme("auto");
  }
  showToast(`Theme: ${currentTheme.toUpperCase()}`);
}

// ----------------------------------------------------
// 3. DOM Elements Cache
// ----------------------------------------------------
let gatekeeperScreen;
let profileSetupScreen;
let dashboardScreen;
let keyForm;
let devKeyInput;
let keyError;
let toggleKeyBtn;
let unlockBtn;

let profileSetupForm;
let setupAvatarTrigger;
let setupAvatarPreview;
let setupPhotoInput;
let setupChoosePhotoBtn;
let setupNameInput;
let setupError;
let setupSubmitBtn;

let barUserName;
let devProfilePill;
let pillAvatarImg;
let pillDevName;
let themeToggleBtn;

let syncBanner;
let syncDot;
let syncStatusText;
let syncRefreshBtn;

let rosterModal;
let closeRosterBtn;
let myProfileAvatar;
let myProfileName;
let myProfileRole;
let rosterListContainer;

let statusCard;
let statusHeadline;
let statusDescription;

let fabPlus;
let uploadModal;
let modalCloseBtn;
let modalTitle;
let modalSubtitle;
let catTabs;
let actionCards;

let submissionForm;
let formActionInput;
let editSectionInput;
let editTargetNameInput;
let editTargetCategoryInput;
let editTargetIdInput;
let submitBtn;
let submitBtnText;
let submitSpinner;
let toast;
let historyContainer;

let liveCategoryChips;
let liveItemsContainer;

let alertModal;
let alertTitle;
let alertMessage;
let alertDismissBtn;

function cacheDOMElements() {
  gatekeeperScreen = document.getElementById("gatekeeper-screen");
  profileSetupScreen = document.getElementById("profile-setup-screen");
  dashboardScreen = document.getElementById("dashboard-screen");

  keyForm = document.getElementById("key-form");
  devKeyInput = document.getElementById("dev-key-input");
  keyError = document.getElementById("key-error");
  toggleKeyBtn = document.getElementById("toggle-key-visibility");
  unlockBtn = document.getElementById("unlock-btn");

  profileSetupForm = document.getElementById("profile-setup-form");
  setupAvatarTrigger = document.getElementById("setup-avatar-trigger");
  setupAvatarPreview = document.getElementById("setup-avatar-preview");
  setupPhotoInput = document.getElementById("setup-photo-input");
  setupChoosePhotoBtn = document.getElementById("setup-choose-photo-btn");
  setupNameInput = document.getElementById("setup-name-input");
  setupError = document.getElementById("setup-error");
  setupSubmitBtn = document.getElementById("setup-submit-btn");

  barUserName = document.getElementById("bar-user-name");
  devProfilePill = document.getElementById("dev-profile-pill");
  pillAvatarImg = document.getElementById("pill-avatar-img");
  pillDevName = document.getElementById("pill-dev-name");
  themeToggleBtn = document.getElementById("theme-toggle-btn");

  syncBanner = document.getElementById("sync-banner");
  syncDot = document.getElementById("sync-dot");
  syncStatusText = document.getElementById("sync-status-text");
  syncRefreshBtn = document.getElementById("sync-refresh-btn");

  rosterModal = document.getElementById("roster-modal");
  closeRosterBtn = document.getElementById("close-roster-btn");
  myProfileAvatar = document.getElementById("my-profile-avatar");
  myProfileName = document.getElementById("my-profile-name");
  myProfileRole = document.getElementById("my-profile-role");
  rosterListContainer = document.getElementById("roster-list-container");

  statusCard = document.getElementById("status-card");
  statusHeadline = document.getElementById("status-headline");
  statusDescription = document.getElementById("status-description");

  fabPlus = document.getElementById("fab-plus");
  uploadModal = document.getElementById("upload-modal");
  modalCloseBtn = document.getElementById("modal-close-btn");
  modalTitle = document.getElementById("modal-title");
  modalSubtitle = document.getElementById("modal-subtitle");
  catTabs = document.querySelectorAll(".cat-tab");
  actionCards = document.querySelectorAll(".action-card");

  submissionForm = document.getElementById("submission-form");
  formActionInput = document.getElementById("form-action");
  editSectionInput = document.getElementById("edit-section");
  editTargetNameInput = document.getElementById("edit-target-name");
  editTargetCategoryInput = document.getElementById("edit-target-category");
  editTargetIdInput = document.getElementById("edit-target-id");
  submitBtn = document.getElementById("submit-btn");
  submitBtnText = document.getElementById("submit-btn-text");
  submitSpinner = document.getElementById("submit-spinner");
  toast = document.getElementById("toast");
  historyContainer = document.getElementById("history-container");

  liveCategoryChips = document.getElementById("live-category-chips");
  liveItemsContainer = document.getElementById("live-items-container");

  alertModal = document.getElementById("alert-modal");
  alertTitle = document.getElementById("alert-title");
  alertMessage = document.getElementById("alert-message");
  alertDismissBtn = document.getElementById("alert-dismiss-btn");
}

// ----------------------------------------------------
// 4. App Initialization
// ----------------------------------------------------
function initApp() {
  cacheDOMElements();
  initTheme();
  setupEventListeners();
  checkPersistentSession();
  renderHistory();
  fetchLiveSiteData();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// Popup Alert Modal for Duplicate Single-User Rejection
function showAlertModal(title, message) {
  if (alertTitle) alertTitle.textContent = title || "Access Restricted";
  if (alertMessage) alertMessage.textContent = message || "This key is used by another member.";
  if (alertModal) {
    alertModal.classList.add("active");
    alertModal.classList.add("open");
  }
}

function closeAlertModal() {
  if (alertModal) {
    alertModal.classList.remove("active");
    alertModal.classList.remove("open");
  }
}

function checkPersistentSession() {
  const saved = getPersistentSession();
  const currentDevId = getDeviceId();

  if (saved && saved.key) {
    const keyObj = findKey(saved.key);
    if (keyObj) {
      if (keyObj.revoked || keyObj.status === "revoked") {
        showScreen("gatekeeper");
        keyError.textContent = "⛔ ACCESS DENIED: Your key was revoked by Softbrick.";
        return;
      }

      // Check single-user lock
      if (keyObj.bound_device_id && keyObj.bound_device_id !== currentDevId) {
        showScreen("gatekeeper");
        const msg = "This key is used by another member.";
        keyError.textContent = "⛔ " + msg;
        showAlertModal("Access Restricted", msg);
        showToast(msg);
        return;
      }

      // Restore session permanently
      currentKey = keyObj.keyString;
      currentUser = {
        ...keyObj,
        name: saved.name || keyObj.name,
        photo: saved.photo || null,
        deviceId: currentDevId
      };

      applyUserProfileUI();
      showScreen("dashboard");
      return;
    }
  }

  // No saved session -> show gatekeeper
  showScreen("gatekeeper");
}

// ----------------------------------------------------
// 5. Event Listeners Setup
// ----------------------------------------------------
function setupEventListeners() {
  // Theme Toggle Button
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }

  // Live Sync Refresh Button
  if (syncRefreshBtn) {
    syncRefreshBtn.addEventListener("click", async () => {
      syncRefreshBtn.disabled = true;
      syncRefreshBtn.textContent = "⏳ Syncing...";
      await fetchLiveSiteData(true);
      syncRefreshBtn.disabled = false;
      syncRefreshBtn.textContent = "🔄 Sync Surge";
    });
  }

  // Live Category Filter Chips
  if (liveCategoryChips) {
    const chips = liveCategoryChips.querySelectorAll(".m3-chip");
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        activeLiveCat = chip.dataset.liveCat;
        renderLiveItems(activeLiveCat);
      });
    });
  }

  // Alert Modal Dismiss Button
  if (alertDismissBtn) {
    alertDismissBtn.addEventListener("click", closeAlertModal);
  }
  if (alertModal) {
    alertModal.addEventListener("click", (e) => {
      if (e.target === alertModal) closeAlertModal();
    });
  }

  // Password Visibility Toggle
  if (toggleKeyBtn && devKeyInput) {
    toggleKeyBtn.addEventListener("click", () => {
      const isPass = devKeyInput.type === "password";
      devKeyInput.type = isPass ? "text" : "password";
    });
  }

  // Step 1: Key Gatekeeper Form Submit & Button Click
  const handleKeyVerification = () => {
    const rawEntered = devKeyInput ? devKeyInput.value : "";
    const keyObj = findKey(rawEntered);

    if (!keyObj) {
      if (keyError) keyError.textContent = "Invalid 32-character key. Check spelling or contact Softbrick.";
      return;
    }

    if (keyObj.revoked || keyObj.status === "revoked") {
      if (keyError) keyError.textContent = `⛔ ACCESS DENIED: Key for ${keyObj.name} has been REVOKED by Softbrick.`;
      return;
    }

    const currentDevId = getDeviceId();
    // Check Single-User Device Lock
    if (keyObj.bound_device_id && keyObj.bound_device_id !== currentDevId) {
      const msg = "This key is used by another member.";
      if (keyError) keyError.textContent = "⛔ " + msg;
      showAlertModal("Access Restricted", msg);
      showToast(msg);
      return;
    }

    if (keyError) keyError.textContent = "";
    pendingKeyObj = keyObj;

    // Immediately persist developer session so key is never requested again!
    const saved = getPersistentSession();
    const defaultName = keyObj.name.replace(/\s*\(Owner\)/i, "");
    const session = {
      key: keyObj.keyString,
      name: (saved && saved.name) ? saved.name : defaultName,
      photo: (saved && saved.photo) ? saved.photo : null,
      role: keyObj.role,
      canAutoPush: keyObj.canAutoPush,
      deviceId: currentDevId,
      setupDone: true,
      activatedAt: new Date().toISOString()
    };
    savePersistentSession(session);

    // If profile setup was previously completed, enter directly
    if (saved && saved.setupDone) {
      completeLogin(session.name, session.photo);
      return;
    }

    // Step 2: Show Profile Onboarding Screen
    if (setupNameInput) setupNameInput.value = session.name;
    showScreen("profile-setup");
  };

  if (keyForm) {
    keyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleKeyVerification();
    });
  }
  if (unlockBtn) {
    unlockBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleKeyVerification();
    });
  }

  // Avatar Choose Click Handlers
  if (setupAvatarTrigger && setupPhotoInput) {
    setupAvatarTrigger.addEventListener("click", () => setupPhotoInput.click());
  }
  if (setupChoosePhotoBtn && setupPhotoInput) {
    setupChoosePhotoBtn.addEventListener("click", () => setupPhotoInput.click());
  }

  if (setupPhotoInput) {
    setupPhotoInput.addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      try {
        showToast("Processing photo...");
        const compressed = await compressAvatar(file);
        selectedAvatarBase64 = compressed;
        if (setupAvatarPreview) setupAvatarPreview.src = compressed;
        showToast("✔ Profile photo ready");
      } catch (err) {
        showToast("Failed to process photo: " + err.message);
      }
    });
  }

  // Step 3: Complete Profile Setup & Save State Permanently
  const handleProfileSubmit = () => {
    const chosenName = setupNameInput ? setupNameInput.value.trim() : "";
    if (!chosenName) {
      if (setupError) setupError.textContent = "Please enter your developer name.";
      return;
    }
    completeLogin(chosenName, selectedAvatarBase64);
  };

  if (profileSetupForm) {
    profileSetupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleProfileSubmit();
    });
  }
  if (setupSubmitBtn) {
    setupSubmitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleProfileSubmit();
    });
  }

  // Dev Profile Corner Pill Click (Expands Current Devs Roster)
  if (devProfilePill) devProfilePill.addEventListener("click", openRosterModal);
  if (closeRosterBtn) closeRosterBtn.addEventListener("click", closeRosterModal);
  if (rosterModal) {
    rosterModal.addEventListener("click", (e) => {
      if (e.target === rosterModal) closeRosterModal();
    });
  }

  // FAB Plus Button Click
  if (fabPlus) {
    fabPlus.addEventListener("click", () => {
      openAddModal(activeCategory);
    });
  }

  // Action Cards Tap
  if (actionCards) {
    actionCards.forEach((card) => {
      card.addEventListener("click", () => {
        const cat = card.dataset.category;
        if (cat === "site-link") {
          window.open("https://newbiesteam.surge.sh", "_blank");
          return;
        }
        if (cat === "dev-apk") {
          const devChip = document.querySelector('.m3-chip[data-live-cat="dev-apks"]');
          if (devChip) {
            document.querySelectorAll(".m3-chip").forEach((c) => c.classList.remove("active"));
            devChip.classList.add("active");
            activeLiveCat = "dev-apks";
            renderLiveItems(activeLiveCat);
            const liveSec = document.getElementById("live-items-container");
            if (liveSec) liveSec.scrollIntoView({ behavior: "smooth" });
          }
          return;
        }
        openAddModal(cat);
      });
    });
  }

  // Upload Modal Controls
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  if (uploadModal) {
    uploadModal.addEventListener("click", (e) => {
      if (e.target === uploadModal) closeModal();
    });
  }

  // Category Tabs inside Modal
  if (catTabs) {
    catTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        switchCategory(tab.dataset.type);
      });
    });
  }

  // Target ROM select change listener for Screenshots Gallery
  const ssRomSelect = document.getElementById("ss-rom-select");
  if (ssRomSelect) {
    ssRomSelect.addEventListener("change", () => {
      updateScreenshotGalleryForSelectedRom(ssRomSelect.value);
    });
  }

  // Image Upload Triggers
  setupImagePickers();

  // Main Submission Form Submit
  if (submitBtn) {
    submitBtn.addEventListener("click", handleFormSubmit);
  }
  if (submissionForm) {
    submissionForm.addEventListener("submit", handleFormSubmit);
  }
  const modalCancelBtn = document.getElementById("modal-cancel-btn");
  if (modalCancelBtn) {
    modalCancelBtn.addEventListener("click", closeModal);
  }
}

function completeLogin(devName, avatarPhoto) {
  if (!pendingKeyObj) {
    const saved = getPersistentSession();
    if (saved && saved.key) {
      pendingKeyObj = findKey(saved.key);
    }
  }

  if (!pendingKeyObj) {
    showScreen("gatekeeper");
    return;
  }

  const currentDevId = getDeviceId();
  const session = {
    key: pendingKeyObj.keyString,
    name: devName || pendingKeyObj.name,
    photo: avatarPhoto || null,
    role: pendingKeyObj.role,
    canAutoPush: pendingKeyObj.canAutoPush,
    deviceId: currentDevId,
    setupDone: true,
    activatedAt: new Date().toISOString()
  };

  savePersistentSession(session);

  pendingKeyObj.bound_device_id = currentDevId;
  pendingKeyObj.bound_user_name = session.name;
  pendingKeyObj.bound_photo = session.photo;

  currentKey = pendingKeyObj.keyString;
  currentUser = {
    ...pendingKeyObj,
    name: session.name,
    photo: session.photo,
    deviceId: currentDevId
  };

  applyUserProfileUI();
  showScreen("dashboard");
  showToast(`Welcome, ${session.name}!`);

  dispatchDeviceClaim(session).catch(() => {});
}

function applyUserProfileUI() {
  if (!currentUser) return;

  if (barUserName) barUserName.textContent = currentUser.name;
  if (pillDevName) pillDevName.textContent = currentUser.name;

  if (currentUser.photo) {
    if (pillAvatarImg) pillAvatarImg.src = currentUser.photo;
    if (myProfileAvatar) myProfileAvatar.src = currentUser.photo;
  } else {
    if (pillAvatarImg) pillAvatarImg.src = "icons/icon-192.png";
    if (myProfileAvatar) myProfileAvatar.src = "icons/icon-192.png";
  }

  if (statusHeadline) statusHeadline.textContent = currentUser.headline || `${currentUser.name} Active`;
  if (statusDescription) statusDescription.textContent = currentUser.description || "Developer session active.";
  if (statusCard) statusCard.className = `card status-card ${currentUser.role === "admin" ? "" : "status-team"}`;

  if (myProfileName) myProfileName.textContent = currentUser.name;
  if (myProfileRole) {
    myProfileRole.textContent = currentUser.role.toUpperCase();
    myProfileRole.className = `badge-pill ${currentUser.role === "admin" ? "badge-admin" : "badge-team"}`;
  }
}

function showScreen(name) {
  if (gatekeeperScreen) gatekeeperScreen.classList.remove("active");
  if (profileSetupScreen) profileSetupScreen.classList.remove("active");
  if (dashboardScreen) dashboardScreen.classList.remove("active");

  if (name === "gatekeeper" && gatekeeperScreen) {
    gatekeeperScreen.classList.add("active");
  } else if (name === "profile-setup" && profileSetupScreen) {
    profileSetupScreen.classList.add("active");
  } else if (name === "dashboard" && dashboardScreen) {
    dashboardScreen.classList.add("active");
  }
}

// ----------------------------------------------------
// 6. Live Web Data Engine (Direct Fetch & Populate)
// ----------------------------------------------------
async function fetchLiveSiteData(isManual = false) {
  try {
    const res = await fetch(`${CONFIG.liveFeedUrl}?t=${Date.now()}`, { cache: "no-store" });
    if (res.ok) {
      const text = await res.text();
      try {
        const fn = new Function(text);
        fn();
      } catch (parseErr) {
        console.warn("Could not evaluate live surge script:", parseErr);
      }
    }
  } catch (err) {
    console.warn("Network fetch from surge failed, using baseline data.js:", err);
  }

  // Verify SITE exists
  if (!window.SITE) {
    window.SITE = { roms: [], updates: [], guides: [], modules: [], recovery: [], kernels: [] };
  }

  // Update Status Banner
  if (syncDot) syncDot.className = "sync-dot";
  if (syncStatusText) syncStatusText.textContent = `Live Web Linked • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  // Populate dynamic select for Screenshots
  populateRomSelect();

  // Update category chip counts & render current category
  updateCategoryCounts();
  renderLiveItems(activeLiveCat);

  if (isManual) {
    showToast("✔ Live site data synced from newbiesteam.surge.sh");
  }
}

function resolveAssetUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const clean = url.replace(/^\/+/, "");
  return `https://newbiesteam.surge.sh/${clean}`;
}

function populateRomSelect(selectedRomName) {
  const ssRomSelect = document.getElementById("ss-rom-select");
  if (!ssRomSelect || !window.SITE || !window.SITE.roms) return;

  const currentVal = selectedRomName !== undefined ? selectedRomName : ssRomSelect.value;
  let totalCount = 0;
  let html = "";

  (window.SITE.roms || []).forEach((group) => {
    const list = [];
    if (group.feature && group.feature.name) {
      list.push(group.feature);
    }
    if (group.items && Array.isArray(group.items)) {
      group.items.forEach((item) => {
        if (item.name && !list.some((x) => x.name === item.name)) {
          list.push(item);
        }
      });
    }

    if (list.length > 0) {
      totalCount += list.length;
      html += `<optgroup label="${escapeHtml(group.title || "ROMs")}">`;
      list.forEach((r) => {
        const scCount = Array.isArray(r.screenshots) ? r.screenshots.length : 0;
        const isSel = (currentVal === r.name) ? "selected" : "";
        html += `<option value="${escapeHtml(r.name)}" ${isSel}>${escapeHtml(r.name)} (${scCount} 📸)</option>`;
      });
      html += `</optgroup>`;
    }
  });

  ssRomSelect.innerHTML = `<option value="">-- Choose Target ROM (${totalCount} Available) --</option>` + html;

  if (currentVal) {
    ssRomSelect.value = currentVal;
  }

  updateScreenshotGalleryForSelectedRom(ssRomSelect.value);
}

function updateScreenshotGalleryForSelectedRom(romName) {
  const gallerySec = document.getElementById("ss-gallery-section");
  const galleryCount = document.getElementById("ss-gallery-count");
  const galleryList = document.getElementById("ss-gallery-list");
  if (!gallerySec || !galleryList) return;

  if (!romName) {
    gallerySec.classList.add("hidden");
    galleryList.innerHTML = "";
    return;
  }

  const rom = findRomItem(romName);
  const screenshots = (rom && Array.isArray(rom.screenshots)) ? rom.screenshots : [];

  gallerySec.classList.remove("hidden");
  if (galleryCount) {
    galleryCount.textContent = `${screenshots.length} photo${screenshots.length === 1 ? "" : "s"}`;
  }

  if (screenshots.length === 0) {
    galleryList.innerHTML = `<div class="ss-gallery-empty">No screenshots linked to <strong>${escapeHtml(romName)}</strong> yet.<br><small>Pick an image below to upload the first screenshot!</small></div>`;
    return;
  }

  let html = "";
  screenshots.forEach((s, idx) => {
    const imgUrl = resolveAssetUrl(s.url);
    const caption = s.caption || `Screenshot #${idx + 1}`;
    html += `
      <div class="ss-thumb-card" title="${escapeHtml(caption)}">
        <button type="button" class="ss-thumb-del" title="Delete screenshot" data-rom="${escapeHtml(romName)}" data-index="${idx}">✕</button>
        <img src="${imgUrl}" alt="${escapeHtml(caption)}" class="ss-thumb-img" loading="lazy" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'88\\\' height=\\\'120\\\' viewBox=\\\'0 0 88 120\\\'><rect fill=\\\'%23222\\\' width=\\\'88\\\' height=\\\'120\\\'/><text fill=\\\'%23777\\\' x=\\\'44\\\' y=\\\'60\\\' text-anchor=\\\'middle\\\' font-size=\\\'10\\\'>No Preview</text></svg>';">
        <div class="ss-thumb-caption">${escapeHtml(caption)}</div>
      </div>
    `;
  });
  galleryList.innerHTML = html;

  galleryList.querySelectorAll(".ss-thumb-del").forEach((delBtn) => {
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const rName = delBtn.dataset.rom;
      const rIdx = parseInt(delBtn.dataset.index, 10);
      confirmAndDeleteScreenshot(rName, rIdx);
    });
  });
}

async function confirmAndDeleteScreenshot(romName, index) {
  const rom = findRomItem(romName);
  const shots = (rom && Array.isArray(rom.screenshots)) ? rom.screenshots : [];
  const targetShot = shots[index];
  const shotLabel = targetShot?.caption ? `"${targetShot.caption}"` : `screenshot #${index + 1}`;

  if (!confirm(`Delete ${shotLabel} from "${romName}"?\n\nThis will remove it from the live site.`)) {
    return;
  }

  const payload = {
    action: "delete_screenshot",
    id: `del-ss-${Date.now()}`,
    timestamp: new Date().toISOString(),
    key: currentKey,
    deviceId: currentUser?.deviceId || "",
    submitterRole: currentUser?.role || "developer",
    submitterName: currentUser?.name || "Developer",
    canAutoPush: currentUser?.canAutoPush || false,
    type: "screenshots",
    section: "screenshots",
    targetName: romName,
    title: `Delete ${shotLabel} from ${romName}`,
    data: {
      romName: romName,
      index: index
    }
  };

  try {
    // Fast optimistic DOM update
    if (rom && Array.isArray(rom.screenshots)) {
      rom.screenshots.splice(index, 1);
    }
    updateScreenshotGalleryForSelectedRom(romName);
    populateRomSelect(romName);
    renderLiveItems(activeLiveCat);

    await dispatchSubmission(payload);
    showToast(`🗑️ ${shotLabel} deleted from ${romName}!`);

    setTimeout(() => fetchLiveSiteData(), 1200);
  } catch (err) {
    showToast(`❌ Failed to delete screenshot: ${err.message}`);
    fetchLiveSiteData();
  }
}

function openScreenshotsModalForRom(romName) {
  openAddModal("screenshots");
  populateRomSelect(romName);
  const ssRomSelect = document.getElementById("ss-rom-select");
  if (ssRomSelect) {
    ssRomSelect.value = romName;
  }
  updateScreenshotGalleryForSelectedRom(romName);
}

function updateCategoryCounts() {
  const site = window.SITE || {};

  const romCount = (site.roms || []).reduce((acc, c) => acc + (c.items ? c.items.length : c.feature ? 1 : 0), 0);
  const updateCount = (site.updates || []).length;
  const guideCount = Array.isArray(site.guides) ? site.guides.length : (site.guides?.items?.length || 0);
  const moduleCount =
    (site.modules || []).reduce((acc, c) => acc + (c.items ? c.items.length : 0), 0) +
    (site.recovery || []).reduce((acc, c) => acc + (c.items ? c.items.length : 0), 0) +
    (site.kernels || []).reduce((acc, c) => acc + (c.items ? c.items.length : 0), 0);

  const cr = document.getElementById("count-roms");
  const cu = document.getElementById("count-updates");
  const cg = document.getElementById("count-guides");
  const cm = document.getElementById("count-modules");

  if (cr) cr.textContent = romCount;
  if (cu) cu.textContent = updateCount;
  if (cg) cg.textContent = guideCount;
  if (cm) cm.textContent = moduleCount;
}

// ----------------------------------------------------
// 7. Render Live Items & Manage Content (Edit / Delete)
// ----------------------------------------------------
function renderLiveItems(cat) {
  if (!liveItemsContainer) return;
  const site = window.SITE || {};
  let html = "";

  if (cat === "roms") {
    const list = [];
    (site.roms || []).forEach((group) => {
      if (group.feature && group.feature.name) {
        list.push({ ...group.feature, category: group.title, isFeature: true });
      }
      if (group.items && Array.isArray(group.items)) {
        group.items.forEach((item) => {
          list.push({ ...item, category: group.title });
        });
      }
    });

    if (list.length === 0) {
      html = `<div class="empty-history"><p>No ROMs found on live web.</p></div>`;
    } else {
      list.forEach((item, idx) => {
        const changelogs = item.details?.changelogs || [];
        const clSnippet = changelogs.slice(0, 2).map((c) => `• ${escapeHtml(c)}`).join("<br>");
        html += `
          <div class="live-item-card" data-idx="${idx}">
            <div class="live-item-top">
              <div class="live-item-title">${escapeHtml(item.name)}</div>
              <span class="live-item-tag">${escapeHtml(item.category || "ROM")}</span>
            </div>
            <div class="live-item-meta">
              <span>📅 ${escapeHtml(item.date || "Active")}</span>
              <span>👤 ${escapeHtml(item.by || "Team")}</span>
              ${item.url ? `<span>🔗 <a href="${escapeHtml(item.url)}" target="_blank" style="color:var(--accent); text-decoration:none;">Download</a></span>` : `<span>Soon</span>`}
            </div>
            ${clSnippet ? `<div class="live-item-body">${clSnippet}</div>` : ""}
            <div class="live-item-actions">
              <span style="font-size:11px; color:var(--muted);">${item.screenshots ? item.screenshots.length + " screenshots" : "0 screenshots"}</span>
              <div class="action-btn-group">
                <button class="btn-card-action btn-ss-rom" data-name="${escapeHtml(item.name)}" data-cat="${escapeHtml(item.category)}" title="Manage Screenshots">📸 Photos (${item.screenshots ? item.screenshots.length : 0})</button>
                <button class="btn-card-action btn-edit-rom" data-name="${escapeHtml(item.name)}" data-cat="${escapeHtml(item.category)}">✏️ Edit</button>
                <button class="btn-card-action btn-delete btn-del-rom" data-name="${escapeHtml(item.name)}" data-cat="${escapeHtml(item.category)}">🗑️ Delete</button>
              </div>
            </div>
          </div>
        `;
      });
    }
  } else if (cat === "updates") {
    const list = site.updates || [];
    if (list.length === 0) {
      html = `<div class="empty-history"><p>No live updates posted.</p></div>`;
    } else {
      list.forEach((item) => {
        html += `
          <div class="live-item-card">
            <div class="live-item-top">
              <div class="live-item-title">${escapeHtml(item.title)}</div>
              <span class="live-item-tag">${escapeHtml(item.tag || "News")}</span>
            </div>
            <div class="live-item-meta">
              <span>📅 ${escapeHtml(item.date)}</span>
              <span>👤 ${escapeHtml(item.by || "Admin")}</span>
              ${item.url ? `<span>🔗 <a href="${escapeHtml(item.url)}" target="_blank" style="color:var(--accent); text-decoration:none;">Link</a></span>` : ""}
            </div>
            <div class="live-item-body">${escapeHtml(item.body || "")}</div>
            <div class="live-item-actions">
              <span style="font-size:11px; color:var(--muted);">ID: ${escapeHtml(item.id || "")}</span>
              <div class="action-btn-group">
                <button class="btn-card-action btn-edit-update" data-id="${escapeHtml(item.id)}" data-title="${escapeHtml(item.title)}">✏️ Edit</button>
                <button class="btn-card-action btn-delete btn-del-update" data-id="${escapeHtml(item.id)}" data-title="${escapeHtml(item.title)}">🗑️ Delete</button>
              </div>
            </div>
          </div>
        `;
      });
    }
  } else if (cat === "guides") {
    const list = Array.isArray(site.guides) ? site.guides : (site.guides?.items || []);
    if (list.length === 0) {
      html = `<div class="empty-history"><p>No guides found on live web.</p></div>`;
    } else {
      list.forEach((g) => {
        html += `
          <div class="live-item-card">
            <div class="live-item-top">
              <div class="live-item-title">${escapeHtml(g.title)}</div>
              <span class="live-item-tag">${escapeHtml(g.category || "Guide")}</span>
            </div>
            <div class="live-item-meta">
              <span>⏱️ ${escapeHtml(g.read || "3 min read")}</span>
              <span>Device: ${escapeHtml(g.info?.Device || "GT 20 Pro")}</span>
            </div>
            <div class="live-item-actions">
              <span style="font-size:11px; color:var(--muted);">Slug: ${escapeHtml(g.slug || "")}</span>
              <div class="action-btn-group">
                <button class="btn-card-action btn-edit-guide" data-slug="${escapeHtml(g.slug)}" data-title="${escapeHtml(g.title)}">✏️ Edit</button>
                <button class="btn-card-action btn-delete btn-del-guide" data-slug="${escapeHtml(g.slug)}" data-title="${escapeHtml(g.title)}">🗑️ Delete</button>
              </div>
            </div>
          </div>
        `;
      });
    }
  } else if (cat === "modules") {
    const list = [];
    const collect = (arr, secName) => {
      (arr || []).forEach((group) => {
        (group.items || []).forEach((it) => {
          list.push({ ...it, sectionName: secName, groupTitle: group.title });
        });
      });
    };
    collect(site.modules, "modules");
    collect(site.recovery, "recovery");
    collect(site.kernels, "kernels");

    if (list.length === 0) {
      html = `<div class="empty-history"><p>No modules or tools found.</p></div>`;
    } else {
      list.forEach((m) => {
        html += `
          <div class="live-item-card">
            <div class="live-item-top">
              <div class="live-item-title">${escapeHtml(m.name)}</div>
              <span class="live-item-tag">${escapeHtml(m.groupTitle || m.sectionName)}</span>
            </div>
            <div class="live-item-meta">
              <span>Section: ${escapeHtml(m.sectionName)}</span>
              <span>👤 ${escapeHtml(m.by || "Community")}</span>
              ${m.url ? `<span>🔗 <a href="${escapeHtml(m.url)}" target="_blank" style="color:var(--accent); text-decoration:none;">Download</a></span>` : ""}
            </div>
            <div class="live-item-actions">
              <span></span>
              <div class="action-btn-group">
                <button class="btn-card-action btn-edit-mod" data-name="${escapeHtml(m.name)}" data-section="${escapeHtml(m.sectionName)}" data-cat="${escapeHtml(m.groupTitle)}">✏️ Edit</button>
                <button class="btn-card-action btn-delete btn-del-mod" data-name="${escapeHtml(m.name)}" data-section="${escapeHtml(m.sectionName)}" data-cat="${escapeHtml(m.groupTitle)}">🗑️ Delete</button>
              </div>
            </div>
          </div>
        `;
      });
    }
  } else if (cat === "dev-apks") {
    const devRelease = {
      version: "v1.2.0",
      code: 3,
      date: "October 19, 2026",
      size: "5.7 MB",
      channel: "Developer Channel",
      apkUrl: "https://newbiesteam.surge.sh/assets/dev/NewbiesDev-v1.2.0.apk",
      fallbackUrl: "https://newbiesbase.surge.sh/assets/dev/NewbiesDev-v1.2.0.apk",
      fileName: "NewbiesDev-v1.2.0.apk",
      changelogs: [
        "Fixed upload hang / loading loop with fast 8-second failover and direct local daemon bypass",
        "Multi-screenshot batch uploader: upload up to 10 screenshots per push with separated descriptions",
        "Switched primary cloud relay to high-availability ntfy.envs.net with automatic multi-MB attachment pipeline",
        "High-performance WebP compression algorithm keeping multi-image mobile uploads under 600 KB total",
        "Full sync with official Newbies v1.2.2 public releases and brand adaptive icons"
      ]
    };

    html = `
      <div class="dev-release-card">
        <div class="dev-release-header">
          <div>
            <div class="dev-release-title">NewbiesDev App &amp; Internal Portal</div>
            <div class="dev-release-tagline">Internal Android APK for GT 20 Pro Developer Team</div>
          </div>
          <span class="dev-release-badge">${escapeHtml(devRelease.version)}</span>
        </div>

        <div class="dev-release-meta">
          <span>📅 ${escapeHtml(devRelease.date)}</span>
          <span>⚡ Build ${devRelease.code}</span>
          <span>📦 ${escapeHtml(devRelease.size)}</span>
          <span>🔒 Private Dev Release</span>
        </div>

        <div class="dev-notice-banner">
          🔒 <strong>Private In-App Delivery:</strong> Since the Dev App GitHub repository is private, release APKs are securely delivered directly in-app via encrypted cloud relay and high-speed CDN without requiring personal GitHub tokens on developer devices.
        </div>

        <div class="dev-release-changelog">
          <div class="dev-release-changelog-title">What's New in ${escapeHtml(devRelease.version)}:</div>
          <ul>
            ${devRelease.changelogs.map((cl) => `<li>${escapeHtml(cl)}</li>`).join("")}
          </ul>
        </div>

        <div class="dev-release-actions">
          <button class="btn-dev-download" id="btn-download-dev-apk" data-url="${escapeHtml(devRelease.apkUrl)}" data-fallback="${escapeHtml(devRelease.fallbackUrl)}" data-name="${escapeHtml(devRelease.fileName)}">
            ⬇️ Download &amp; Install Dev APK (${escapeHtml(devRelease.version)})
          </button>
        </div>
      </div>
    `;
  }

  liveItemsContainer.innerHTML = html;
  attachLiveActionListeners();
}

function triggerDevApkDownload(url, fileName) {
  showToast("Starting Dev APK download...");
  if (window.AndroidBridge && typeof window.AndroidBridge.downloadAndInstallApk === "function") {
    try {
      window.AndroidBridge.downloadAndInstallApk(url, fileName);
      showToast("Downloading via Android Manager...");
      return;
    } catch (e) {
      console.warn("AndroidBridge download failed, falling back to browser", e);
    }
  }

  // Fallback: standard link download / external browser
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function attachLiveActionListeners() {
  if (!liveItemsContainer) return;

  // Download Dev APK
  const devDownloadBtn = liveItemsContainer.querySelector("#btn-download-dev-apk");
  if (devDownloadBtn) {
    devDownloadBtn.addEventListener("click", () => {
      const url = devDownloadBtn.dataset.url;
      const fileName = devDownloadBtn.dataset.name || "NewbiesDev-v1.1.0.apk";
      triggerDevApkDownload(url, fileName);
    });
  }

  // Manage Screenshots directly from ROM card
  liveItemsContainer.querySelectorAll(".btn-ss-rom").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      openScreenshotsModalForRom(name);
    });
  });

  // Edit ROM
  liveItemsContainer.querySelectorAll(".btn-edit-rom").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const cat = btn.dataset.cat;
      const item = findRomItem(name, cat);
      if (item) openEditRomModal(item, cat);
    });
  });

  // Delete ROM
  liveItemsContainer.querySelectorAll(".btn-del-rom").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const cat = btn.dataset.cat;
      confirmAndDeleteItem("roms", name, cat);
    });
  });

  // Edit Update
  liveItemsContainer.querySelectorAll(".btn-edit-update").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const item = (window.SITE?.updates || []).find((u) => u.id === id);
      if (item) openEditUpdateModal(item);
    });
  });

  // Delete Update
  liveItemsContainer.querySelectorAll(".btn-del-update").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const title = btn.dataset.title;
      confirmAndDeleteItem("updates", title, "", id);
    });
  });

  // Edit Guide
  liveItemsContainer.querySelectorAll(".btn-edit-guide").forEach((btn) => {
    btn.addEventListener("click", () => {
      const slug = btn.dataset.slug;
      const list = Array.isArray(window.SITE?.guides) ? window.SITE.guides : (window.SITE?.guides?.items || []);
      const item = list.find((g) => g.slug === slug);
      if (item) openEditGuideModal(item);
    });
  });

  // Delete Guide
  liveItemsContainer.querySelectorAll(".btn-del-guide").forEach((btn) => {
    btn.addEventListener("click", () => {
      const slug = btn.dataset.slug;
      const title = btn.dataset.title;
      confirmAndDeleteItem("guides", title, "", slug);
    });
  });

  // Edit Module
  liveItemsContainer.querySelectorAll(".btn-edit-mod").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const sec = btn.dataset.section;
      const cat = btn.dataset.cat;
      const item = findModuleItem(name, sec, cat);
      if (item) openEditModuleModal(item, sec, cat);
    });
  });

  // Delete Module
  liveItemsContainer.querySelectorAll(".btn-del-mod").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const sec = btn.dataset.section;
      const cat = btn.dataset.cat;
      confirmAndDeleteItem(sec, name, cat);
    });
  });
}

function findRomItem(name, cat) {
  for (const group of window.SITE?.roms || []) {
    if ((!cat || group.title === cat) && group.feature && group.feature.name === name) {
      return group.feature;
    }
    if ((!cat || group.title === cat) && Array.isArray(group.items)) {
      const f = group.items.find((x) => x.name === name);
      if (f) return f;
    }
  }
  return null;
}

function findModuleItem(name, sec, cat) {
  const arr = window.SITE?.[sec] || [];
  for (const group of arr) {
    if ((!cat || group.title === cat) && Array.isArray(group.items)) {
      const f = group.items.find((x) => x.name === name);
      if (f) return f;
    }
  }
  return null;
}

// ----------------------------------------------------
// 8. Edit Pre-Fill Modal Functions
// ----------------------------------------------------
function openEditRomModal(item, cat) {
  if (formActionInput) formActionInput.value = "edit";
  if (editSectionInput) editSectionInput.value = "roms";
  if (editTargetNameInput) editTargetNameInput.value = item.name;
  if (editTargetCategoryInput) editTargetCategoryInput.value = cat || "Port ROMs";
  if (editTargetIdInput) editTargetIdInput.value = "";

  // Hide category switcher tabs during editing
  const catTabsWrap = document.getElementById("modal-category-tabs");
  if (catTabsWrap) catTabsWrap.style.display = "none";

  openModal("rom");

  if (modalTitle) modalTitle.textContent = `Edit ROM: ${item.name}`;
  if (modalSubtitle) modalSubtitle.textContent = `Modify live entry in ${cat || "ROMs"}`;
  if (submitBtnText) submitBtnText.textContent = "💾 Save Changes";

  const nameEl = document.getElementById("rom-name");
  if (nameEl) nameEl.value = item.name || "";

  const romCatSelect = document.getElementById("rom-category");
  if (romCatSelect) {
    let found = false;
    for (let opt of romCatSelect.options) {
      if (opt.value === cat) {
        found = true;
        break;
      }
    }
    if (!found && cat) {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      romCatSelect.appendChild(opt);
    }
    romCatSelect.value = cat || "Port ROMs";
  }

  const androidEl = document.getElementById("rom-android");
  if (androidEl) androidEl.value = item.details?.base || item.date || "";

  const byEl = document.getElementById("rom-by");
  if (byEl) byEl.value = item.by || "";

  const baseEl = document.getElementById("rom-base");
  if (baseEl) baseEl.value = item.details?.base || item.alt || "";

  const urlEl = document.getElementById("rom-url");
  if (urlEl) urlEl.value = item.url || "";

  const mirrorEl = document.getElementById("rom-mirror");
  if (mirrorEl) mirrorEl.value = item.mirrorUrl || item.mirror || "";

  const clEl = document.getElementById("rom-changelog");
  if (clEl) clEl.value = (item.details?.changelogs || []).join("\n");

  const bugsEl = document.getElementById("rom-bugs");
  if (bugsEl) bugsEl.value = (item.details?.bugs || []).join("\n");
}

function openEditUpdateModal(item) {
  if (formActionInput) formActionInput.value = "edit";
  if (editSectionInput) editSectionInput.value = "updates";
  if (editTargetNameInput) editTargetNameInput.value = item.title;
  if (editTargetCategoryInput) editTargetCategoryInput.value = item.tag || "";
  if (editTargetIdInput) editTargetIdInput.value = item.id;

  const catTabsWrap = document.getElementById("modal-category-tabs");
  if (catTabsWrap) catTabsWrap.style.display = "none";

  openModal("news");

  if (modalTitle) modalTitle.textContent = `Edit Update: ${item.title}`;
  if (modalSubtitle) modalSubtitle.textContent = `Update live news broadcast`;
  if (submitBtnText) submitBtnText.textContent = "💾 Save Changes";

  const titleEl = document.getElementById("news-title");
  if (titleEl) titleEl.value = item.title || "";

  const tagEl = document.getElementById("news-tag");
  if (tagEl) tagEl.value = item.tag || "New ROM";

  const byEl = document.getElementById("news-by");
  if (byEl) byEl.value = item.by || "";

  const bodyEl = document.getElementById("news-body");
  if (bodyEl) bodyEl.value = item.body || "";

  const urlEl = document.getElementById("news-url");
  if (urlEl) urlEl.value = item.url || (item.link?.href || "");

  const labelEl = document.getElementById("news-link-label");
  if (labelEl) labelEl.value = item.linkLabel || (item.link?.label || "");
}

function openEditGuideModal(item) {
  if (formActionInput) formActionInput.value = "edit";
  if (editSectionInput) editSectionInput.value = "guides";
  if (editTargetNameInput) editTargetNameInput.value = item.title;
  if (editTargetCategoryInput) editTargetCategoryInput.value = item.category || "Flashing Guides";
  if (editTargetIdInput) editTargetIdInput.value = item.slug;

  const catTabsWrap = document.getElementById("modal-category-tabs");
  if (catTabsWrap) catTabsWrap.style.display = "none";

  openModal("guide");

  if (modalTitle) modalTitle.textContent = `Edit Guide: ${item.title}`;
  if (modalSubtitle) modalSubtitle.textContent = `Modify guide instructions`;
  if (submitBtnText) submitBtnText.textContent = "💾 Save Changes";

  const titleEl = document.getElementById("guide-title");
  if (titleEl) titleEl.value = item.title || "";

  const catEl = document.getElementById("guide-category");
  if (catEl) catEl.value = item.category || "Flashing Guides";

  const byEl = document.getElementById("guide-by");
  if (byEl) byEl.value = item.info?.Requires || "";

  const stepsEl = document.getElementById("guide-steps");
  if (stepsEl) stepsEl.value = Array.isArray(item.intro) ? item.intro.join("\n") : (item.intro || "");

  const cautionsEl = document.getElementById("guide-cautions");
  if (cautionsEl) cautionsEl.value = item.warning || "";
}

function openEditModuleModal(item, sec, cat) {
  if (formActionInput) formActionInput.value = "edit";
  if (editSectionInput) editSectionInput.value = sec;
  if (editTargetNameInput) editTargetNameInput.value = item.name;
  if (editTargetCategoryInput) editTargetCategoryInput.value = cat || "";
  if (editTargetIdInput) editTargetIdInput.value = "";

  const catTabsWrap = document.getElementById("modal-category-tabs");
  if (catTabsWrap) catTabsWrap.style.display = "none";

  openModal("module");

  if (modalTitle) modalTitle.textContent = `Edit Tool: ${item.name}`;
  if (modalSubtitle) modalSubtitle.textContent = `Modify live module / tool`;
  if (submitBtnText) submitBtnText.textContent = "💾 Save Changes";

  const nameEl = document.getElementById("mod-name");
  if (nameEl) nameEl.value = item.name || "";

  const secEl = document.getElementById("mod-section");
  if (secEl) secEl.value = sec || "modules";

  const catEl = document.getElementById("mod-category");
  if (catEl) catEl.value = cat || "";

  const byEl = document.getElementById("mod-by");
  if (byEl) byEl.value = item.by || "";

  const urlEl = document.getElementById("mod-url");
  if (urlEl) urlEl.value = item.url || "";

  const mirrorEl = document.getElementById("mod-mirror");
  if (mirrorEl) mirrorEl.value = item.mirrorUrl || "";
}

// ----------------------------------------------------
// 9. Item Deletion Dispatch & M3 Confirmation Modal
// ----------------------------------------------------
function showConfirmDialog(title, message, okText = "Delete") {
  return new Promise((resolve) => {
    const confirmModal = document.getElementById("confirm-modal");
    const titleEl = document.getElementById("confirm-title");
    const msgEl = document.getElementById("confirm-message");
    const okBtn = document.getElementById("confirm-ok-btn");
    const cancelBtn = document.getElementById("confirm-cancel-btn");

    if (!confirmModal || !okBtn || !cancelBtn) {
      const fallback = window.confirm(`${title}\n\n${message}`);
      resolve(fallback);
      return;
    }

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    if (okBtn) okBtn.textContent = okText;

    confirmModal.classList.add("active");
    confirmModal.classList.add("open");

    const cleanup = () => {
      confirmModal.classList.remove("active");
      confirmModal.classList.remove("open");
      okBtn.removeEventListener("click", onOk);
      cancelBtn.removeEventListener("click", onCancel);
    };

    const onOk = () => {
      cleanup();
      resolve(true);
    };

    const onCancel = () => {
      cleanup();
      resolve(false);
    };

    okBtn.addEventListener("click", onOk);
    cancelBtn.addEventListener("click", onCancel);
  });
}

async function confirmAndDeleteItem(section, name, category, id) {
  const targetLabel = name || id;
  const ok = await showConfirmDialog(
    `Delete ${targetLabel}?`,
    `Are you sure you want to permanently delete "${targetLabel}" from the live NewbiesTeam site?`,
    "Delete"
  );
  if (!ok) return;

  if (!currentKey || !currentUser) {
    showToast("Session not initialized. Please re-open the app.");
    return;
  }

  showToast("Processing deletion...");

  const payload = {
    action: "delete",
    id: "del-" + Date.now(),
    timestamp: new Date().toISOString(),
    key: currentKey,
    deviceId: currentUser.deviceId,
    submitterRole: currentUser.role,
    submitterName: currentUser.name,
    canAutoPush: currentUser.canAutoPush,
    type: section,
    section: section,
    targetName: name,
    targetCategory: category,
    targetId: id || name,
    title: `Delete: ${targetLabel}`,
    data: {
      name,
      category,
      id
    }
  };

  try {
    await dispatchSubmission(payload);

    // Only auto-update runtime DOM immediately if user has auto-push OR if this is an update/news item
    const isNewsOrUpdate = (section === "updates" || section === "news");
    if (currentUser.canAutoPush || isNewsOrUpdate) {
      if (section === "updates") {
        window.SITE.updates = (window.SITE.updates || []).filter((u) => u.id !== id && u.title !== name);
      } else if (section === "guides") {
        const gList = Array.isArray(window.SITE.guides) ? window.SITE.guides : (window.SITE?.guides?.items || []);
        window.SITE.guides = gList.filter((g) => g.slug !== id && g.title !== name);
      } else if (Array.isArray(window.SITE?.[section])) {
        window.SITE[section].forEach((grp) => {
          if (grp.feature && grp.feature.name === name) delete grp.feature;
          if (Array.isArray(grp.items)) {
            grp.items = grp.items.filter((it) => it.name !== name);
          }
        });
      }

      updateCategoryCounts();
      renderLiveItems(activeLiveCat);

      if (currentUser.canAutoPush) {
        showToast(`🚀 "${targetLabel}" deleted live from NewbiesTeam!`);
      } else {
        showToast(`📢 "${targetLabel}" deleted live from Updates feed!`);
      }
    } else {
      showToast(`⏳ Deletion request queued for Softbrick's verification in server toolkit!`);
    }
  } catch (err) {
    showToast(`❌ Deletion failed: ${err.message}`);
  }
}

// ----------------------------------------------------
let isSubmittingSubmission = false;

async function handleFormSubmit(e) {
  if (e && typeof e.preventDefault === "function") e.preventDefault();
  if (isSubmittingSubmission) return;

  if (!currentKey || !currentUser) {
    showToast("Session not initialized. Please re-open the app.");
    return;
  }

  isSubmittingSubmission = true;
  setSubmitting(true);

  try {
    const isEdit = formActionInput?.value === "edit";
    const payloadData = buildPayloadForCategory(activeCategory);

    // Validation checks
    if (activeCategory === "rom") {
      if (!payloadData.name) throw new Error("ROM Name is required");
      if (!payloadData.url) throw new Error("Primary Download Link is required");
    } else if (activeCategory === "screenshots") {
      if (!payloadData.romName) throw new Error("Target ROM is required");
      if (!payloadData.screenshots || payloadData.screenshots.length === 0) {
        throw new Error("Please select at least 1 screenshot (up to 10 allowed)");
      }
    } else if (activeCategory === "guide") {
      if (!payloadData.title) throw new Error("Guide Title is required");
      if (!payloadData.steps || payloadData.steps.length === 0) throw new Error("Guide Steps are required");
    } else if (activeCategory === "news") {
      if (!payloadData.title) throw new Error("Post Title is required");
      if (!payloadData.body) throw new Error("News Details / Changelog is required");
    } else if (activeCategory === "module") {
      if (!payloadData.name) throw new Error("Tool / Module Name is required");
      if (!payloadData.url) throw new Error("Primary Download Link is required");
    }

    const submissionId = (isEdit ? "edit-" : "sub-") + Date.now();
    const sectionTarget = editSectionInput?.value || (activeCategory === "rom" ? "roms" : activeCategory);
    const isNewsOrUpdate = (activeCategory === "news" || activeCategory === "updates" || sectionTarget === "updates");

    const isScreenshots = activeCategory === "screenshots";
    const shotCount = payloadData.screenshots ? payloadData.screenshots.length : 1;
    const itemTitle = isScreenshots
      ? `${shotCount} Screenshot(s) for ${payloadData.romName}`
      : (payloadData.title || payloadData.name || "Submission");

    const submission = {
      action: isEdit ? "edit" : "add",
      id: submissionId,
      timestamp: new Date().toISOString(),
      key: currentKey,
      deviceId: currentUser.deviceId,
      submitterRole: currentUser.role,
      submitterName: currentUser.name,
      submitterPhoto: currentUser.photo || "",
      canAutoPush: currentUser.canAutoPush,
      type: activeCategory,
      section: sectionTarget,
      targetName: editTargetNameInput?.value || payloadData.romName || payloadData.name || payloadData.title,
      targetCategory: editTargetCategoryInput?.value || payloadData.category || "",
      targetId: editTargetIdInput?.value || "",
      title: (isEdit ? "[Edit] " : "") + itemTitle,
      data: payloadData
    };

    // Fast dispatch directly to local daemon or 24/7 cloud relay
    await dispatchSubmission(submission);

    // Save to local device history
    saveSubmissionToHistory({
      id: submissionId,
      type: (isEdit ? "✏️ " : "🚀 ") + activeCategory,
      title: submission.title,
      date: new Date().toLocaleDateString(),
      status: currentUser.canAutoPush || isNewsOrUpdate ? "live" : "pending"
    });

    closeModal();
    resetForm();

    if (currentUser.canAutoPush) {
      showToast(`🚀 Changes auto-pushed live to NewbiesTeam Hub!`);
      setTimeout(() => fetchLiveSiteData(), 1200);
    } else if (isNewsOrUpdate) {
      showToast("📢 News / Update broadcast posted live immediately!");
      setTimeout(() => fetchLiveSiteData(), 1200);
    } else {
      showToast("⏳ Request queued for Softbrick's verification in server toolkit!");
    }
  } catch (err) {
    showToast("❌ Upload failed: " + (err.message || "Network error"));
  } finally {
    isSubmittingSubmission = false;
    setSubmitting(false);
  }
}

function buildPayloadForCategory(cat) {
  switch (cat) {
    case "rom": {
      const name = (document.getElementById("rom-name")?.value || "").trim();
      const category = document.getElementById("rom-category")?.value || "Port ROMs";
      const android = (document.getElementById("rom-android")?.value || "").trim();
      const by = (document.getElementById("rom-by")?.value || "").trim() || currentUser.name;
      const base = (document.getElementById("rom-base")?.value || "").trim();
      const url = (document.getElementById("rom-url")?.value || "").trim();
      const mirror = (document.getElementById("rom-mirror")?.value || "").trim();
      const changelogRaw = (document.getElementById("rom-changelog")?.value || "").trim();
      const bugsRaw = (document.getElementById("rom-bugs")?.value || "").trim();

      const changelog = changelogRaw ? changelogRaw.split("\n").map((s) => s.trim()).filter(Boolean) : [];
      const bugs = bugsRaw ? bugsRaw.split("\n").map((s) => s.trim()).filter(Boolean) : [];

      return {
        name,
        category,
        android,
        by,
        base,
        url,
        mirror,
        details: changelog,
        bugs,
        imageBase64: compressedImages.rom || ""
      };
    }
    case "screenshots": {
      const romName = (document.getElementById("ss-rom-select")?.value || "").trim();

      const shots = selectedScreenshots.map((item, idx) => {
        const inputEl = document.querySelector(`.ss-item-caption-input[data-id="${item.id}"]`);
        const cap = inputEl ? inputEl.value.trim() : item.caption;
        return {
          caption: cap || `Screenshot ${idx + 1}`,
          imageBase64: item.base64,
          width: item.width,
          height: item.height
        };
      });

      return {
        romName,
        screenshots: shots,
        caption: shots.length > 0 ? shots[0].caption : "",
        imageBase64: shots.length > 0 ? shots[0].imageBase64 : ""
      };
    }
    case "guide": {
      const title = (document.getElementById("guide-title")?.value || "").trim();
      const category = document.getElementById("guide-category")?.value || "Flashing Guides";
      const stepsRaw = (document.getElementById("guide-steps")?.value || "").trim();
      const cautionsRaw = (document.getElementById("guide-cautions")?.value || "").trim();

      const steps = stepsRaw ? stepsRaw.split("\n").map((s) => s.trim()).filter(Boolean) : [];
      const cautions = cautionsRaw ? cautionsRaw.split("\n").map((s) => s.trim()).filter(Boolean) : [];

      return {
        title,
        category,
        steps,
        cautions
      };
    }
    case "news": {
      const title = (document.getElementById("news-title")?.value || "").trim();
      const tag = document.getElementById("news-tag")?.value || "New ROM";
      const body = (document.getElementById("news-body")?.value || "").trim();
      const url = (document.getElementById("news-url")?.value || "").trim();
      const linkLabel = (document.getElementById("news-link-label")?.value || "").trim();

      return {
        title,
        tag,
        body,
        url,
        linkLabel,
        imageBase64: compressedImages.news || ""
      };
    }
    case "module": {
      const name = (document.getElementById("mod-name")?.value || "").trim();
      const section = document.getElementById("mod-section")?.value || "modules";
      const category = (document.getElementById("mod-category")?.value || "").trim();
      const by = (document.getElementById("mod-by")?.value || "").trim() || currentUser.name;
      const url = (document.getElementById("mod-url")?.value || "").trim();
      const mirror = (document.getElementById("mod-mirror")?.value || "").trim();

      return {
        name,
        section,
        category,
        by,
        url,
        mirror
      };
    }
    default:
      return {};
  }
}

// Dispatches payload over local daemon or 24/7 cloud relay with 8s timeout failover
async function dispatchSubmission(submission) {
  const jsonString = JSON.stringify(submission);

  // 1. If running locally or on local network with daemon on 4720, try direct fast push first
  const localEndpoints = [
    "http://127.0.0.1:4720/dev-submit",
    "http://localhost:4720/dev-submit"
  ];
  for (const localUrl of localEndpoints) {
    try {
      const res = await fetch(localUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonString,
        signal: AbortSignal.timeout(2000)
      });
      if (res.ok) {
        const resData = await res.json().catch(() => ({ ok: true }));
        if (resData.ok) {
          return { ok: true, direct: true };
        }
      }
    } catch (_) {}
  }

  // 2. High-availability Cloud Relays with fast 8-second failover
  const relayUrls = [
    CONFIG.relayUrl,
    CONFIG.relayUrl + "_b",
    CONFIG.relayFallbackUrl,
    CONFIG.relayFallbackUrl + "_b"
  ].filter(Boolean);

  let lastError = null;
  for (let i = 0; i < relayUrls.length; i++) {
    const url = relayUrls[i];
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Title": `NBT Submission: ${submission.title} (${submission.type})`,
            "Priority": "high",
            "Tags": "inbox_tray,zap"
          },
          body: jsonString,
          signal: AbortSignal.timeout(8000)
        });

        if (res.status === 429) {
          showToast(`Relay busy, retrying in 1.5s...`);
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }

        if (!res.ok) {
          throw new Error(`Relay returned status ${res.status}`);
        }

        return { ok: true };
      } catch (err) {
        lastError = err;
        await new Promise((r) => setTimeout(r, 600));
      }
    }
  }

  throw lastError || new Error("Failed to dispatch submission over all relay channels");
}

// Dispatches device claim message over relay
async function dispatchDeviceClaim(session) {
  const payload = {
    type: "device_claim",
    id: "claim-" + Date.now(),
    key: session.key,
    deviceId: session.deviceId,
    name: session.name,
    photo: session.photo ? "attached" : "",
    timestamp: session.activatedAt
  };

  await fetch(CONFIG.relayUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Title": `NBT Device Claim: ${session.name}`,
      "Priority": "default"
    },
    body: JSON.stringify(payload)
  }).catch(() => {});
}

// ----------------------------------------------------
// 11. Modal Opening / Closing & Tabs
// ----------------------------------------------------
function openAddModal(cat) {
  if (formActionInput) formActionInput.value = "add";
  if (editSectionInput) editSectionInput.value = "";
  if (editTargetNameInput) editTargetNameInput.value = "";
  if (editTargetCategoryInput) editTargetCategoryInput.value = "";
  if (editTargetIdInput) editTargetIdInput.value = "";
  if (submitBtnText) submitBtnText.textContent = "🚀 Upload & Publish";

  const catTabsWrap = document.getElementById("modal-category-tabs");
  if (catTabsWrap) catTabsWrap.style.display = "";

  resetForm();
  openModal(cat);
}

function openModal(category) {
  switchCategory(category);
  if (uploadModal) {
    uploadModal.classList.add("open");
  }
}

function closeModal() {
  if (uploadModal) {
    uploadModal.classList.remove("open");
  }
  const catTabsWrap = document.getElementById("modal-category-tabs");
  if (catTabsWrap) catTabsWrap.style.display = "";
  if (formActionInput) formActionInput.value = "add";
}

function switchCategory(cat) {
  const targetSec = document.getElementById(`fields-${cat}`);
  if (activeCategory === cat && targetSec && !targetSec.classList.contains("hidden")) {
    return;
  }
  activeCategory = cat;

  if (catTabs) {
    catTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.type === cat);
    });
  }

  const allSections = document.querySelectorAll(".form-section");
  allSections.forEach((sec) => sec.classList.add("hidden"));

  if (targetSec) targetSec.classList.remove("hidden");

  const titles = {
    rom: { title: "Upload Port ROM / Firmware", sub: "NewbiesTeam Port & GSI Hub" },
    screenshots: { title: "Upload Screenshots to ROM", sub: "Add up to 10 photos with individual descriptions" },
    guide: { title: "Author Interactive Guide", sub: "Publish flashing, rooting or unbrick guide" },
    news: { title: "Broadcast Live News Update", sub: "Posts immediately to Updates Feed" },
    module: { title: "Add Tool, Kernel or Module", sub: "Magisk, KSU, Recovery & Boot" }
  };

  if (cat === "screenshots") {
    populateRomSelect();
  }

  if (formActionInput?.value !== "edit") {
    const meta = titles[cat] || { title: "Developer Upload", sub: "NewbiesTeam Hub" };
    if (modalTitle) modalTitle.textContent = meta.title;
    if (modalSubtitle) modalSubtitle.textContent = meta.sub;
    if (submitBtnText) submitBtnText.textContent = (cat === "screenshots") ? "📸 Upload Screenshots" : "🚀 Upload & Publish";
  }
}

// ----------------------------------------------------
// 12. Roster Modal Rendering
// ----------------------------------------------------
function openRosterModal() {
  renderTeamRoster();
  if (rosterModal) {
    rosterModal.classList.add("active");
    rosterModal.classList.add("open");
  }
}

function closeRosterModal() {
  if (rosterModal) {
    rosterModal.classList.remove("active");
    rosterModal.classList.remove("open");
  }
}

function renderTeamRoster() {
  if (!rosterListContainer) return;
  rosterListContainer.innerHTML = "";

  const allKeys = Object.entries(CONFIG.keys);
  allKeys.forEach(([keyStr, dev]) => {
    const isMe = currentKey === keyStr;
    const isRevoked = dev.revoked || dev.status === "revoked";
    const displayName = (isMe && currentUser?.name) ? currentUser.name : (dev.bound_user_name || dev.name);
    const photoSrc = (isMe && currentUser?.photo) ? currentUser.photo : (dev.bound_photo || "icons/icon-192.png");

    const item = document.createElement("div");
    item.className = `roster-dev-item ${isMe ? "is-me" : ""}`;

    let statusText = "🟢 Ready";
    let statusClass = "color: #10b981;";
    if (isRevoked) {
      statusText = "🔴 Revoked";
      statusClass = "color: #ef4444;";
    } else if (dev.bound_device_id) {
      statusText = isMe ? "🔒 Your Phone (Active)" : "🔒 Bound to Device";
      statusClass = "color: #60a5fa;";
    }

    item.innerHTML = `
      <div class="dev-item-avatar">
        <img src="${escapeHtml(photoSrc)}" alt="${escapeHtml(displayName)}">
      </div>
      <div class="dev-item-info">
        <div class="dev-item-name">${escapeHtml(displayName)} ${isMe ? '<span style="color:var(--accent); font-size:11px;">(You)</span>' : ''}</div>
        <div class="dev-item-status" style="${statusClass}">${statusText} · ${dev.role.toUpperCase()}</div>
      </div>
      <div class="badge-pill ${dev.role === 'admin' ? 'badge-admin' : 'badge-team'}">
        ${dev.role === 'admin' ? 'AUTO-PUSH' : 'MODERATED'}
      </div>
    `;
    rosterListContainer.appendChild(item);
  });
}

// ----------------------------------------------------
// 13. Image Pickers & Client-Side Compression
// ----------------------------------------------------
function setupImagePickers() {
  setupPicker("rom-image-file", "rom-image-btn", "rom-image-preview", "rom", 1280, 720);
  setupMultiScreenshotPicker();
  setupPicker("news-image-file", "news-image-btn", "news-image-preview", "news", 1280, 720);
}

function setupMultiScreenshotPicker() {
  const fileInput = document.getElementById("ss-multi-file-input");
  const chooseBtn = document.getElementById("btn-choose-screenshots");
  const clearBtn = document.getElementById("btn-clear-all-screenshots");

  if (chooseBtn && fileInput) {
    chooseBtn.addEventListener("click", () => {
      if (selectedScreenshots.length >= 10) {
        showToast("Maximum of 10 screenshots already selected.");
        return;
      }
      fileInput.click();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      selectedScreenshots = [];
      if (fileInput) fileInput.value = "";
      renderSelectedScreenshots();
      showToast("Cleared selected screenshots");
    });
  }

  if (fileInput) {
    fileInput.addEventListener("change", async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const remaining = 10 - selectedScreenshots.length;
      if (remaining <= 0) {
        showToast("Maximum 10 screenshots reached per push.");
        fileInput.value = "";
        return;
      }

      const toAdd = files.slice(0, remaining);
      if (files.length > remaining) {
        showToast(`Selected first ${remaining} screenshot(s) to stay within 10 limit.`);
      }

      showToast(`Compressing ${toAdd.length} screenshot(s)...`);
      for (let i = 0; i < toAdd.length; i++) {
        const f = toAdd[i];
        try {
          const res = await compressScreenshotFile(f, 1080, 2400, 0.78);
          selectedScreenshots.push({
            id: "ss-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
            base64: res.base64,
            width: res.width,
            height: res.height,
            sizeStr: (res.bytes / 1024).toFixed(0) + " KB",
            caption: ""
          });
        } catch (err) {
          showToast(`Error processing ${f.name}: ${err.message}`);
        }
      }

      fileInput.value = "";
      renderSelectedScreenshots();
      showToast(`✔ ${selectedScreenshots.length} / 10 screenshot(s) ready`);
    });
  }
}

function renderSelectedScreenshots() {
  const container = document.getElementById("ss-selected-list");
  const counter = document.getElementById("ss-batch-counter");
  const clearBtn = document.getElementById("btn-clear-all-screenshots");
  if (!container) return;

  if (counter) counter.textContent = `${selectedScreenshots.length} / 10 selected`;
  if (clearBtn) clearBtn.classList.toggle("hidden", selectedScreenshots.length === 0);

  if (selectedScreenshots.length === 0) {
    container.innerHTML = `
      <div class="ss-empty-hint" id="ss-empty-placeholder">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        <span>No screenshots selected yet. Tap the button above to pick up to 10 photos from your phone gallery.</span>
      </div>`;
    return;
  }

  let html = "";
  selectedScreenshots.forEach((item, index) => {
    html += `
      <div class="ss-item-card" data-id="${item.id}">
        <div class="ss-item-thumb-wrap">
          <img src="${item.base64}" class="ss-item-thumb" alt="Screenshot #${index + 1}">
          <span class="ss-item-index">#${index + 1}</span>
        </div>
        <div class="ss-item-body">
          <div class="ss-item-meta">${item.width}×${item.height} • ${item.sizeStr}</div>
          <input type="text" class="ss-item-caption-input" data-id="${item.id}"
                 value="${escapeHtml(item.caption || '')}"
                 placeholder="Description (e.g. Homescreen, Lockscreen, Antutu)...">
        </div>
        <button type="button" class="ss-item-del-btn" data-id="${item.id}" title="Remove screenshot">✕</button>
      </div>
    `;
  });

  container.innerHTML = html;

  // Listeners for individual caption inputs
  container.querySelectorAll(".ss-item-caption-input").forEach((inp) => {
    inp.addEventListener("input", (e) => {
      const id = inp.dataset.id;
      const target = selectedScreenshots.find((x) => x.id === id);
      if (target) target.caption = e.target.value;
    });
  });

  // Listeners for delete buttons
  container.querySelectorAll(".ss-item-del-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      selectedScreenshots = selectedScreenshots.filter((x) => x.id !== id);
      renderSelectedScreenshots();
    });
  });
}

function compressScreenshotFile(file, maxWidth = 1080, maxHeight = 2400, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/webp", quality);
        const approxBytes = Math.round((dataUrl.length - 22) * 3 / 4);
        resolve({ base64: dataUrl, width, height, bytes: approxBytes });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function setupPicker(inputId, btnId, previewId, categoryKey, maxW, maxH) {
  const fileInput = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  const preview = document.getElementById(previewId);

  if (btn && fileInput) btn.addEventListener("click", () => fileInput.click());
  if (preview && fileInput) preview.addEventListener("click", () => fileInput.click());

  if (fileInput) {
    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      try {
        showToast("Processing image...");
        const compressed = await compressImageFile(file, maxW, maxH, 0.88);
        compressedImages[categoryKey] = compressed;

        if (preview) {
          preview.innerHTML = `<img src="${compressed}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;" alt="Preview">`;
        }
        showToast("✔ Photo ready");
      } catch (err) {
        showToast("Error processing photo: " + err.message);
      }
    });
  }
}

function compressAvatar(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        const canvas = document.createElement("canvas");
        canvas.width = 160;
        canvas.height = 160;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, startX, startY, size, size, 0, 0, 160, 160);

        const dataUrl = canvas.toDataURL("image/webp", 0.90);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function compressImageFile(file, maxWidth = 1280, maxHeight = 1280, quality = 0.88) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/webp", quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function setSubmitting(isSubmitting) {
  if (submitBtn) submitBtn.disabled = isSubmitting;
  if (submitSpinner) submitSpinner.classList.toggle("hidden", !isSubmitting);
  if (submitBtnText) submitBtnText.style.display = isSubmitting ? "none" : "inline";
}

function resetForm() {
  if (submissionForm) submissionForm.reset();
  compressedImages = { rom: null, screenshots: null, news: null };
  selectedScreenshots = [];
  renderSelectedScreenshots();
  const romP = document.getElementById("rom-image-preview");
  if (romP) {
    romP.innerHTML = `
      <div class="preview-placeholder">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        <span>Choose photo from phone</span>
      </div>`;
  }
  const newsP = document.getElementById("news-image-preview");
  if (newsP) {
    newsP.innerHTML = `
      <div class="preview-placeholder">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        <span>Select photo from phone</span>
      </div>`;
  }
}

function saveSubmissionToHistory(item) {
  try {
    const list = JSON.parse(localStorage.getItem("nbt_dev_history") || "[]");
    list.unshift(item);
    localStorage.setItem("nbt_dev_history", JSON.stringify(list.slice(0, 30)));
    renderHistory();
  } catch (_) {}
}

function renderHistory() {
  if (!historyContainer) return;
  try {
    const list = JSON.parse(localStorage.getItem("nbt_dev_history") || "[]");
    if (!list || list.length === 0) return;

    historyContainer.innerHTML = list
      .map(
        (item) => `
        <div class="history-item">
          <div class="history-item-left">
            <span class="history-badge">${escapeHtml(item.type)}</span>
            <div>
              <div class="history-title">${escapeHtml(item.title)}</div>
              <div class="history-meta">${escapeHtml(item.date)} • ${
                item.status === "live" ? "🚀 Live" : "⏳ Pending Approval"
              }</div>
            </div>
          </div>
          <span class="history-status ${item.status}">${item.status === "live" ? "LIVE" : "PENDING"}</span>
        </div>
      `
      )
      .join("");
  } catch (_) {}
}

function showToast(message) {
  if (window.AndroidBridge && typeof window.AndroidBridge.showToast === "function") {
    try {
      window.AndroidBridge.showToast(message);
    } catch (_) {}
  }
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Global modal closer for Android system back button / gesture
window.closeAnyOpenModal = function () {
  const confirmModal = document.getElementById("confirm-modal");
  if (confirmModal && (confirmModal.classList.contains("active") || confirmModal.classList.contains("open"))) {
    confirmModal.classList.remove("active");
    confirmModal.classList.remove("open");
    return true;
  }
  if (uploadModal && (uploadModal.classList.contains("active") || uploadModal.classList.contains("open"))) {
    closeModal();
    return true;
  }
  if (rosterModal && (rosterModal.classList.contains("active") || rosterModal.classList.contains("open"))) {
    closeRosterModal();
    return true;
  }
  if (alertModal && (alertModal.classList.contains("active") || alertModal.classList.contains("open"))) {
    hideAlertModal();
    return true;
  }
  return false;
};

