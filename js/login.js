

// Firebase se sab import kar rahe hain
import {
    auth,
    db,
    googleProvider as e,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword as r,
    signInWithPopup as t,
    sendPasswordResetEmail as a,
    onAuthStateChanged,
    setPersistence as s,
    browserLocalPersistence as n,    // Tab close hone ke baad bhi login rahe
    browserSessionPersistence as o,  // Tab close hote hi logout
    ref,
    set,
    get,
    push,
    update,
    runTransaction,
    serverTimestamp
} from "./firebase.js";

console.log("[SYSTEM] Nexus Core Auth Engine Initialized.");

// --- HTML elements grab karna ---
const i = document.getElementById("loginTab"),
    c = document.getElementById("signupTab"),
    l = document.getElementById("loginForm"),
    d = document.getElementById("signupForm"),
    m = document.getElementById("loginEmail"),
    u = document.getElementById("loginPassword"),
    g = document.getElementById("loginBtn"),
    f = document.getElementById("signupName"),
    w = document.getElementById("signupUsername"),
    y = document.getElementById("signupEmail"),
    E = document.getElementById("signupPassword"),
    h = document.getElementById("signupConfirm"),
    p = document.getElementById("signupBtn"),
    v = document.getElementById("googleLogin"),
    L = document.getElementById("forgotPassword"),
    b = document.getElementById("rememberMe"),
    B = document.getElementById("loginEye"),
    I = document.getElementById("signupEye"),
    R = document.getElementById("confirmEye"),
    k = document.getElementById("loadingScreen"),
    C = document.getElementById("toastBox");

let P = !1,  // Login process chal raha hai? (double-submit rokna)
    S = !1,  // Signup process chal raha hai?
    T = null; // Current user

// --- Helper Functions ---

function $() { k && k.classList.add("active") }   // Loading screen dikhao
function x() { k && k.classList.remove("active") } // Loading screen chhupao

// Toast message (Success/Error/Warning)
function F(e, r = "success") {
    const t = document.createElement("div");
    t.className = `toast ${r}`;
    let a = "fa-circle-check";
    "error" === r && (a = "fa-circle-xmark"), "warning" === r && (a = "fa-triangle-exclamation"), t.innerHTML = `<i class="fa-solid ${a}"></i> ${e}`, C.appendChild(t), setTimeout(() => { t.remove() }, 3e3)
}

