import {
    app,
    auth,
    db,
    googleProvider,
    ADMIN_UID,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    ref,
    set,
    get,
    update,
    remove,
    push,
    onValue,
    runTransaction,
    serverTimestamp,
    saveCachedBalance,
    saveCachedUser
} from "./firebase.js";


// --- 1. MULTI-LANGUAGE & CURRENCY SYSTEM (i18n) ---
window.i18n = {
    en: {
        welcomeBack: "Welcome Back,", availableBalance: "Available Balance", addFunds: "ADD FUNDS",
        purchases: "Purchases", totalSpent: "Total Spent", activeKeys: "Active Keys", memberSince: "Member Since",
        store: "Store", wallet: "Wallet", profile: "Profile", support: "Support", featuredPanels: "Featured Panels",
        viewAll: "View All", recentPurchases: "Recent Purchases", noPurchases: "No purchases yet", browseStore: "Browse Store →",
        activePromotions: "Active Promotions", noPromotions: "No promotions active", home: "Home",
        searchPanels: "Search panels, features...", allItems: "All Items", nodesFound: "Nodes Found",
        syncing: "Syncing Database", checkout: "Checkout", item: "Item", plan: "Plan", price: "Price",
        toPay: "To Pay", promoCode: "Promo Code?", apply: "APPLY", cancel: "CANCEL", confirmPay: "CONFIRM PAY",
        purchaseSuccess: "PURCHASE SUCCESS!", licenseReady: "Your license key is ready.", licenseKey: "License Key",
        access: "ACCESS", close: "CLOSE", availableFunds: "Available Funds", currentBalance: "Current Balance",
        todayDeposit: "Today Deposit", totalDeposit: "Total Deposit", pendingDeposit: "Pending Deposit",
        depositGateway: "Deposit Gateway", enterAmount: "Enter Amount (₹)", phoneNumber: "WhatsApp / Phone Number",
        payViaUPI: "Pay via UPI App", scanQR: "Scan via Paytm / PhonePe / GPay", submitVerify: "Submit for Verification",
        crypto: "Crypto", iHavePaid: "I Have Paid", ledgerHistory: "Ledger History", fetching: "Fetching Ledger...",
        noTransactions: "No transactions yet", authorizedClient: "Authorized Client", loadingIdentity: "Loading Identity...",
        fetchingData: "Fetching data...", uid: "UID", joined: "Joined", totalKeys: "Total Keys",
        availableBal: "Available Bal", resetHwid: "Reset HWID", myAccessVault: "My Access Vault",
        encrypted: "End-to-End Encrypted", decrypting: "Decrypting License Vault...", settingsPanel: "Settings Panel",
        customize: "Customize your experience", profileDesc: "Update your display name & avatar", enterName: "Enter display name...",
        save: "Save", appearance: "Appearance", appearanceDesc: "Theme, language & currency", theme: "Theme",
        dark: "Dark", light: "Light", language: "Language", currency: "Currency", notifications: "Notifications",
        notifDesc: "Alerts & delivery channels", purchaseAlerts: "Purchase Alerts", purchaseAlertsDesc: "When a purchase succeeds or fails",
        depositConfirm: "Deposit Confirmations", depositConfirmDesc: "When funds are credited", promotions: "Promotions & Offers",
        promotionsDesc: "Discounts, sales & bonus alerts", emailNotif: "Email Notifications", emailNotifDesc: "Receive updates via email",
        link: "Link", preferences: "Preferences", prefsDesc: "Auto actions & default choices", autoLogin: "Auto Login",
        autoLoginDesc: "Stay logged in across sessions", defaultPay: "Default Payment", defaultPayDesc: "Preferred payment method",
        minDeposit: "Min Deposit Alert", minDepositDesc: "Minimum ₹ amount to notify", security: "Security",
        securityDesc: "Account protection & sessions", password: "Password", passwordDesc: "Send reset link to your email",
        reset: "Reset", lastLogin: "Last Login", active: "Active", twoFactor: "Two-Factor Auth", twoFactorDesc: "Add extra layer of security",
        enable: "Enable", sessions: "Active Sessions", sessionsDesc: "Currently logged in browsers", referral: "Referral",
        referralDesc: "Share & earn rewards", copy: "Copy", data: "Data", dataDesc: "Export or manage your data",
        exportData: "Export Data", clearCache: "Clear Cache", loading: "Loading...", firstSession: "First session",
        comingSoon: "2FA coming soon!", connected: "Connected", darkMode: "Dark mode enabled", lightMode: "Light mode enabled",
        currencySet: "Currency set to", paymentSet: "Default payment:", minDepositSet: "Min deposit alert: ₹",
        enterChatId: "Enter your Telegram Chat ID", nameRequired: "Please enter a name", nameUpdated: "Display name updated!",
        notAuth: "Not authenticated", resetSent: "Reset link sent to", noEmail: "No email on record",
        exported: "Account data exported!", exportFailed: "Export failed", noData: "No data found",
        cacheCleared: "Data cleared from local cache", linkCopied: "Referral link copied!", loadingLink: "Loading referral link...",
        nameSaving: "Saving...", err: "Error:", myKeys: "My Keys", noKeys: "No keys purchased yet",
        hwidReset: "HWID Reset", enterKey: "Enter your license key", keyCopied: "Key copied!", failedCopy: "Failed to copy",
        noHistory: "No reset history", login: "LOGIN", signUp: "SIGN UP", emailOrUser: "Email or Username",
        enterPassword: "Enter Password", rememberMe: "Remember Me", forgotPassword: "Forgot Password?",
        orContinue: "OR CONTINUE WITH", continueGoogle: "Continue with Google", fullName: "Full Name",
        username: "Username", emailAddress: "Email Address", createPassword: "Create Password", confirmPassword: "Confirm Password",
        agreeTerms: "I agree to the Terms & Conditions", createAccount: "CREATE ACCOUNT", pleaseWait: "Please Wait...",
        secureAuth: "Secure Authentication"
    },
    hi: {
        welcomeBack: "वापसी पर स्वागत है,", availableBalance: "उपलब्ध शेष राशि", addFunds: "फंड जोड़ें",
        purchases: "खरीदारी", totalSpent: "कुल खर्च", activeKeys: "सक्रिय कुंजियां", memberSince: "सदस्यता से",
        store: "स्टोर", wallet: "वॉलेट", profile: "प्रोफ़ाइल", support: "सहायता", featuredPanels: "फीचर्ड पैनल",
        viewAll: "सभी देखें", recentPurchases: "हालिया खरीदारी", noPurchases: "अभी तक कोई खरीदारी नहीं", browseStore: "स्टोर ब्राउज़ करें →",
        activePromotions: "सक्रिय प्रमोशन", noPromotions: "कोई प्रमोशन सक्रिय नहीं", home: "होम",
        searchPanels: "पैनल, फीचर खोजें...", allItems: "सभी आइटम", nodesFound: "नोड मिले",
        syncing: "डेटाबेस सिंक हो रहा है", checkout: "चेकआउट", item: "आइटम", plan: "प्लान", price: "कीमत",
        toPay: "भुगतान करें", promoCode: "प्रोमो कोड?", apply: "लागू करें", cancel: "रद्द करें", confirmPay: "भुगतान की पुष्टि करें",
        purchaseSuccess: "खरीदारी सफल!", licenseReady: "आपकी लाइसेंस कुंजी तैयार है।", licenseKey: "लाइसेंस कुंजी",
        access: "एक्सेस", close: "बंद करें", availableFunds: "उपलब्ध फंड", currentBalance: "वर्तमान शेष",
        todayDeposit: "आज की जमा", totalDeposit: "कुल जमा", pendingDeposit: "लंबित जमा",
        depositGateway: "जमा गेटवे", enterAmount: "राशि दर्ज करें (₹)", phoneNumber: "व्हाट्सएप / फोन नंबर",
        payViaUPI: "UPI ऐप से भुगतान करें", scanQR: "Paytm / PhonePe / GPay से स्कैन करें", submitVerify: "सत्यापन के लिए सबमिट करें",
        crypto: "क्रिप्टो", iHavePaid: "मैंने भुगतान कर दिया", ledgerHistory: "लेजर इतिहास", fetching: "लेजर लोड हो रहा है...",
        noTransactions: "अभी तक कोई लेन-देन नहीं", authorizedClient: "अधिकृत क्लाइंट", loadingIdentity: "पहचान लोड हो रही है...",
        fetchingData: "डेटा लाया जा रहा है...", uid: "यूआईडी", joined: "शामिल हुए", totalKeys: "कुल कुंजियां",
        availableBal: "उपलब्ध शेष", resetHwid: "HWID रीसेट", myAccessVault: "मेरी एक्सेस वॉल्ट",
        encrypted: "एंड-टू-एंड एन्क्रिप्टेड", decrypting: "लाइसेंस वॉल्ट डिक्रिप्ट हो रहा है...", settingsPanel: "सेटिंग्स पैनल",
        customize: "अपने अनुभव को कस्टमाइज़ करें", profileDesc: "डिस्प्ले नाम और अवतार अपडेट करें", enterName: "डिस्प्ले नाम दर्ज करें...",
        save: "सेव", appearance: "दिखावट", appearanceDesc: "थीम, भाषा और मुद्रा", theme: "थीम",
        dark: "डार्क", light: "लाइट", language: "भाषा", currency: "मुद्रा", notifications: "सूचनाएं",
        notifDesc: "अलर्ट और डिलीवरी चैनल", purchaseAlerts: "खरीदारी अलर्ट", purchaseAlertsDesc: "जब खरीदारी सफल या विफल हो",
        depositConfirm: "जमा पुष्टिकरण", depositConfirmDesc: "जब फंड क्रेडिट हों", promotions: "प्रमोशन और ऑफ़र",
        promotionsDesc: "डिस्काउंट, सेल और बोनस अलर्ट", emailNotif: "ईमेल सूचनाएं", emailNotifDesc: "ईमेल के माध्यम से अपडेट प्राप्त करें",
        preferences: "प्राथमिकताएं", prefsDesc: "ऑटो क्रियाएं और डिफ़ॉल्ट विकल्प", autoLogin: "ऑटो लॉगिन",
        autoLoginDesc: "सत्रों में लॉग इन रहें", defaultPay: "डिफ़ॉल्ट भुगतान", defaultPayDesc: "पसंदीदा भुगतान विधि",
        minDeposit: "न्यूनतम जमा अलर्ट", minDepositDesc: "सूचित करने के लिए न्यूनतम ₹ राशि", security: "सुरक्षा",
        securityDesc: "खाता सुरक्षा और सत्र", password: "पासवर्ड", passwordDesc: "अपने ईमेल पर रीसेट लिंक भेजें",
        reset: "रीसेट", lastLogin: "अंतिम लॉगिन", active: "सक्रिय", twoFactor: "टू-फ़ैक्टर प्रमाणीकरण",
        twoFactorDesc: "सुरक्षा की अतिरिक्त परत जोड़ें", enable: "सक्षम करें", sessions: "सक्रिय सत्र",
        sessionsDesc: "वर्तमान में लॉग इन ब्राउज़र", referral: "रेफरल", referralDesc: "शेयर करें और कमाएं",
        copy: "कॉपी", data: "डेटा", dataDesc: "डेटा निर्यात या प्रबंधित करें", exportData: "डेटा निर्यात",
        clearCache: "कैश साफ़ करें", loading: "लोड हो रहा है...", firstSession: "पहला सत्र", comingSoon: "2FA जल्द आ रहा है!",
        connected: "कनेक्टेड", darkMode: "डार्क मोड सक्षम", lightMode: "लाइट मोड सक्षम", currencySet: "मुद्रा सेट की गई:",
        paymentSet: "डिफ़ॉल्ट भुगतान:", minDepositSet: "न्यूनतम जमा अलर्ट: ₹", enterChatId: "अपनी टेलीग्राम चैट आईडी दर्ज करें",
        nameRequired: "कृपया एक नाम दर्ज करें", nameUpdated: "डिस्प्ले नाम अपडेट हो गया!", notAuth: "प्रमाणित नहीं",
        resetSent: "रीसेट लिंक भेजा गया:", noEmail: "कोई ईमेल रिकॉर्ड नहीं", exported: "खाता डेटा निर्यात हो गया!",
        exportFailed: "निर्यात विफल", noData: "कोई डेटा नहीं मिला", cacheCleared: "कैश साफ़ हो गया",
        linkCopied: "रेफरल लिंक कॉपी हो गया!", loadingLink: "रेफरल लिंक लोड हो रहा है...", nameSaving: "सेव हो रहा है...",
        err: "त्रुटि:", myKeys: "मेरी कुंजियां", noKeys: "अभी तक कोई कुंजी नहीं खरीदी", hwidReset: "HWID रीसेट",
        enterKey: "अपनी लाइसेंस कुंजी दर्ज करें", keyCopied: "कुंजी कॉपी हो गई!", failedCopy: "कॉपी विफल",
        noHistory: "कोई रीसेट इतिहास नहीं", login: "लॉगिन", signUp: "साइन अप", emailOrUser: "ईमेल या उपयोगकर्ता नाम",
        enterPassword: "पासवर्ड दर्ज करें", rememberMe: "मुझे याद रखें", forgotPassword: "पासवर्ड भूल गए?",
        orContinue: "या इसके साथ जारी रखें", continueGoogle: "Google से जारी रखें", fullName: "पूरा नाम",
        username: "उपयोगकर्ता नाम", emailAddress: "ईमेल पता", createPassword: "पासवर्ड बनाएं", confirmPassword: "पासवर्ड की पुष्टि करें",
        agreeTerms: "मैं नियमों और शर्तों से सहमत हूं", createAccount: "खाता बनाएं", pleaseWait: "कृपया प्रतीक्षा करें...",
        secureAuth: "सुरक्षित प्रमाणीकरण"
    }
};

