/* ==========================================
   js/pages/profile.js — User profile & order history
   ========================================== */

function renderProfile() {
  const el = document.getElementById("page-root");
  if (!el) return;
  if (!STATE.currentUser) { renderLogin(); return; }

  const u         = STATE.currentUser;
  const myOrders  = getMyOrders();
  const totalSpent = STATE.orders
    .filter(o => o.customer_id === u.customer_id && o.status !== "cancelled")
    .reduce((s, o) => s + o.total_amount, 0);

  el.innerHTML = `
    <div class="page-wrap">
      <div class="profile-layout">

        <!-- Sidebar -->
        <div class="card profile-sidebar">
          <div class="profile-avatar">${esc((u.name || "U")[0].toUpperCase())}</div>
          <p class="profile-name">${esc(u.name)}</p>
          <p class="profile-email">${esc(u.email)}</p>
          <div style="text-align:center; margin-bottom:18px;">
            <span class="badge badge-completed">Verified Customer</span>
          </div>

          <hr class="divider" style="margin:0 0 16px;" />

          <div>
            ${u.phone ? `
              <div style="margin-bottom:12px;">
                <p style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:.4px; margin-bottom:3px;">Phone</p>
                <p style="font-size:13px;">${esc(u.phone)}</p>
              </div>
            ` : ""}
            ${u.address ? `
              <div style="margin-bottom:12px;">
                <p style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:.4px; margin-bottom:3px;">Address</p>
                <p style="font-size:13px;">${esc(u.address)}</p>
              </div>
            ` : ""}
          </div>

          <hr class="divider" />

          <div class="profile-stat">
            <span class="text-muted">Total Orders</span>
            <span class="font-bold">${myOrders.length}</span>
          </div>
          <div class="profile-stat" style="border-bottom:none;">
            <span class="text-muted">Total Spent</span>
            <span class="font-bold text-orange">${fmt(totalSpent)}</span>
          </div>
        </div>

        <!-- Order history -->
        <div>
          <div class="page-heading">
            <h2>📦 Order History</h2>
          </div>

          ${myOrders.length === 0 ? `
            <div class="card empty-state">
              <div class="empty-emoji">📦</div>
              <p class="empty-text">You haven't placed any orders yet.</p>
              <button class="btn-primary" onclick="navigate('home')">Start Shopping</button>
            </div>
          ` : myOrders.map(order => {
              const items   = STATE.orderItems.filter(i => i.order_id === order.order_id);
              const payment = STATE.payments.find(p => p.order_id === order.order_id);
              const canCancel = order.status === "pending" || order.status === "shipped";
              return `
                <div class="card order-card">
                  <div class="order-header">
                    <div>
                      <p class="order-id">#${order.order_id.toUpperCase().slice(0, 8)}</p>
                      <p class="order-date">Ordered on ${order.order_date}</p>
                    </div>
                    <div style="display:flex; gap:9px; align-items:center;">
                      <span class="${badgeCls(order.status)}">${order.status}</span>
                      ${canCancel ? `
                        <button class="btn-sm-red" onclick="cancelOrder('${esc(order.order_id)}')">Cancel</button>
                      ` : ""}
                    </div>
                  </div>

                  <div style="margin-bottom:11px;">
                    ${items.map(it => {
                      const prod = STATE.products.find(p => p.product_id === it.product_id);
                      return `
                        <div class="order-item-row">
                          <span class="text-muted">${prod ? prod.image_url : ""} ${prod ? esc(prod.name) : "—"} <span style="color:var(--text-main); font-weight:600;">× ${it.quantity}</span></span>
                          <span class="font-medium">${fmt(it.price * it.quantity)}</span>
                        </div>
                      `;
                    }).join("")}
                  </div>

                  <div class="order-footer">
                    <span style="font-size:12px; color:var(--text-muted);">
                      ${payment ? `${esc(payment.payment_method)} · <span class="${badgeCls(payment.payment_status)}">${payment.payment_status}</span>` : ""}
                    </span>
                    <span class="font-bold text-orange">${fmt(order.total_amount)}</span>
                  </div>

                  ${order.delivery_address ? `
                    <p style="font-size:11px; color:var(--text-muted); margin-top:9px;">
                      📍 ${esc(order.delivery_address)}
                    </p>
                  ` : ""}
                </div>
              `;
            }).join("")
          }
        </div>
      </div>
    </div>
  `;
}
