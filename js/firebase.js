import {
    initializeApp as e
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
    getAuth as s,
    GoogleAuthProvider as a,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword as t,
    sendPasswordResetEmail as i,
    signInWithPopup as r,
    setPersistence as c,
    browserLocalPersistence as p,
    browserSessionPersistence as o
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
    getDatabase as b,
    ref,
    onValue,
    get,
    push,
    set,
    update,
    remove,
    runTransaction,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
const n = e({
        apiKey: "AIzaSyAl1VxbJ4kV-JIeKNrzvE8ypDcYQawAR44",
        authDomain: "prince-1a57b.firebaseapp.com",
        databaseURL: "https://prince-1a57b-default-rtdb.firebaseio.com",
        projectId: "prince-1a57b",
        storageBucket: "prince-1a57b.firebasestorage.app",
        messagingSenderId: "239746744940",
        appId: "1:239746744940:web:3e5dc237ee70857a8f0e49",
        measurementId: "G-4FHFGCVVM5"
    }),
    auth = s(n),
    db = b(n),
    f = new a;
const ADMIN_UID = "PmgO7qHYasOdgQfkmai0YnpQIWB3";
const ADMIN_UIDS = ["PmgO7qHYasOdgQfkmai0YnpQIWB3", "rOlsx6LYYYXPYLkueN2UmviaB8O2"];
console.log("[SYSTEM] Firebase Engine 10.13.2 Running Seamlessly.");

// ============================================================================
// NEXUS PRO 120Hz / 144Hz / 240Hz HIGH REFRESH RATE & HARDWARE BOOSTER
// ============================================================================
(function initNexusFPS() {
    if (typeof window === 'undefined') return;

    // 1. Passive touch & wheel event listeners for 0-latency scrolling
    let scrollTimer = null;
    const body = document.body || document.documentElement;
    const htmlEl = document.documentElement;
    let lastScrollY = window.scrollY || 0;
    let lastScrollTs = performance.now();
    let fastTimer = null;
    let navHidden = false;
    let lastNavY = window.scrollY || 0;

    // High-velocity scroll => pause expensive CSS animations for zero jank
    const updateFastScroll = (y) => {
        const now = performance.now();
        const delta = Math.abs(y - lastScrollY);
        const dt = now - lastScrollTs;
        const velocity = dt > 0 ? (delta * 1000) / dt : 0;
        lastScrollY = y;
        lastScrollTs = now;
        if (velocity > 600) {
            htmlEl.classList.add('is-fast-scrolling');
            if (fastTimer) clearTimeout(fastTimer);
        } else {
            if (fastTimer) clearTimeout(fastTimer);
            fastTimer = setTimeout(() => {
                htmlEl.classList.remove('is-fast-scrolling');
            }, 150);
        }
    };

    const updateNavVisibility = () => {
        const nav = document.getElementById('bottomNav');
        if (!nav) return;
        const y = window.scrollY || 0;
        const shouldHide = y > 90 && y > lastNavY;
        if (shouldHide !== navHidden) {
            navHidden = shouldHide;
            if (navHidden) {
                nav.classList.add('nav-autohide');
            } else {
                nav.classList.remove('nav-autohide');
            }
        }
        lastNavY = y;
    };

    const onScroll = () => {
        if (!body.classList.contains('is-scrolling')) {
            body.classList.add('is-scrolling');
        }
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            body.classList.remove('is-scrolling');
        }, 60);
        const y = window.scrollY || 0;
        updateFastScroll(y);
        updateNavVisibility();
    };

    window.addEventListener('scroll', onScroll, { passive: true, capture: false });
    window.addEventListener('touchmove', () => {
        const y = window.scrollY || 0;
        updateFastScroll(y);
        updateNavVisibility();
    }, { passive: true, capture: false });
    window.addEventListener('touchstart', () => {}, { passive: true, capture: false });

    // 2. Continuous VSync Synchronization (120fps/144fps/240fps target)
    if (window.innerWidth >= 768 && window.requestAnimationFrame) {
        let lastFrameTime = performance.now();
        let frameCount = 0;
        let currentFPS = 60;

        const vsyncLoop = (now) => {
            frameCount++;
            if (now - lastFrameTime >= 1000) {
                currentFPS = Math.round((frameCount * 1000) / (now - lastFrameTime));
                frameCount = 0;
                lastFrameTime = now;
                window.__NEXUS_FPS = currentFPS;
            }
            requestAnimationFrame(vsyncLoop);
        };
        requestAnimationFrame(vsyncLoop);
    }

    // 3. Image Async Decoding & Lazy Loading for Zero Frame Drops
    const optimizeImages = () => {
        document.querySelectorAll('img').forEach(img => {
            img.setAttribute('decoding', 'async');
            if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
        });
    };

    // 4. Universal Floating Particle Background (all pages, works with bg photo)
    const initParticleBackground = () => {
        if (document.getElementById('particleCanvas')) return;
        const isMobile = window.innerWidth < 768 || (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);
        if (isMobile) return;
        const canvas = document.createElement('canvas');
        canvas.id = 'particleCanvas';
        document.querySelector('.premium-bg-container')?.after(canvas);
        if (!canvas.getContext) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let W = 0, H = 0;
        const particles = [];
        const resize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        // Perf-savvy particle counts; mobile = light, desktop = rich
        const COUNT = isMobile ? 34 : 120;
        for (let i = 0; i < COUNT; i++) {
            particles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                size: Math.random() * 2.2 + 1,
                speedX: (Math.random() - 0.5) * 0.35,
                speedY: (Math.random() - 0.5) * 0.35,
                opacity: Math.random() * 0.5 + 0.2,
                color: Math.random() < 0.7 ? '255,255,255' : (Math.random() < 0.5 ? '225,29,72' : '147,51,234')
            });
        }
        // Linking (O(n²)) is expensive — only on desktop, and capped
        const LINK_DIST = 110;
        const LINES = !isMobile;
        const perfLow = () => typeof window.__NEXUS_PERF_LOW === 'number' && window.__NEXUS_PERF_LOW < 30;
        const loop = () => {
            if (!perfLow()) {
                ctx.clearRect(0, 0, W, H);
                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    p.x += p.speedX;
                    p.y += p.speedY;
                    if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
                        p.x = Math.random() * W;
                        p.y = Math.random() * H;
                    }
                }
                if (LINES) {
                    for (let i = 0; i < particles.length; i++) {
                        for (let j = i + 1; j < particles.length; j++) {
                            const p1 = particles[i], p2 = particles[j];
                            const dx = p1.x - p2.x, dy = p1.y - p2.y;
                            const d = dx * dx + dy * dy;
                            if (d < LINK_DIST * LINK_DIST) {
                                ctx.beginPath();
                                ctx.moveTo(p1.x, p1.y);
                                ctx.lineTo(p2.x, p2.y);
                                ctx.strokeStyle = `rgba(225,29,72,${0.07 * (1 - Math.sqrt(d) / LINK_DIST)})`;
                                ctx.lineWidth = 0.6;
                                ctx.stroke();
                            }
                        }
                    }
                }
                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
                    ctx.fill();
                }
            }
            requestAnimationFrame(loop);
        };
        loop();
    };

    // 5. Perf governor DISABLED — no more perf-low black fallback.
    //    Store speed is handled by is-scrolling / is-fast-scrolling (no visual downgrade).
    const initPerfGovernor = () => {
        // intentionally a no-op: user wants the glass look always
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            optimizeImages();
            initParticleBackground();
            initPerfGovernor();
        });
    } else {
        optimizeImages();
        initParticleBackground();
        initPerfGovernor();
    }
})();