window.currentLang = localStorage.getItem("nexus_lang") || "en";
window.currencyCode = localStorage.getItem("nexus_currency") || "INR";
window.currencySymbol = window.currencyCode === "USD" ? "$" : "₹";
window.usdtRate = parseFloat(localStorage.getItem("nexus_usdt_rate")) || 88;

window.setUsdtRate = function(e) {
    window.usdtRate = parseFloat(e) || 88;
    try { localStorage.setItem("nexus_usdt_rate", e.toString()); } catch (e) {}
};

window.formatPrice = function(e) {
    const t = parseFloat(e) || 0;
    return window.currencyCode === "USD" ? "$" + (t / window.usdtRate).toFixed(2) + " USDT" : "₹" + t.toFixed(2);
};

window.formatPriceShort = function(e) {
    const t = parseFloat(e) || 0;
    return window.currencyCode === "USD" ? "$" + (t / window.usdtRate).toFixed(2) : "₹" + t.toFixed(2);
};

window.formatPriceCompact = function(e) {
    const t = parseFloat(e) || 0;
    return window.currencyCode === "USD" ? "$" + (t / window.usdtRate).toFixed(2) : t >= 1e7 ? "₹" + (t / 1e7).toFixed(2) + " CR" : t >= 1e5 ? "₹" + (t / 1e5).toFixed(2) + " L" : "₹" + t.toFixed(2);
};