// Button disable/enable with loading text
function U(e, r, t = "Please Wait...") {
    r ? (e.disabled = !0, e.dataset.html = e.innerHTML, e.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${t}</span>`) : (e.disabled = !1, e.dataset.html && (e.innerHTML = e.dataset.html))
}

function A(e) { return "" === e.trim() }  // Empty check

// Referral code from URL (?ref=CODE)
const M = new URLSearchParams(window.location.search).get("ref") || null;

// Password show/hide toggle
function toggleEye(e, r) {
    e && r && (e.onclick = () => {
        "password" === r.type ? (r.type = "text", e.innerHTML = '<i class="fa-solid fa-eye-slash"></i>') : (r.type = "password", e.innerHTML = '<i class="fa-solid fa-eye"></i>')
    })
}

console.log("[REF] Referral param:", M);

// --- Tab switching (Login <-> Signup) ---
i && c && (
    i.onclick = () => {
        i.classList.add("active"), c.classList.remove("active"), l.classList.add("active"), d.classList.remove("active")
    },
    c.onclick = () => {
        c.classList.add("active"), i.classList.remove("active"), d.classList.add("active"), l.classList.remove("active")
    },
    "register" === new URLSearchParams(window.location.search).get("tab") && c.click()
);

// --- Eye buttons attach karna ---
toggleEye(B, u), toggleEye(I, E), toggleEye(R, h);

// --- Remember Me - Saved email load karna (password kabhi save nahi hota) ---
const G = localStorage.getItem("nexusRememberEmail");
G && m && b && (m.value = G, u.value = "", b.checked = !0);

// --- Auth State Check (No auto-redirect so user can login/switch/register freely) ---
onAuthStateChanged(auth, e => {
    T = e;
    x(); // Hide loading screen and show login form
    if (e && e.email && m && !m.value) {
        m.value = e.email;
    }
});

// --- LOGIN FORM SUBMIT ---
l && l.addEventListener("submit", async e => {
    if (e.preventDefault(), P) return;
    let r = m.value.trim();
    const t = u.value;
    if (A(r)) return F("Enter Email or Username", "warning");
    if (A(t)) return F("Enter Password", "warning");

    // Agar username dala hai (without @) to pehle email find karo
    if (!r.includes("@")) try {
        const uidSnap = await get(ref(db, "usernames/" + r.toLowerCase()));
        if (!uidSnap.exists()) return F("Username not found", "error");
        const userSnap = await get(ref(db, "users/" + uidSnap.val()));
        if (!userSnap.exists()) return F("Username not found", "error");
        r = userSnap.val().email
    } catch (e) { return F("Login error. Try again.", "error") }

    try {
        P = !0, $(), U(g, !0, "Signing In...");
        const e = localStorage.getItem("nexus_autoLogin");
        await s(auth, "true" === e ? n : o);  // Remember me ke hisaab se persistence
        const a = await signInWithEmailAndPassword(auth, r, t);
        T = a.user, b && b.checked ? (localStorage.setItem("nexusRememberEmail", m.value.trim()), localStorage.removeItem("nexusRememberPass")) : (localStorage.removeItem("nexusRememberEmail"), localStorage.removeItem("nexusRememberPass")), F("Secure Login Successful!", "success"), setTimeout(() => { window.location.href = "./home.html" }, 1e3)
    } catch (e) {
        console.error("Login Error:", e), F(e.message.replace("Firebase: ", ""), "error"), x()
    } finally { P = !1, U(g, !1) }
});

// --- SIGNUP FORM SUBMIT ---
d && d.addEventListener("submit", async e => {
    if (e.preventDefault(), S) return;
    const t = f.value.trim(),
        a = w ? w.value.trim() : "",
        s = y.value.trim(),
        n = E.value,
        o = h.value,
        i = document.getElementById("agreeTerms");
    if (A(t)) return F("Enter Full Name", "warning");
    if (!a || a.length < 3) return F("Username must be at least 3 characters", "warning");
    if (!/^[a-zA-Z0-9_-]+$/.test(a)) return F("Username: letters, numbers, - and _ only", "warning");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return F("Invalid Email Format", "warning");
    if (!(n.length >= 6)) return F("Password minimum 6 characters", "warning");
    if (n !== o) return F("Passwords do not match", "warning");
    if (!i.checked) return F("Accept Terms & Conditions to proceed", "warning");

    try {
        S = !0, $(), U(p, !0, "Creating...");

        // Firebase me user create karo
        const i = (await r(auth, s, n)).user,
            c = { uid: i.uid, name: t, username: a, email: s, photo: "", role: "user", status: "active", createdAt: serverTimestamp() };

        // Check username availability (authenticated now)
        const usernameSnap = await get(ref(db, "usernames/" + a.toLowerCase()));
        if (usernameSnap.exists()) {
            try { await i.delete(); } catch(_) {}
            return F("Username already taken", "warning");
        }

        // Referral system - agar referral code hai to referrer ko bonus do
        if (M) try {
            const refSnap = await get(ref(db, "usernames/" + M.toLowerCase()));
            if (refSnap.exists()) {
                const refUid = refSnap.val();
                c.referredBy = refUid;
                const r = { email: s, date: Date.now(), deposited: 0, commission: 0, signupReward: 0 };
                await set(ref(db, `referrals/${refUid}/${i.uid}`), r);
                try {
                    const e = 5;
                    await runTransaction(ref(db, `users/${refUid}/referralClaimable`), r => (r || 0) + e), await update(ref(db, `referrals/${refUid}/${i.uid}`), { signupReward: e })
                } catch (e) { console.error("[REF] Bonus credit failed:", e) }
            }
        } catch (e) { console.error("[REF] Error processing referral:", e) }

        try {
            await set(ref(db, "users/" + i.uid), c);
            console.log("[SIGNUP] User data written to DB successfully");
        } catch (dbErr) {
            console.error("[SIGNUP] DB write failed for users node:", dbErr);
            F("Account created but profile save failed: " + dbErr.message, "error");
            x(); S = !1; U(p, !1); return;
        }

        try {
            await set(ref(db, "usernames/" + a.toLowerCase()), i.uid);
            console.log("[SIGNUP] Username reservation written successfully");
        } catch (unameErr) {
            console.error("[SIGNUP] DB write failed for usernames node:", unameErr);
            F("Profile saved but username reservation failed: " + unameErr.message, "warning");
        }

        try { localStorage.setItem("nexus_welcome_" + i.uid, "1") } catch (e) {}
        F("Account Created Successfully!", "success"), setTimeout(() => { window.location.href = "./home.html" }, 1e3)
    } catch (e) {
        console.error("Signup Error:", e), F(e.message.replace("Firebase: ", ""), "error"), x()
    } finally { S = !1, U(p, !1) }
});

// --- GOOGLE LOGIN ---
v && (v.onclick = async () => {
    try {
        $(), U(v, !0, "Connecting...");
        const r = (await t(auth, e)).user,
            a = ref(db, "users/" + r.uid);

        // Agar pehle se account hai to direct login
        if ((await get(a)).exists()) F("Google Login Successful!", "success"), setTimeout(() => window.location.href = "./home.html", 1e3);
        else {
            // Naya user - setup modal dikhao (username/display name choose)
            var googleUserData = { uid: r.uid, email: r.email, photo: r.photoURL || "" };
            x(), U(v, !1);
            const modal = document.getElementById("googleSetupModal"),
                nameInput = document.getElementById("setupName"),
                userInput = document.getElementById("setupUsername"),
                errDiv = document.getElementById("setupError"),
                submitBtn = document.getElementById("setupSubmitBtn");
            nameInput.value = r.displayName || "";
            userInput.value = (r.email || "").split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase() || "user" + Math.random().toString(36).slice(2, 6);
            modal.classList.remove("hidden");

            submitBtn.onclick = async function googleSetup() {
                const n = nameInput.value.trim(),
                    u = userInput.value.trim().toLowerCase();

                if (!n) return errDiv.classList.remove("hidden"), errDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Enter your display name';
                if (u.length < 3 || u.length > 20) return errDiv.classList.remove("hidden"), errDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Username must be 3-20 characters';
                if (!/^[a-zA-Z0-9_-]+$/.test(u)) return errDiv.classList.remove("hidden"), errDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Username: letters, numbers, - and _ only';

                submitBtn.disabled = !0;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Setting up...';
                errDiv.classList.add("hidden");

                try {
                    // Check username availability via usernames node
                    var usernameSnap = await get(ref(db, "usernames/" + u.toLowerCase()));
                    if (usernameSnap.exists()) {
                        return submitBtn.disabled = !1, submitBtn.innerHTML = '<i class="fas fa-rocket"></i> GET STARTED', errDiv.classList.remove("hidden"), errDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Username already taken';
                    }

                    var userObj = { uid: googleUserData.uid, name: n, username: u, email: googleUserData.email, photo: googleUserData.photo, role: "user", status: "active", createdAt: serverTimestamp() };

                    // Referral for Google signup
                    if (M) try {
                        var refUsernameSnap = await get(ref(db, "usernames/" + M.toLowerCase()));
                        if (refUsernameSnap.exists()) {
                            var refUid = refUsernameSnap.val();
                            userObj.referredBy = refUid;
                            await set(ref(db, "referrals/" + refUid + "/" + googleUserData.uid), { email: googleUserData.email, date: Date.now(), deposited: 0, commission: 0, signupReward: 0 });
                            try { await runTransaction(ref(db, "users/" + refUid + "/referralClaimable"), function(e) { return (e || 0) + 5 }); await update(ref(db, "referrals/" + refUid + "/" + googleUserData.uid), { signupReward: 5 }) } catch (e) {}
                        }
                    } catch (e) {}

                    try {
                        await set(a, userObj);
                        console.log("[GOOGLE SETUP] User data written to DB successfully");
                    } catch (dbErr) {
                        console.error("[GOOGLE SETUP] DB write failed for users node:", dbErr);
                        F("Account created but profile save failed: " + dbErr.message, "error");
                        submitBtn.disabled = !1;
                        submitBtn.innerHTML = '<i class="fas fa-rocket"></i> GET STARTED';
                        return;
                    }

                    try {
                        await set(ref(db, "usernames/" + u.toLowerCase()), googleUserData.uid);
                        console.log("[GOOGLE SETUP] Username reservation written successfully");
                    } catch (unameErr) {
                        console.error("[GOOGLE SETUP] DB write failed for usernames node:", unameErr);
                        F("Profile saved but username reservation failed: " + unameErr.message, "warning");
                    }

                    modal.classList.add("hidden");
                    F("Account Created!", "success");
                    setTimeout(function() { window.location.href = "./home.html" }, 800)
                } catch (e) {
                    console.error("Setup Error:", e), F(e.message.replace("Firebase: ", ""), "error");
                    submitBtn.disabled = !1;
                    submitBtn.innerHTML = '<i class="fas fa-rocket"></i> GET STARTED'
                }
            }
        }
    } catch (e) {
        console.error("Google Auth Error:", e), F(e.message.replace("Firebase: ", ""), "error"), x(), U(v, !1)
    }
});

// --- FORGOT PASSWORD ---
L && (L.onclick = async () => {
    const e = m.value.trim();
    if (A(e)) return F("Enter your email address above first.", "warning");
    try {
        $(), await a(auth, e), F("Password Reset Link sent to your email!", "success")
    } catch (e) {
        console.error("Reset Error:", e), F(e.message.replace("Firebase: ", ""), "error")
    } finally { x() }
});


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