// ============================================================================
// INSTANT UI HYDRATION & SPECULATIVE PRELOADER (0ms Page & Data Transitions)
// ============================================================================
const saveCachedBalance = (balance) => {
    if (balance !== undefined && balance !== null) {
        localStorage.setItem('nexusUserBalance', balance);
    }
};

const saveCachedUser = (uid, email, name) => {
    if (uid) localStorage.setItem('nexusUserUid', uid);
    if (email) localStorage.setItem('nexusUserEmail', email);
    if (name) localStorage.setItem('nexusUserName', name);
};

const saveCachedPanels = (panels) => {
    try {
        if (Array.isArray(panels)) {
            localStorage.setItem('nexus_cached_panels', JSON.stringify(panels));
        }
    } catch (e) {}
};

const getCachedPanels = () => {
    try {
        const p = localStorage.getItem('nexus_cached_panels');
        return p ? JSON.parse(p) : null;
    } catch (e) {
        return null;
    }
};

(function initInstantPreloader() {
    if (typeof window === 'undefined') return;

    // 1. Instant 0ms UI Hydration from local cache
    const applyCachedData = () => {
        try {
            const cachedBalance = localStorage.getItem('nexusUserBalance');
            const cachedUid = localStorage.getItem('nexusUserUid');
            const cachedName = localStorage.getItem('nexusUserName');
            const cachedEmail = localStorage.getItem('nexusUserEmail');

            if (cachedBalance !== null) {
                const balNum = parseFloat(cachedBalance) || 0;
                const balStr = '₹' + balNum.toFixed(2);
                ['mainBalance', 'homeBalance', 'headerLiveBalance', 'statBalance'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.innerText = balStr;
                        el.setAttribute('data-inr', balNum);
                    }
                });
            }

            if (cachedUid) {
                const uidEl = document.getElementById('walletUid');
                if (uidEl) uidEl.innerText = cachedUid.substring(0, 10).toUpperCase();
            }

            if (cachedName) {
                const nameEl = document.getElementById('homeUserName');
                if (nameEl) nameEl.innerText = cachedName;
                const avatarEl = document.getElementById('homeAvatar');
                if (avatarEl) avatarEl.innerText = cachedName.charAt(0).toUpperCase();
            }

            if (cachedEmail) {
                const emailEl = document.getElementById('homeUserEmail');
                if (emailEl) emailEl.innerText = cachedEmail;
            }
        } catch (e) {}
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyCachedData);
    } else {
        applyCachedData();
    }

    // 2. Persistent Keep-Alive View Engine (0ms Instant SPA)
    const PAGE_CONFIG = {
        'home': { title: 'Nexus Core | Home', headerTitle: 'Home', icon: 'fa-biohazard' },
        'shop': { title: 'Nexus Core | Storefront', headerTitle: 'Store', icon: 'fa-cubes' },
        'wallet': { title: 'Nexus Core | Wallet', headerTitle: 'Wallet', icon: 'fa-wallet' },
        'profile': { title: 'Nexus Core | Profile', headerTitle: 'Profile', icon: 'fa-user-astronaut' },
        'helpdesk': { title: 'Nexus Core | Helpdesk', headerTitle: 'Helpdesk', icon: 'fa-headset' },
        'my-keys': { title: 'Nexus Core | My Keys', headerTitle: 'My Keys', icon: 'fa-key' },
        'hwid-reset': { title: 'Nexus Core | HWID Reset', headerTitle: 'HWID Reset', icon: 'fa-microchip' },
        'payment-settings': { title: 'Nexus Core | Payment Settings', headerTitle: 'Payment', icon: 'fa-credit-card' },
        'referrals': { title: 'Nexus Core | Referral Program', headerTitle: 'Referrals', icon: 'fa-users' },
        'user-settings': { title: 'Nexus Core | Settings', headerTitle: 'Settings', icon: 'fa-gear' }
    };

    function getSlugFromUrl(url = window.location.pathname) {
        const clean = url.split('?')[0].split('#')[0];
        const filename = clean.split('/').pop() || 'home.html';
        const slug = filename.replace('.html', '');
        return PAGE_CONFIG[slug] ? slug : 'home';
    }

    let currentSlug = getSlugFromUrl();
    const viewScrolls = {};

    function initViewsContainer() {
        if (window.location.pathname.includes('login.html')) return;

        let viewsContainer = document.getElementById('nexusViewsContainer');
        const mainEl = document.querySelector('main');
        if (!mainEl) return;

        if (!viewsContainer) {
            viewsContainer = document.createElement('div');
            viewsContainer.id = 'nexusViewsContainer';
            mainEl.parentNode.insertBefore(viewsContainer, mainEl);
        }

        let initialView = document.getElementById('nexus-view-' + currentSlug);
        if (!initialView) {
            initialView = document.createElement('div');
            initialView.id = 'nexus-view-' + currentSlug;
            initialView.className = 'nexus-spa-view active-view';
            initialView.setAttribute('data-slug', currentSlug);
            viewsContainer.appendChild(initialView);
            initialView.appendChild(mainEl);

            const modals = document.querySelectorAll('body > .modal-overlay, body > [id^="modal"]');
            modals.forEach(m => initialView.appendChild(m));
        }
    }

    async function switchView(targetSlug, targetUrl, updateHistory = true) {
        if (!PAGE_CONFIG[targetSlug]) {
            window.location.href = targetUrl;
            return;
        }

        initViewsContainer();
        const viewsContainer = document.getElementById('nexusViewsContainer');
        if (!viewsContainer) {
            window.location.href = targetUrl;
            return;
        }

        if (targetSlug === currentSlug) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Save current scroll position
        viewScrolls[currentSlug] = window.scrollY;

        const currentView = document.getElementById('nexus-view-' + currentSlug);
        let targetView = document.getElementById('nexus-view-' + targetSlug);

        // Update Universal Header title and glowing icon
        const cfg = PAGE_CONFIG[targetSlug];
        const headerTitleEl = document.querySelector('#nexusHeaderUniversal .header-main-title');
        if (headerTitleEl) headerTitleEl.textContent = cfg.headerTitle;
        const headerIconEl = document.querySelector('#nexusHeaderUniversal .header-icon-glow i');
        if (headerIconEl) headerIconEl.className = 'fas ' + cfg.icon;

        // Update Bottom Nav active highlight
        document.querySelectorAll('#bottomNav .nav-item').forEach(el => {
            el.classList.remove('active');
            const href = el.getAttribute('href') || '';
            if (href.includes(targetSlug + '.html')) {
                el.classList.add('active');
            }
        });

        // Update document title
        document.title = cfg.title;

        // Update browser URL without reload
        if (updateHistory) {
            history.pushState({ slug: targetSlug }, '', targetUrl);
        }

        // 1. IF TARGET VIEW IS ALREADY CACHED IN DOM: 0.000 MILLISECONDS!
        if (targetView) {
            if (currentView) {
                currentView.classList.remove('active-view');
                currentView.classList.add('cached-view');
            }
            targetView.classList.remove('cached-view');
            targetView.classList.add('active-view');

            const targetScroll = viewScrolls[targetSlug] || 0;
            window.scrollTo(0, targetScroll);

            currentSlug = targetSlug;
            return;
        }

        // 2. IF FIRST TIME: Fetch HTML once, extract <main> & modals, mount and cache forever
        let progressBar = document.getElementById('nexusTopProgressBar');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'nexusTopProgressBar';
            document.body.appendChild(progressBar);
        }
        progressBar.style.opacity = '1';
        progressBar.style.width = '35%';

        try {
            const res = await fetch(targetUrl);
            progressBar.style.width = '75%';
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const newMain = doc.querySelector('main');
            if (!newMain) throw new Error('No main in target document');

            targetView = document.createElement('div');
            targetView.id = 'nexus-view-' + targetSlug;
            targetView.className = 'nexus-spa-view active-view';
            targetView.setAttribute('data-slug', targetSlug);
            targetView.appendChild(newMain);

            const targetModals = doc.querySelectorAll('body > .modal-overlay, body > [id^="modal"]');
            targetModals.forEach(m => targetView.appendChild(m));

            viewsContainer.appendChild(targetView);

            if (currentView) {
                currentView.classList.remove('active-view');
                currentView.classList.add('cached-view');
            }

            try {
                await import('../js/' + targetSlug + '.js?v=20260924-authfix');
            } catch (err) {
                console.warn('[SPA] Module load:', err);
            }

            window.scrollTo(0, 0);
            currentSlug = targetSlug;
        } catch (err) {
            console.error('[SPA Navigation Error]:', err);
            window.location.href = targetUrl;
        } finally {
            progressBar.style.width = '100%';
            setTimeout(() => {
                progressBar.style.opacity = '0';
                setTimeout(() => { progressBar.style.width = '0%'; }, 200);
            }, 200);
        }
    }

    // Capture-phase click interceptor (fires BEFORE inline onclicks)
    window.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        const clickable = e.target.closest('[onclick*=".html"]');

        let targetHref = null;
        if (link) {
            targetHref = link.getAttribute('href');
        } else if (clickable) {
            const oc = clickable.getAttribute('onclick') || '';
            const match = oc.match(/['"](\.?[^'"]+\.html[^'"]*)['"]/);
            if (match) targetHref = match[1];
        }

        if (targetHref) {
            if (targetHref.startsWith('#') || targetHref.startsWith('http://') || targetHref.startsWith('https://') || targetHref.startsWith('javascript:')) {
                return;
            }

            const clean = targetHref.split('?')[0].split('#')[0];
            const filename = clean.split('/').pop() || '';
            const slug = filename.replace('.html', '');

            if (PAGE_CONFIG[slug]) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                switchView(slug, targetHref);
            }
        }
    }, true);

    // Native browser back/forward buttons
    window.addEventListener('popstate', () => {
        const slug = getSlugFromUrl();
        if (PAGE_CONFIG[slug]) {
            switchView(slug, window.location.href, false);
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initViewsContainer);
    } else {
        initViewsContainer();
    }

    window.NexusKeepAliveSPA = { switchView, getSlugFromUrl, saveCachedPanels, getCachedPanels };
})();

export {
    n as app, auth, db, f as googleProvider, ADMIN_UID, t as createUserWithEmailAndPassword, signInWithEmailAndPassword, r as signInWithPopup, i as sendPasswordResetEmail, signOut, onAuthStateChanged, c as setPersistence, p as browserLocalPersistence, o as browserSessionPersistence, ref, set, get, update, remove, push, onValue, runTransaction, serverTimestamp, saveCachedBalance, saveCachedUser, saveCachedPanels, getCachedPanels
};