window.applyCurrency = function(e) {
    window.currencyCode = e;
    window.currencySymbol = { INR: "₹", USD: "$" }[e] || "₹";
    try { localStorage.setItem("nexus_currency", e); } catch (e) {}
    document.querySelectorAll("[data-inr]").forEach(el => {
        const t = parseFloat(el.getAttribute("data-inr"));
        if (!isNaN(t)) {
            el.textContent = window.formatPriceShort ? window.formatPriceShort(t) : "₹" + t.toFixed(2);
            if (window.autoFitText) window.autoFitText(el);
        }
    });
};

window.autoFitText = function(e) {
    if (!e) return;
    const t = e.parentElement || e;
    e.style.whiteSpace = "nowrap";
    e.style.maxWidth = "100%";
    let o = parseFloat(window.getComputedStyle(e).fontSize);
    if (e.scrollWidth > t.clientWidth) {
        while (e.scrollWidth > t.clientWidth && o > 6) {
            o -= 0.5;
            e.style.fontSize = o + "px";
        }
    }
};

window.escapeHtml = function(e) {
    if (!e) return "";
    const t = document.createElement("div");
    t.textContent = e;
    return t.innerHTML;
};

window.applyTheme = function(e) {
    if (e === "light") {
        document.documentElement.classList.add("light-mode");
    } else {
        document.documentElement.classList.remove("light-mode");
    }
};

window.applyLanguage = function(e) {
    e = e || window.currentLang || "en";
    window.currentLang = e;
    try { localStorage.setItem("nexus_lang", e); } catch (e) {}
    const t = window.i18n[e] || window.i18n.en;
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (t[key]) {
            if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                if (el.getAttribute("data-i18n-type") === "placeholder") el.placeholder = t[key];
            } else {
                el.textContent = t[key];
            }
        }
    });
};

function initLangAndTheme() {
    if (window.currentLang && window.currentLang !== "en") window.applyLanguage(window.currentLang);
    if (localStorage.getItem("nexus_theme") === "light") window.applyTheme("light");
    const cur = localStorage.getItem("nexus_currency");
    if (cur && cur !== window.currencyCode && window.applyCurrency) {
        window.applyCurrency(cur);
    }
}
if (document.readyState !== 'loading') {
    initLangAndTheme();
} else {
    document.addEventListener("DOMContentLoaded", initLangAndTheme);
}

// --- 2. ANTI-INSPECTION SECURITY SHIELD ---
document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.shiftKey && ("I" === e.key || "J" === e.key) || e.ctrlKey && "U" === e.key) {
        return e.preventDefault(), false;
    }
});
document.addEventListener("dragstart", e => e.preventDefault());
document.addEventListener("selectstart", e => {
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
    }
});

// --- 3. WEB AUDIO SYNTHESIZER (NexusAudio) ---
class NexusAudioEngine {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('nexus_sfx_muted') === 'true';
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    }

    isMuted() { return this.muted; }
    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('nexus_sfx_muted', this.muted);
        return this.muted;
    }

    playClick() {
        if (this.muted) return;
        try {
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.04);
        } catch (e) {}
    }

    playCopy() {
        if (this.muted) return;
        try {
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            [880, 1760].forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.06);
                gain.gain.setValueAtTime(0.15, now + i * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.05);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + i * 0.06);
                osc.stop(now + i * 0.06 + 0.05);
            });
        } catch (e) {}
    }

    playSuccess() {
        if (this.muted) return;
        try {
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + i * 0.09);
                gain.gain.setValueAtTime(0.18, now + i * 0.09);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.25);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + i * 0.09);
                osc.stop(now + i * 0.09 + 0.25);
            });
        } catch (e) {}
    }

    playError() {
        if (this.muted) return;
        try {
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.linearRampToValueAtTime(110, now + 0.15);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
        } catch (e) {}
    }
}

