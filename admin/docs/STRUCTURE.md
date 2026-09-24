# 🛡️ ADMIN PANEL STORE — Project Structure

```
ADMIN PANEL STORE/
│
├── index.html               # 🔐 Redirects to pages/index/index.html
├── firebase.json            # 🔥 Firebase Hosting config (rewrites / -> pages/index/index.html)
├── sw.js                    # ⚡ Service Worker (cache-first for static assets)
├── package.json             # 📦 Node.js config
├── .gitignore               # 🙈 Git ignore
│
├── pages/                   # 📄 PAGE DIRECTORY (each feature = own folder)
│   ├── index/index.html      # 🔐 ADMIN LOGIN page
│   ├── index/index.js        # Login logic (UID + admin verification)
│   ├── dashboard/dashboard.* # 📊 Revenue, pending, stats, chart
│   ├── users/users.*         # 👥 User management (ban, balance edit)
│   ├── purchases/purchases.* # 📦 View all purchases
│   ├── gateway/gateway.*     # ⚡ Auto payments (approve/reject)
│   ├── manual/manual.*       # 📋 Manual UPI deposits
│   ├── crypto/crypto.*       # ₿ Crypto deposits
│   ├── add-panel/add-panel.* # ➕ Create panel
│   ├── manage-panels/manage-panels.* # ✏️ Edit/delete panels
│   ├── categories/categories.* # 🏷️ Manage categories
│   ├── promotions/promotions.* # 🎉 Manage promotions
│   ├── coupons/coupons.*     # 🎫 Manage coupons
│   ├── settings/settings.*   # ⚙️ ZapKey, UPI, Crypto config
│   ├── branding/branding.*   # 🎨 Site name, logo, announcements
│   └── contact/contact.*     # 📞 Support links + ticket reply
│
├── components/shell/         # 🧩 SHARED COMPONENTS
│   └── sidebar.html          # 📋 Sidebar navigation
│
├── assets/                   # 🎨 SHARED ASSETS
│   ├── scripts/
│   │   ├── firebase.js       # 🔥 Firebase init (prince-1a57b) + isAdmin() + genStock()
│   │   ├── auth-guard.js     # 🛡️ assertAdmin() + logAudit()
│   │   ├── security.js       # 🛡️ Blocks F12, Ctrl+Shift+I/J, Ctrl+U
│   │   ├── sidebar-loader.js # 📋 Sidebar loader
│   │   └── badges.js         # 🔔 Pending-count badges
│   └── styles/
│       └── base.css          # 🎨 Shared base stylesheet
│
└── docs/                     # 📚 DOCUMENTATION
    ├── BLUEPRINT.md
    ├── STRUCTURE.md          # This file
    └── firebase/Rules.md     # Copy to Firebase Console → Realtime DB → Rules
```

### 🔄 Page Flow
```
index.html  →  pages/index  →  (login)  →  pages/dashboard
                                                    │
                                      ┌─────────────┼─────────────┐
                                      │             │             │
                                 users.html    gateway.html   settings.html
                                 purchases     manual.html    branding.html
                                     .html      crypto.html    contact.html
                                      │
                            ┌─────────┴─────────┐
                       add-panel.html      categories.html
                       manage-panels.html  promotions.html
                                           coupons.html
```

### 🔑 Admin UID
`PmgO7qHYasOdgQfkmai0YnpQIWB3` — hardcoded in `assets/scripts/firebase.js`

### 🛡️ Security
- `auth-guard.js` — UID-based auth guard on every page (`assertAdmin`)
- `security.js` — blocks F12, Ctrl+Shift+I/J, Ctrl+U
- `logAudit()` — every admin action logged to `audit_log/` node
- `firebase.js` — connected to the store's live project (`prince-1a57b`)

### 📦 Plan Data Format
Admin writes each plan as `{ label, price, keys, stock }` — `stock` is a
generated array of license keys (`NEXUS-XXXXX`) that the store's checkout
consumes one-by-one.