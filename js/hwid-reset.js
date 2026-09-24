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
    serverTimestamp
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
   PAGE-SPECIFIC ENGINE: HWID-RESET.JS
   ========================================================================== */
function showToast(msg, type = 'success') {
            const c = document.getElementById('toastContainer');
            const t = document.createElement('div');
            t.className = 'toast-msg ' + type;
            const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
            t.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> <span>${msg}</span>`;
            c.appendChild(t);
            setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(30px)'; setTimeout(() => t.remove(), 300); }, 2500);
        }

        async function loadHistory(uid) {
            const container = document.getElementById('hwidHistoryContainer');
            try {
                const snap = await get(ref(db, 'users/' + uid + '/hwidHistory'));
                if (!snap.exists()) {
                    container.innerHTML = '<div class="flex flex-col items-center justify-center py-10 opacity-60"><div class="w-12 h-12 rounded-2xl bg-purple-500/5 border border-purple-500/10 flex items-center justify-center text-purple-500/30 text-xl mb-3"><i class="fas fa-timeline"></i></div><p class="text-[10px] font-mono tracking-widest text-gray-500">No reset history</p></div>';
                    return;
                }
                const entries = Object.values(snap.val()).reverse().slice(0, 10);
                let html = '<div class="space-y-2">';
                entries.forEach((e) => {
                    const date = e.date ? new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';
                    const keyDisplay = e.key || 'N/A';
                    html += '<div class="flex items-center justify-between bg-black/30 border border-white/5 rounded-xl px-4 py-3 hover:border-emerald-500/20 transition">'
                        + '<div class="flex items-center gap-3 min-w-0">'
                        + '<div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs shrink-0"><i class="fas fa-check"></i></div>'
                        + '<div class="min-w-0">'
                        + '<div class="flex items-center gap-2">'
                        + '<span class="text-xs font-mono text-gray-200 truncate max-w-[200px] sm:max-w-xs blur-sm hover:blur-none cursor-pointer transition-all duration-200 select-all">' + keyDisplay + '</span>'
                        + '<span class="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">RESET</span>'
                        + '</div>'
                        + '<p class="text-[9px] text-gray-600 mt-0.5">' + date + '</p>'
                        + '</div></div>'
                        + '<button onclick="navigator.clipboard.writeText(\'' + keyDisplay.replace(/'/g, "\\'") + '\').then(()=>showToast(\'Key copied!\')).catch(()=>showToast(\'Failed to copy\',\'error\'))" class="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-emerald-400 hover:border-emerald-500/30 transition shrink-0 ml-2" title="Copy key"><i class="fas fa-copy text-[10px]"></i></button>'
                        + '</div>';
                });
                html += '</div>';
                container.innerHTML = html;
            } catch (e) { container.innerHTML = '<p class="text-xs text-gray-500 text-center py-6">Failed to load history</p>'; }
        }

        window.resetKeyHwid = async function() {
            const keyInput = document.getElementById('keyInput');
            const statusEl = document.getElementById('keyStatus');
            const resultContainer = document.getElementById('resetResultContainer');
            const btn = document.getElementById('hwidSubmitBtn');
            const licenseKey = keyInput.value.trim().toUpperCase();

            if (!licenseKey) { showToast('Enter your license key', 'error'); return; }

            resultContainer.innerHTML = '';
            statusEl.innerHTML = '<span class="text-purple-400">Checking key...</span>';
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
            btn.style.pointerEvents = 'none';

            try {
                const user = auth.currentUser;
                if (!user) { showToast('Not authenticated', 'error'); resetBtn(); return; }

                const snap = await get(ref(db, `purchases/${user.uid}`));
                if (!snap.exists()) {
                    statusEl.innerHTML = '<span class="text-rose-400">❌ Key not found in your account</span>';
                    showToast('No keys found in your account', 'error');
                    resetBtn(); return;
                }

                const data = snap.val();
                let foundId = null;

                for (const id in data) {
                    if (data[id].key === licenseKey) {
                        foundId = id;
                        break;
                    }
                }

                if (!foundId) {
                    statusEl.innerHTML = '<span class="text-rose-400">❌ Key not found in your purchases</span>';
                    showToast('Invalid key. This key does not exist in your account.', 'error');
                    resetBtn(); return;
                }

                await update(ref(db, `purchases/${user.uid}/${foundId}`), { hwid: '' });
                await push(ref(db, `users/${user.uid}/hwidHistory`), { hwid: 'RESET', key: licenseKey, date: Date.now() });
                keyInput.value = '';
                statusEl.innerHTML = '';
                const now = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                resultContainer.innerHTML = '<div class="premium-glass-card p-4 border-emerald-500/30 bg-emerald-500/5">'
                    + '<div class="flex items-center gap-3">'
                    + '<div class="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm shrink-0"><i class="fas fa-check-circle"></i></div>'
                    + '<div class="min-w-0">'
                    + '<p class="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-0.5">HWID Reset Successful</p>'
                    + '<p class="text-xs font-mono text-gray-200 truncate max-w-[250px] sm:max-w-sm select-all">' + licenseKey + '</p>'
                    + '<p class="text-[9px] text-gray-600 mt-0.5">' + now + '</p>'
                    + '</div></div></div>';
                showToast('HWID reset successfully for your key!');
                loadHistory(user.uid);
            } catch (e) {
                statusEl.innerHTML = '<span class="text-rose-400">❌ Error: ' + e.message + '</span>';
                showToast('Error: ' + e.message, 'error');
            }
            resetBtn();

            function resetBtn() {
                btn.innerHTML = '<i class="fas fa-sync-alt"></i> Reset HWID';
                btn.style.pointerEvents = 'auto';
            }
        };

onAuthStateChanged(auth, (user) => {
if (!user) return window.location.href = "./login.html?tab=login";
            loadHistory(user.uid);
        });