const audioInstance = new NexusAudioEngine();
document.addEventListener('pointerdown', () => audioInstance.init(), { once: true });
document.addEventListener('keydown', () => audioInstance.init(), { once: true });
window.NexusAudio = audioInstance;

// --- 4. TELEGRAM NOTIFICATION DISPATCHER ---
let telegramConfigCache = null;
let lastFetchTime = 0;

async function getTelegramConfig() {
    const now = Date.now();
    if (telegramConfigCache && (now - lastFetchTime < 60000)) {
        return telegramConfigCache;
    }
    try {
        const snap = await get(ref(db, "settings/telegram"));
        if (snap.exists()) {
            telegramConfigCache = snap.val();
            lastFetchTime = now;
            return telegramConfigCache;
        }
    } catch (e) {
        console.warn("[TELEGRAM] Could not read config:", e);
    }
    return null;
}

export async function sendTelegramAlert(text) {
    try {
        const config = await getTelegramConfig();
        if (!config || !config.bot_token || !config.chat_id) return;
        if (config.enabled === false || config.enabled === "false") return;

        const url = `https://api.telegram.org/bot${config.bot_token}/sendMessage`;
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: config.chat_id,
                text: text,
                parse_mode: "HTML"
            })
        });
    } catch (err) {
        console.warn("[TELEGRAM] Alert dispatch error:", err);
    }
}
window.sendTelegramAlert = sendTelegramAlert;

// --- 5. UNIVERSAL COMPONENT CONTROLLERS ---
window.toggleNexusMenu = function() {
    const menu = document.getElementById('nexusDropdownMenu');
    if (menu) menu.classList.toggle('active');
};

window.openNotificationPopup = function() {
    const overlay = document.getElementById('notifOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        if (typeof window.loadAllNotifications === 'function') {
            window.loadAllNotifications();
        }
    }
};

window.closeNotifPopup = function(e) {
    const overlay = document.getElementById('notifOverlay');
    if (overlay) overlay.style.display = 'none';
};

document.addEventListener('click', function(e) {
    const menu = document.getElementById('nexusDropdownMenu');
    const toggleBtn = document.getElementById('headerMenuToggleBtn');
    if (menu && menu.classList.contains('active')) {
        if (!menu.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
            menu.classList.remove('active');
        }
    }
});

(function() {
    document.querySelectorAll(".nav-item, .nav-center").forEach(function(b) {
        b.addEventListener("click", function(e) {
            var r = document.createElement("span");
            r.className = "ripple-effect";
            var rect = this.getBoundingClientRect(), size = Math.max(rect.width, rect.height);
            r.style.cssText = "width:"+size+"px;height:"+size+"px;left:"+(e.clientX-rect.left-size/2)+"px;top:"+(e.clientY-rect.top-size/2)+"px";
            this.appendChild(r);
            setTimeout(function(){ r.remove(); }, 500);
            if (navigator.vibrate) navigator.vibrate(20);
        });
    });

    var bar = document.getElementById("bottomNav"); /* Bottom nav permanently visible */

    window.updateCartBadge = function(n) {
        var b = document.getElementById("cartBadge");
        if (b) { b.textContent = n; b.style.display = n > 0 ? "flex" : "none"; }
    };
})();

// Realtime Auth & Database Synchronization
onAuthStateChanged(auth, async (user) => {
    const li = document.querySelector('.auth-ui-logged-in');
    const lo = document.querySelector('.auth-ui-logged-out');

    if (user) {
        if (li) li.style.display = 'flex';
        if (lo) lo.style.display = 'none';

        // Live Balance Sync
        const userRef = ref(db, 'users/' + user.uid);
        onValue(userRef, (snap) => {
            if (snap.exists()) {
                const el = document.getElementById('headerLiveBalance');
                if (el) {
                    const b = parseFloat(snap.val().balance || 0);
                    el.setAttribute('data-inr', b);
                    el.textContent = '₹' + b.toFixed(2);
                }
            }
        });

        // Unread Notifications Count
        onValue(ref(db, 'notifications/' + user.uid), async (snap) => {
            const data = snap.val() || {};
            const items = Object.values(data);
            let unread = items.filter(n => !n.read).length;
            try {
                const gSnap = await get(ref(db, 'global_alerts/promotions'));
                if (gSnap.exists()) {
                    const seen = JSON.parse(localStorage.getItem('nexus_seen_global_' + user.uid)) || [];
                    Object.keys(gSnap.val()).forEach(id => { if (!seen.includes(id)) unread++; });
                }
            } catch(_) {}
            const badge = document.getElementById('notifBadge');
            if (badge) {
                badge.textContent = unread;
                badge.style.display = unread > 0 ? 'flex' : 'none';
            }
        });

        // User Dropdown Info
        const alias = (user.email || 'User').split('@')[0];
        const ddEmail = document.getElementById('ddEmail');
        const ddName = document.getElementById('ddName');
        const ddAvatar = document.getElementById('ddAvatar');
        if (ddEmail) ddEmail.innerText = user.email || '';
        if (ddName) ddName.innerText = alias;
        if (ddAvatar) ddAvatar.innerText = alias.charAt(0).toUpperCase();

        try {
            const snap = await get(ref(db, 'users/' + user.uid));
            if (snap.exists()) {
                const data = snap.val();
                const uname = data.username || data.name || alias;
                if (ddName) ddName.innerText = uname;
                if (ddAvatar) ddAvatar.innerText = uname.charAt(0).toUpperCase();
                if (data.role === 'admin') {
                    const link = document.getElementById('adminPanelLink');
                    if (link) link.style.display = '';
                }
            }
        } catch(e) {}

        // Notification List Loader
        window.loadAllNotifications = async function() {
            const list = document.getElementById('notifPopupList');
            if (!list) return;
            list.innerHTML = '<div style="text-align:center;padding:40px;color:rgba(255,255,255,0.15);font-size:12px;">Loading...</div>';

            const all = [];
            const CUTOFF_DAYS = 7;
            const cutoff = Date.now() - CUTOFF_DAYS * 24 * 60 * 60 * 1000;

            const snap = await get(ref(db, 'notifications/' + user.uid));
            if (snap.exists()) {
                const deletes = {};
                Object.entries(snap.val()).forEach(([id, n]) => {
                    const ts = n.createdAt || 0;
                    if (ts > 0 && ts < cutoff) {
                        deletes['' + id] = null;
                    } else {
                        all.push({ id, ...n });
                    }
                });
                if (Object.keys(deletes).length) await update(ref(db, 'notifications/' + user.uid), deletes);
            }

            const seenKey = 'nexus_seen_global_' + user.uid;
            let seen = [];
            try { seen = JSON.parse(localStorage.getItem(seenKey)) || []; } catch (_) {}
            try {
                const gSnap = await get(ref(db, 'global_alerts/promotions'));
                if (gSnap.exists()) {
                    Object.entries(gSnap.val()).forEach(([id, n]) => {
                        if (!seen.includes(id)) {
                            all.push({ id: 'g_' + id, type: 'promotion', title: n.title || 'New Promotion', message: n.message || '', link: n.link || '#', createdAt: n.createdAt, read: false });
                            seen.push(id);
                        }
                    });
                    localStorage.setItem(seenKey, JSON.stringify(seen));
                }
            } catch (_) {}

            try {
                const wKey = 'nexus_welcome_' + user.uid;
                if (localStorage.getItem(wKey) === '1') {
                    all.push({ id: 'welcome', type: 'welcome', title: 'Welcome to ' + (window.siteName || 'Nexus') + '!', message: 'Your account has been created successfully. Start exploring our panels!', link: './shop.html', createdAt: Date.now(), read: false });
                }
            } catch (_) {}

            const icons = { reply:'fa-reply', deposit:'fa-coins', info:'fa-info-circle', promotion:'fa-tags', welcome:'fa-star' };
            const cls = { reply:'reply', deposit:'deposit', info:'info', promotion:'promotion', welcome:'welcome' };

            if (!all.length) {
                list.innerHTML = '<div style="text-align:center;padding:40px;color:rgba(255,255,255,0.15);font-size:12px;">No notifications yet</div>';
                return;
            }
            all.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            list.innerHTML = all.map(n => {
                const time = n.createdAt ? new Date(n.createdAt).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) : '';
                const link = n.link || '#';
                const clickHandler = link !== '#' ? `onclick="window.closeNotifPopup();setTimeout(()=>window.location.href='${link}',200)"` : '';
                return `<div class="notif-popup-item${n.read ? '' : ' unread'} ${link !== '#' ? 'notif-clickable' : ''}" ${clickHandler}>
                    <div class="notif-popup-icon ${cls[n.type] || 'info'}"><i class="fas ${icons[n.type] || 'fa-info-circle'}"></i></div>
                    <div class="notif-popup-content">
                        <div class="notif-popup-title-text">${n.title}</div>
                        <div class="notif-popup-msg">${n.message}</div>
                        <div class="notif-popup-time">${time}</div>
                    </div>
                </div>`;
            }).join('');
        };

        window.markAllRead = async function() {
            await set(ref(db, 'notifications/' + user.uid), null);
            try { localStorage.removeItem('nexus_welcome_' + user.uid); } catch (_) {}
            if (typeof window.loadAllNotifications === 'function') window.loadAllNotifications();
        };

    } else {
        if (li) li.style.display = 'none';
        if (lo) lo.style.display = 'flex';
    }
});

