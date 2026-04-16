/* ==========================================
   js/pages/checkout.js — 3-step checkout
   ========================================== */

const PAYMENT_METHODS = [
  { id: "COD",   label: "Cash on Delivery",   icon: "💵", desc: "Pay when you receive your order" },
  { id: "card",  label: "Credit / Debit Card", icon: "💳", desc: "Visa, Mastercard, American Express" },
  { id: "bkash", label: "bKash",               icon: "🩷", desc: "Fast mobile payment via bKash" },
  { id: "nagad", label: "Nagad",               icon: "🟠", desc: "Bangladesh Post Office digital wallet" },
];

function checkoutStepsHtml(current) {
  const steps = ["Delivery", "Payment", "Confirm"];
  return `
    <div class="steps-row">
      ${steps.map((label, i) => {
        const n     = i + 1;
        const done  = current > n;
        const active = current === n;
        const cls   = done ? "step-done" : active ? "step-active" : "step-inactive";
        const lCls  = active ? "step-label-active" : "step-label-inactive";
        return `
          <div class="step-item">
            <div class="step-circle ${cls}">${done ? "✓" : n}</div>
            <span class="step-label ${lCls}">${label}</span>
          </div>
          ${i < 2 ? `<div class="step-line ${done ? 'step-line-done' : 'step-line-inactive'}"></div>` : ""}
        `;
      }).join("")}
    </div>
  `;
}

function renderCheckout() {
  const el = document.getElementById("page-root");
  if (!el) return;
  if (!STATE.currentUser) { renderLogin(); return; }

  const cartItems = getCartItems();
  const cartTotal = getCartTotal();
  const step      = STATE.checkoutStep;

  let stepContent = "";

  if (step === 1) {
    stepContent = `
      <h3 style="font-size:15px; margin-bottom:20px; font-weight:700;">Delivery Address</h3>
      <div class="form-group">
        <label class="form-label">Full Name</label>
        <input class="input" type="text" value="${esc(STATE.currentUser.name)}" readonly style="background:var(--bg-secondary);" />
      </div>
      <div class="form-group">
        <label class="form-label">Phone</label>
        <input class="input" type="text" value="${esc(STATE.currentUser.phone || "")}" readonly style="background:var(--bg-secondary);" />
      </div>
      <div class="form-group">
        <label class="form-label">Delivery Address</label>
        <textarea
          id="delivery-addr"
          class="input"
          style="height:80px; resize:none;"
          placeholder="Street, Area, City, ZIP…"
          oninput="STATE.deliveryAddr=this.value"
        >${esc(STATE.deliveryAddr)}</textarea>
      </div>
      <button class="btn-primary" onclick="STATE.checkoutStep=2; render()">Continue to Payment →</button>
    `;
  }

  if (step === 2) {
    stepContent = `
      <h3 style="font-size:15px; margin-bottom:20px; font-weight:700;">Payment Method</h3>
      ${PAYMENT_METHODS.map(m => `
        <div
          class="pay-option ${STATE.payMethod === m.id ? 'pay-option-active' : 'pay-option-inactive'}"
          onclick="STATE.payMethod='${m.id}'; render();"
        >
          <span style="font-size:24px;">${m.icon}</span>
          <div style="flex:1;">
            <p style="font-weight:600; font-size:13.5px; margin-bottom:2px;">${m.label}</p>
            <p style="font-size:12px; color:var(--text-muted);">${m.desc}</p>
          </div>
          ${STATE.payMethod === m.id ? '<span class="pay-check">✓</span>' : ""}
        </div>
      `).join("")}
      <div style="display:flex; gap:10px; margin-top:18px;">
        <button class="btn-secondary" onclick="STATE.checkoutStep=1; render()">← Back</button>
        <button class="btn-primary" onclick="STATE.checkoutStep=3; render()">Review Order →</button>
      </div>
    `;
  }

  if (step === 3) {
    stepContent = `
      <h3 style="font-size:15px; margin-bottom:20px; font-weight:700;">Review &amp; Confirm</h3>
      <div style="margin-bottom:16px;">
        ${cartItems.map(({ product_id, quantity, product: p }) => `
          <div class="review-item">
            <span class="text-muted">${esc(p.name)} <span style="color:var(--text-main); font-weight:600;">× ${quantity}</span></span>
            <span class="font-medium">${fmt(p.price * quantity)}</span>
          </div>
        `).join("")}
        <div class="review-item">
          <span class="text-muted">Delivery</span><span>৳60</span>
        </div>
        <div style="display:flex; justify-content:space-between; padding:13px 0; font-weight:700; font-size:16px; border-top:2px solid var(--border);">
          <span>Total</span><span class="text-orange">${fmt(cartTotal + 60)}</span>
        </div>
      </div>
      <div class="review-delivery">
        📍 <strong>Deliver to:</strong> ${esc(STATE.deliveryAddr || STATE.currentUser.address || "—")}<br/>
        💳 <strong>Payment:</strong> ${esc(STATE.payMethod)}
      </div>
      <div class="warning-box">
        ⚠ Demo: ~12% chance of simulated payment failure to demonstrate transaction rollback
      </div>
      <div style="display:flex; gap:10px;">
        <button class="btn-secondary" onclick="STATE.checkoutStep=2; render()">← Back</button>
        <button class="btn-primary" style="flex:1; justify-content:center;" onclick="placeOrder()">
          Place Order ✓
        </button>
      </div>
    `;
  }

  el.innerHTML = `
    <div class="checkout-wrap">
      <div class="page-heading">
        <h2>Checkout</h2>
      </div>
      ${checkoutStepsHtml(step)}
      <div class="card" style="padding:28px;">
        ${stepContent}
      </div>
    </div>
  `;
}
