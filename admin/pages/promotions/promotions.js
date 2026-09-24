import {
    db,
    ref,
    get,
    push,
    update,
    remove,
    serverTimestamp
} from "../../assets/scripts/firebase.js";
import {
    assertAdmin
} from "../../assets/scripts/auth-guard.js";
let e = {};
async function t() {
    d();
    try {
        const t = await get(ref(db, "promotions"));
        e = t.val() || {},
            function(e) {
                const t = document.getElementById("promotionsList"),
                    o = Object.entries(e).map(([e, t]) => ({
                        id: e,
                        ...t
                    }));
                if (o.sort((e, t) => (t.createdAt || 0) - (e.createdAt || 0)), !o.length) return void(t.innerHTML = '<div style="color:#888;font-size:13px;text-align:center;padding:20px;">No promotions available</div>');
                let n = "";
                o.forEach(e => {
                    const t = !0 === e.status || "true" === e.status,
                        o = e.image ? `<img src="${e.image}" onerror="this.style.display='none'" style="width:100%;height:120px;object-fit:cover;border-radius:12px;border:1px solid rgba(255,255,255,0.06);">` : '<div style="width:100%;height:120px;background:rgba(255,255,255,0.03);display:flex;align-items:center;justify-content:center;border-radius:12px;color:#888;font-size:12px;"><i class="fas fa-image-slash" style="margin-right:5px;"></i> No Image</div>',
                        i = e.link ? `<a href="${e.link}" target="_blank" style="color:#00f0ff;font-size:12px;"><i class="fas fa-external-link-alt"></i> ${e.link}</a>` : '<span style="font-size:12px;color:#888;">No Link</span>';
                    n += `\n            <div style="background:rgba(0,0,0,0.2);padding:18px;border-radius:16px;border:1px solid rgba(255,255,255,0.05);display:flex;flex-direction:column;gap:12px;">\n                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">\n                    <div>\n                        <strong style="font-size:15px;">${e.title}</strong>\n                        ${e.discount?`<span style="background:rgba(255,42,95,0.15);color:#ff2a5f;font-size:10px;font-weight:800;padding:2px 8px;border-radius:50px;margin-left:6px;">${e.discount}% OFF</span>`:""}\n                    </div>\n                    <span class="badge ${t?"badge-success":"badge-danger"}">${t?"Active":"Disabled"}</span>\n                </div>\n                ${e.description?`<div style="font-size:12px;color:#94a3b8;">${e.description}</div>`:""}\n                ${o}\n                ${i}\n                <div style="display:flex;gap:10px;">\n                    <button class="action-btn action-edit" style="flex:1;justify-content:center;" onclick="togglePromo('${e.id}', ${t})">${t?'<i class="fas fa-ban"></i> Disable':'<i class="fas fa-check"></i> Enable'}</button>\n                    <button class="action-btn action-approve" onclick="openEditPromo('${e.id}')"><i class="fas fa-edit"></i> Edit</button>\n                    <button class="action-btn action-reject" onclick="deletePromo('${e.id}')"><i class="fas fa-trash"></i> Delete</button>\n                </div>\n            </div>`
                }), t.innerHTML = n
            }(e)
    } catch (e) {
        i("Failed to load promotions", "error")
    }
    a()
}
async function o() {
    const e = document.getElementById("promoTitle").value.trim(),
        o = document.getElementById("promoDesc").value.trim(),
        n = document.getElementById("promoDiscount").value.trim(),
        r = document.getElementById("promoImg").value.trim(),
        s = document.getElementById("promoLink").value.trim();
    if (!e) return i("Promotion Title is required", "error");
    d();
    try {
        await push(ref(db, "promotions"), {
            title: e,
            description: o,
            discount: n ? parseInt(n) : 0,
            image: r,
            link: s,
            status: !0,
            createdAt: serverTimestamp()
        }), i("Promotion added!"), document.getElementById("promoTitle").value = "", document.getElementById("promoDesc").value = "", document.getElementById("promoDiscount").value = "", document.getElementById("promoImg").value = "", document.getElementById("promoLink").value = "", await t()
    } catch (e) {
        i("Failed to add promotion", "error"), a()
    }
}
async function n() {
    const e = document.getElementById("editPromoId").value,
        o = document.getElementById("editPromoTitle").value.trim(),
        n = document.getElementById("editPromoDesc").value.trim(),
        r = document.getElementById("editPromoDiscount").value.trim(),
        s = document.getElementById("editPromoImg").value.trim(),
        l = document.getElementById("editPromoLink").value.trim();
    if (!o) return i("Title cannot be empty", "error");
    d();
    try {
        await update(ref(db, `promotions/${e}`), {
            title: o,
            description: n,
            discount: r ? parseInt(r) : 0,
            image: s,
            link: l
        }), i("Promotion updated!"), closeEditPromo(), await t()
    } catch (e) {
        i("Update failed", "error"), a()
    }
}

function i(e, t = "success") {
    const o = document.getElementById("promoToastContainer");
    if (!o) return;
    const n = document.createElement("div");
    n.className = `toast ${t}`, n.innerHTML = `<i class="fas ${"success"===t?"fa-check-circle":"fa-exclamation-circle"}"></i> <span>${e}</span>`, o.appendChild(n), setTimeout(() => {
        n.style.animation = "slideOutRight 0.3s forwards", setTimeout(() => n.remove(), 300)
    }, 3e3)
}

function d() {
    const e = document.getElementById("promoLoader");
    e && e.classList.remove("hidden")
}

function a() {
    const e = document.getElementById("promoLoader");
    e && e.classList.add("hidden")
}
document.addEventListener("DOMContentLoaded", () => {
    assertAdmin(() => {
        t(), document.getElementById("btnAddPromo")?.addEventListener("click", o), document.getElementById("btnSaveEditPromo")?.addEventListener("click", n)
    })
}), window.togglePromo = async (e, o) => {
    d();
    try {
        await update(ref(db, `promotions/${e}`), {
            status: !o
        }), i("Promotion " + (o ? "Disabled" : "Activated")), await t()
    } catch (e) {
        i("Status update failed", "error"), a()
    }
}, window.deletePromo = async e => {
    if (confirm("Delete this promotion?")) {
        d();
        try {
            await remove(ref(db, `promotions/${e}`)), i("Promotion deleted"), await t()
        } catch (e) {
            i("Delete failed", "error"), a()
        }
    }
}, window.openEditPromo = t => {
    const o = e[t];
    o && (document.getElementById("editPromoId").value = t, document.getElementById("editPromoTitle").value = o.title || "", document.getElementById("editPromoDesc").value = o.description || "", document.getElementById("editPromoDiscount").value = o.discount || "", document.getElementById("editPromoImg").value = o.image || "", document.getElementById("editPromoLink").value = o.link || "", document.getElementById("editPromoModal").classList.remove("hidden"))
}, window.closeEditPromo = () => document.getElementById("editPromoModal").classList.add("hidden");