const logoutBtn = document.getElementById('ddLogoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Terminating...';
        logoutBtn.style.pointerEvents = 'none';
        try {
            await signOut(auth);
            window.location.href = './login.html?tab=login'; 
        } catch (error) {
            console.error("Logout Error:", error);
            logoutBtn.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i> Error';
            logoutBtn.style.pointerEvents = 'auto';
        }
    });
}

window.showToast = function(msg, type = 'success') {
    let c = document.getElementById('toastContainer') || document.getElementById('toastBox') || document.getElementById('homeToastContainer');
    if (!c) {
        c = document.createElement('div');
        c.id = 'toastContainer';
        c.style.cssText = 'position:fixed;top:80px;right:15px;z-index:99999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
        document.body.appendChild(c);
    }
    const t = document.createElement('div');
    t.className = 'toast-msg ' + type;
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-triangle-exclamation' };
    const iconClass = icons[type] || 'fa-info-circle';
    t.innerHTML = `<i class="fas ${iconClass}"></i> <span>${msg}</span>`;
    c.appendChild(t);
    setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateX(30px)';
        setTimeout(() => t.remove(), 300);
    }, 2800);
};

export { audioInstance as NexusAudio };

// Service Worker Cleanup (sw.js removed completely)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        for (const registration of registrations) registration.unregister();
    }).catch(() => {});
}
if ('caches' in window) {
    caches.keys().then(keys => {
        for (const key of keys) caches.delete(key);
    }).catch(() => {});
}


/* ==========================================================================
   PAGE-SPECIFIC ENGINE: WALLET.JS
   ========================================================================== */
const initWalletEngine = () => {
    console.log("[SYSTEM] Wallet Engine Booted.");
    let t = null,
        e = null,
        a = null,
        isLoggedIn = !!auth.currentUser,
        paymentMethodsReady = false;
    const updateDepositAccess = loggedIn => {
        const tabs = document.getElementById("paymentTabsContainer");
        const lock = document.getElementById("noPaymentMsg");
        if (!tabs || !lock) return;
        const unlocked = !!loggedIn;
        tabs.style.display = unlocked ? "" : "none";
        lock.classList.toggle("hidden", unlocked);
    };
    const syncDepositAccess = () => {
        const loggedIn = !!auth.currentUser;
        if (loggedIn === isLoggedIn) return;
        isLoggedIn = loggedIn;
        updateDepositAccess(loggedIn);
    };
    updateDepositAccess(isLoggedIn);
    syncDepositAccess();
    window.addEventListener('focus', syncDepositAccess, { passive: true });
    document.addEventListener('visibilitychange', syncDepositAccess, { passive: true });
    setTimeout(syncDepositAccess, 500);
    setTimeout(syncDepositAccess, 2000);
    window.ZAP_KEY = "", onAuthStateChanged(auth, a => {
            if (a) {
                isLoggedIn = true;
                t = a.uid, e = a.email;
                updateDepositAccess(true);
                const o = document.getElementById("walletUid");
                o && (o.innerText = a.uid.substring(0, 10).toUpperCase());
                const s = ref(db, `users/${a.uid}`);
                onValue(s, t => {
                        if (t.exists()) {
                            const e = parseFloat(t.val().balance || 0),
                                a = document.getElementById("mainBalance");
                            a && (a.innerText = window.formatPriceShort ? window.formatPriceShort(e) : "₹" + e.toFixed(2), a.setAttribute("data-inr", e));
                            const n = document.getElementById("statBalance");
                            n && (n.innerText = window.formatPriceCompact ? window.formatPriceCompact(e) : "₹" + e.toFixed(2), n.setAttribute("data-inr", e));
                            saveCachedBalance(e);
                        }
                    }),
                    function(t) {
                        const e = document.getElementById("transactionList");
                        if (!e) return;
                        const a = ref(db, `transactions/${t}`);
                        onValue(a, t => {
                            if (e.innerHTML = "", t.exists()) {
                                const a = t.val();
                                let n = Object.keys(a).map(t => ({
                                    id: t,
                                    ...a[t]
                                }));
                                n.sort((t, e) => new Date(e.date || 0).getTime() - new Date(t.date || 0).getTime()), n.forEach(t => {
                                    let a, n, o, s, r;
                                    const i = new Date(t.date),
                                        c = `${i.getDate()}/${i.getMonth()+1}/${i.getFullYear()}`;
                                    t.type && t.type.includes("deposit") ? (a = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", n = '<i class="fas fa-arrow-down"></i>', o = "+", s = "text-emerald-400") : "purchase" === t.type ? (a = "bg-rose-500/10 border-rose-500/20 text-rose-500", n = '<i class="fas fa-shopping-cart"></i>', o = "-", s = "text-rose-500") : (a = "bg-blue-500/10 border-blue-500/20 text-blue-400", n = '<i class="fas fa-circle"></i>', o = "", s = "text-blue-400"), r = "success" === t.status ? "text-emerald-400" : "pending" === t.status ? "text-yellow-400" : "text-rose-500";
                                    const d = `\n                        <div class="bg-white/5 border border-white/5 rounded-xl p-3 flex justify-between items-center hover:bg-white/10 transition">\n                            <div class="flex items-center space-x-3">\n                                <div class="w-8 h-8 rounded-lg flex items-center justify-center border ${a}">${n}</div>\n                                <div>\n                                    <h4 class="text-[11px] font-black text-white uppercase tracking-tight">${t.desc||t.type||"Transaction"}</h4>\n                                    <p class="text-[9px] text-gray-500 font-mono tracking-widest">${c} • <span class="${r}">${t.status}</span></p>\n                                </div>\n                            </div>\n                            <div class="text-right">\n                                <span class="${s} font-black text-sm drop-shadow-md">${o}${t.amount?"₹"+parseFloat(t.amount).toFixed(2):""}</span>\n                            </div>\n                        </div>`;
                                    e.insertAdjacentHTML("beforeend", d)
                                })
                            } else e.innerHTML = '\n                    <div class="flex flex-col items-center justify-center py-6 opacity-40">\n                        <i class="fas fa-ghost text-2xl text-gray-600 mb-2"></i>\n                        <p class="text-[9px] font-mono uppercase tracking-widest text-gray-500">No transactions found</p>\n                    </div>'
                        })
                    }(a.uid), n = a.uid, onValue(ref(db, `transactions/${n}`), t => {
                        let e = 0,
                            a = 0,
                            n = 0;
                        const o = new Date;
                        o.setHours(0, 0, 0, 0), t.exists() && t.forEach(t => {
                            const s = t.val();
                            if (s.type && s.type.includes("deposit")) {
                                const t = parseFloat(s.amount || 0);
                                "success" === s.status ? (a += t, new Date(s.date) >= o && (e += t)) : "pending" === s.status && (n += t)
                            }
                        }), ["statToday", "statTotal", "statPending"].forEach((t, o) => {
                            const s = document.getElementById(t);
                            if (s) {
                                const t = [e, a, n][o];
                                s.setAttribute("data-inr", t), s.textContent = window.formatPriceCompact ? window.formatPriceCompact(t) : "₹" + t.toFixed(2)
                            }
                        })
                    })
            } else {isLoggedIn = false; updateDepositAccess(false); var n;(document.getElementById("walletUid")&&(document.getElementById("walletUid").innerText="GUEST"),document.getElementById("mainBalance")&&(document.getElementById("mainBalance").innerText="₹0.00"),document.getElementById("statBalance")&&(document.getElementById("statBalance").innerText="₹0.00"),["statToday","statTotal","statPending"].forEach(t=>{const e=document.getElementById(t);e&&(e.textContent="₹0.00")}),document.getElementById("paymentTabsContainer")&&(document.getElementById("paymentTabsContainer").style.display="none"),document.getElementById("noPaymentMsg")&&document.getElementById("noPaymentMsg").classList.remove("hidden"));const e=document.getElementById("transactionList");e&&(e.innerHTML='\n        <div class="flex flex-col items-center justify-center py-10 opacity-60">\n            <div class="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">\n                <i class="fas fa-lock text-2xl text-rose-500/40"></i>\n            </div>\n            <p class="text-[11px] font-mono tracking-widest text-gray-500 mb-3">Login to view your wallet</p>\n            <button onclick="window.location.href=\'./login.html?tab=login\'" class="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 rounded-xl font-black text-[10px] uppercase tracking-wider text-white">LOGIN NOW</button>\n        </div>')}
        }),
        function() {
            let t = {
                auto: !1,
                manual: !1,
                crypto: !1
            };

            function e() {
                const hasConfiguredMethod = t.auto || t.manual || t.crypto;
                const loggedIn = isLoggedIn;
                paymentMethodsReady = !!hasConfiguredMethod;
                updateDepositAccess(loggedIn);
                ["auto", "manual", "crypto"].forEach(method => {
                    const tab = document.getElementById(`tab-${method}`),
                        content = document.getElementById(`content-${method}`),
                        enabled = t[method] || (loggedIn && !hasConfiguredMethod);
                    enabled ? tab && (tab.style.display = "") : (tab && (tab.style.display = "none"), content && (content.classList.add("hidden"), content.classList.remove("active-content")))
                });
                const a = document.querySelector(".payment-tab.active-tab");
                if (!a || "none" === a.style.display) {
                    const t = document.querySelector('.payment-tab:not([style*="display: none"])');
                    t && window.switchTab(t.id.replace("tab-", ""))
                }
            }
            onValue(ref(db, "zap_config"), a => {
                if (a.exists()) {
                    const e = a.val();
                    window.ZAP_KEY = e.api_key || window.ZAP_KEY || "", window.ZAP_KEY && (t.auto = !0)
                }
                e()
            }), onValue(ref(db, "payment_config"), a => {
                if (a.exists()) {
                    const e = a.val();
                    t.manual = !!e.upiId, t.crypto = !!e.binance_pay_id || !!e.usdt_address, !t.auto && e.zap_key && (t.auto = !0, window.ZAP_KEY = e.zap_key);
                    const n = e.upiId || "Not Set";
                    document.getElementById("manualUPIID").innerText = n;
                    const o = document.getElementById("manualQRImage");
                    e.qrImage ? o.src = e.qrImage : o.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${n}&pn=Store`;
                    const s = e.crypto_rate || "88.00";
                    document.getElementById("cryptoRate").innerText = s, window.setUsdtRate && window.setUsdtRate(s), document.getElementById("cryptoPayID").innerText = e.binance_pay_id || "Not Set", document.getElementById("cryptoAddress").innerText = e.usdt_address || "Not Set";
                    const r = document.getElementById("cryptoQRImage");
                    e.crypto_qr && (r.src = e.crypto_qr)
                }
                e()
            })
        }(), window.switchTab = function(t) {
            document.querySelectorAll(".payment-tab").forEach(t => t.classList.remove("active-tab")), document.querySelectorAll(".tab-content").forEach(t => {
                t.classList.remove("active-content"), t.classList.add("hidden")
            });
            const e = document.getElementById(`tab-${t}`),
                a = document.getElementById(`content-${t}`);
            e && e.classList.add("active-tab"), a && (a.classList.remove("hidden"), a.classList.add("active-content")), navigator.vibrate && navigator.vibrate(10)
        };

        window.copyUPI = function() {
            const el = document.getElementById("manualUPIID");
            if (!el) return;
            const text = el.innerText.trim();
            if (!text || text === "Loading...") return;
            NexusAudio.playCopy();
            navigator.clipboard.writeText(text).then(() => r("UPI ID copied!", "success")).catch(() => {
                const ta = document.createElement("textarea");
                ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
                document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
                r("UPI ID copied!", "success");
            });
        };

        window.setManualAmt = function(amt) {
            NexusAudio.playClick();
            const input = document.getElementById("manualAmount");
            if (input) input.value = amt;
        };

        window.launchUPIApp = function(app) {
            NexusAudio.playClick();
            const upiEl = document.getElementById("manualUPIID");
            const amtEl = document.getElementById("manualAmount");
            const upiId = upiEl ? upiEl.innerText.trim() : "";
            if (!upiId || upiId === "Loading..." || upiId === "Not Set") {
                return r("Manual UPI is currently not set by Admin", "error");
            }
            const amt = amtEl ? parseFloat(amtEl.value) || 100 : 100;
            if (amtEl && !amtEl.value) amtEl.value = amt;

            const note = encodeURIComponent("Nexus Wallet Deposit");
            const pn = encodeURIComponent("Nexus Store");
            const genericUpi = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${pn}&am=${amt.toFixed(2)}&cu=INR&tn=${note}`;

            if (app === "phonepe") {
                window.location.href = `phonepe://pay?pa=${encodeURIComponent(upiId)}&pn=${pn}&am=${amt.toFixed(2)}&cu=INR&tn=${note}`;
                setTimeout(() => { window.location.href = genericUpi; }, 1200);
            } else if (app === "paytm") {
                window.location.href = `paytmmp://pay?pa=${encodeURIComponent(upiId)}&pn=${pn}&am=${amt.toFixed(2)}&cu=INR&tn=${note}`;
                setTimeout(() => { window.location.href = genericUpi; }, 1200);
            } else {
                window.location.href = genericUpi;
            }
        };
    const n = document.getElementById("manualDepositForm");

    function o(e) {
        a && clearInterval(a), localStorage.getItem("pending_zap_order") || (localStorage.setItem("pending_zap_order", e), localStorage.setItem("pending_zap_time", Date.now())), a = setInterval(() => {
            const n = localStorage.getItem("pending_zap_time") || Date.now();
            if (Date.now() - parseInt(n) > 3e5) return clearInterval(a), localStorage.removeItem("pending_zap_order"), void localStorage.removeItem("pending_zap_time");
            window.ZAP_KEY && ZapUPI.orderStatus({
                zap_key: window.ZAP_KEY,
                order_id: e
            }, {
                onResponse: async function(n, o) {
                    o && o.data && ("Success" === o.data.status ? (clearInterval(a), localStorage.removeItem("pending_zap_order"), localStorage.removeItem("pending_zap_time"), await async function(e, a) {
                        if (!t) return;
                        const n = parseFloat(a.amount),
                            o = ref(db, `transactions/${t}/${e}`);
                        (await runTransaction(o, t => {
                            if (t && "pending" === t.status) return t.status = "success", t.txn_id = a.txn_id, t.utr = a.utr, t
                        })).committed && (await runTransaction(ref(db, `users/${t}/balance`), t => (t || 0) + n), await update(ref(db, `gateway_payments/${e}`), {
                            status: "approved",
                            txn_id: a.txn_id,
                            utr: a.utr
                        }), await async function(t, e) {
                            try {
                                const a = await get(ref(db, `users/${t}/referredBy`));
                                if (!a.exists()) return;
                                const n = a.val(),
                                    o = .05 * e;
                                await runTransaction(ref(db, `users/${n}/referralClaimable`), t => (t || 0) + o);
                                const s = ref(db, `referrals/${n}/${t}`),
                                    r = await get(s),
                                    i = r.exists() ? r.val() : {};
                                await update(s, {
                                    deposited: parseFloat(i.deposited || 0) + e,
                                    commission: parseFloat(i.commission || 0) + o
                                }), console.log(`[REF] ₹${o} commission credited to ${n} for deposit by ${t}`)
                            } catch (t) {
                                console.error("[REF] Commission error:", t)
                            }
                        }(t, n), await push(ref(db, `notifications/${t}`), {
                            type: "deposit",
                            title: "Deposit Successful",
                            message: `₹${n} has been added to your wallet`,
                            link: "wallet.html",
                            read: !1,
                            createdAt: serverTimestamp()
                        }), r(`₹${n} added to wallet!`, "success"))
                    }(e, o.data)) : "Failed" === o.data.status && (clearInterval(a), localStorage.removeItem("pending_zap_order"), localStorage.removeItem("pending_zap_time"), await s(e, "failed"), r("Payment Failed. Order: " + e, "error")))
                },
                onError: function(t) {
                    console.log("Watcher poll error:", t)
                }
            })
        }, 5e3)
    }
    async function s(e, a) {
        try {
            await update(ref(db, `transactions/${t}/${e}`), {
                status: a
            }), await update(ref(db, `gateway_payments/${e}`), {
                status: a
            })
        } catch (t) {
            console.error("Status update error:", t)
        }
    }

    function r(t, e = "success") {
        const a = document.getElementById("toast-container");
        if (!a) return;
        const n = document.createElement("div");
        n.className = `toast ${e}`;
        const o = "success" === e ? "fa-check-circle" : "error" === e ? "fa-exclamation-circle" : "fa-exclamation-triangle";
        n.innerHTML = `<i class="fas ${o}"></i> <span>${t}</span>`, a.appendChild(n), setTimeout(() => {
            n.style.animation = "slideOutRight 0.3s forwards", setTimeout(() => n.remove(), 300)
        }, 3e3)
    }
    n && n.addEventListener("submit", async a => {
        a.preventDefault();
        const o = document.getElementById("manualAmount").value,
            s = document.getElementById("manualUtr").value.trim(),
            i = document.getElementById("submitManualBtn"),
            c = i.innerHTML;
        if (!t) return r("Auth Error", "error");
        if (!o || o <= 0) return r("Enter valid amount", "error");
        if (s.length < 12) return r("Enter correct 12-digit UTR", "error");
        i.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...', i.disabled = !0;
        try {
            const a = "MAN" + Date.now();
            await set(ref(db, `transactions/${t}/${a}`), {
                id: a,
                type: "deposit_manual",
                amount: parseFloat(o),
                utr: s,
                status: "pending",
                date: Date.now(),
                desc: "Manual UPI Deposit"
            }), await set(ref(db, `manual_deposits/${a}`), {
                uid: t,
                email: e,
                amount: parseFloat(o),
                utr: s,
                status: "pending",
                timestamp: serverTimestamp()
            });
            NexusAudio.playSuccess();
            r("Deposit submitted! Admin will verify UTR.", "success");
            sendTelegramAlert(`💸 <b>New Manual Deposit Request!</b>\n\n👤 <b>User:</b> ${e || t}\n💰 <b>Amount:</b> ₹${parseFloat(o).toFixed(2)}\n🧾 <b>UTR:</b> <code>${s}</code>\n🆔 <b>Ref:</b> <code>${a}</code>`);
            n.reset();
        } catch (t) {
            NexusAudio.playError();
            r("Network Error. Try again.", "error");
        } finally {
            i.innerHTML = c, i.disabled = !1;
        }
    }), document.getElementById("payAutoBtn").addEventListener("click", async () => {
        const a = document.getElementById("autoAmount").value,
            n = document.getElementById("autoPhone").value.trim(),
            s = document.getElementById("payAutoBtn");
        if (!window.ZAP_KEY) return r("Gateway offline. Contact Admin.", "error");
        if (!a || a <= 0) return r("Enter a valid deposit amount", "error");
        if (!n || n.length < 10) return r("Enter a valid Phone Number", "error");
        s.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> GENERATING...', s.disabled = !0;
        const i = "ORD" + Date.now();
        try {
            await set(ref(db, `transactions/${t}/${i}`), {
                id: i,
                type: "deposit_auto",
                amount: parseFloat(a),
                status: "pending",
                desc: "Gateway Deposit (ZapUPI)",
                date: (new Date).toISOString()
            }), await set(ref(db, `gateway_payments/${i}`), {
                uid: t,
                email: e,
                amount: parseFloat(a),
                phone: n,
                status: "pending",
                timestamp: serverTimestamp()
            }), ZapUPI.createOrder({
                zap_key: window.ZAP_KEY,
                order_id: i,
                amount: a,
                customer_mobile: n,
                remark: t + " | AutoDeposit"
            }, {
                onResponse: function(t, e, a) {
                    s.innerHTML = "Pay via UPI App", s.disabled = !1, o(i), ZapUPI.loadPayment(t)
                },
                onError: function(t) {
                    s.innerHTML = "Pay via UPI App", s.disabled = !1, r("ZapUPI Error: " + t, "error")
                }
            })
        } catch (t) {
            s.innerHTML = "Pay via UPI App", s.disabled = !1, r("System Error. Try again.", "error")
        }
    }), ZapUPI.setPaymentCallbacks({
        onSuccess: async function(t) {
            r("Payment Success! Processing funds...", "success"), localStorage.getItem("pending_zap_order") || o(t)
        },
        onFailed: async function(t) {
            r("Payment Failed. Order: " + t, "error"), await s(t, "failed")
        },
        onTimeout: async function(t) {
            r("Payment Timed Out. Order: " + t, "warning"), await s(t, "failed")
        }
    }), document.getElementById("cryptoPaidBtn").addEventListener("click", async () => {
        if (!t) return r("Auth Error", "error");
        const a = "CRY" + Date.now();
        ! function() {
            const t = document.getElementById("walletLoader");
            t && t.classList.remove("hidden")
        }();
        try {
            await set(ref(db, `transactions/${t}/${a}`), {
                id: a,
                type: "deposit_crypto",
                amount: 0,
                status: "pending",
                date: Date.now(),
                desc: "Crypto Deposit (Pending Verification)"
            }), await set(ref(db, `crypto_deposits/${a}`), {
                uid: t,
                email: e,
                status: "pending",
                timestamp: serverTimestamp()
            });
            NexusAudio.playSuccess();
            r("Crypto deposit request sent! Admin will verify.", "success");
            sendTelegramAlert(`🪙 <b>New Crypto Deposit Request!</b>\n\n👤 <b>User:</b> ${e || t}\n🆔 <b>Ref:</b> <code>${a}</code>\n⚠️ Please check Binance / TRC20 wallet & approve.`);
        } catch (t) {
            NexusAudio.playError();
            r("Error submitting request", "error")
        }! function() {
            const t = document.getElementById("walletLoader");
            t && t.classList.add("hidden")
        }()
    }), document.getElementById('addFundsBtn')?.addEventListener('click', function() {
        auth.currentUser ? document.getElementById('depositSection').scrollIntoView({behavior: 'smooth'}) : window.location.href = './login.html?tab=login'
    })
};
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initWalletEngine); else initWalletEngine();



