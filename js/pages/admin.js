/* ==========================================
   js/pages/admin.js — Admin dashboard
   ========================================== */

function renderAdmin() {
  const el = document.getElementById("page-root");
  if (!el) return;
  if (!STATE.currentUser || STATE.currentUser.role !== "admin") { renderLogin(); return; }

  const allCustomers  = STATE.customers.filter(c => c.role !== "admin");
  const revenue       = STATE.orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total_amount, 0);
  const pendingOrders = STATE.orders.filter(o => o.status === "pending").length;
  const tab           = STATE.adminTab;

  el.innerHTML = `
    <div class="page-wrap">

      <!-- Header row -->
      <div class="admin-header">
        <h2 class="admin-title">⚙️ Admin Dashboard</h2>
        <div class="admin-tabs">
          ${[["products","📦 Products"],["orders","🧾 Orders"],["customers","👥 Customers"],["payments","💳 Payments"]].map(([id, lbl]) => `
            <button
              class="admin-tab ${tab === id ? 'admin-tab-active' : 'admin-tab-inactive'}"
              onclick="STATE.adminTab='${id}'; render();"
            >${lbl}</button>
          `).join("")}
        </div>
      </div>

      <!-- Stats row -->
      <div class="stats-grid">
        <div class="stat-card" style="background:#DBEAFE;">
          <div class="stat-icon">📦</div>
          <div><p class="stat-value">${STATE.products.length}</p><p class="stat-label">Total Products</p></div>
        </div>
        <div class="stat-card" style="background:#D1FAE5;">
          <div class="stat-icon">👥</div>
          <div><p class="stat-value">${allCustomers.length}</p><p class="stat-label">Customers</p></div>
        </div>
        <div class="stat-card" style="background:#FEF3C7;">
          <div class="stat-icon">🧾</div>
          <div><p class="stat-value">${STATE.orders.length}</p><p class="stat-label">Total Orders</p></div>
        </div>
        <div class="stat-card" style="background:#EDE9FE;">
          <div class="stat-icon">📈</div>
          <div><p class="stat-value">${fmt(revenue)}</p><p class="stat-label">Revenue</p></div>
        </div>
      </div>

      <!-- Pending alert -->
      ${pendingOrders > 0 ? `
        <div class="alert-pending">
          ⚠ ${pendingOrders} order${pendingOrders > 1 ? "s" : ""} awaiting processing
        </div>
      ` : ""}

      <!-- Tab content -->
      ${tab === "products"  ? adminProductsTab()  : ""}
      ${tab === "orders"    ? adminOrdersTab()     : ""}
      ${tab === "customers" ? adminCustomersTab(allCustomers) : ""}
      ${tab === "payments"  ? adminPaymentsTab()   : ""}
    </div>
  `;
}

/* ---- Products tab ---- */
function adminProductsTab() {
  const f = STATE.productForm;
  return `
    <div class="admin-grid">
      <!-- Products table -->
      <div class="card admin-panel">
        <h3>Products (${STATE.products.length})</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${STATE.products.map(p => {
                const stockCls = p.stock_quantity > 10 ? "badge-completed" : p.stock_quantity > 0 ? "badge-pending" : "badge-failed";
                return `
                  <tr>
                    <td>
                      <div style="display:flex; align-items:center; gap:9px; font-weight:600;">
                        <span style="font-size:18px;">${p.image_url}</span>
                        <span style="font-size:12px;">${esc(p.name)}</span>
                      </div>
                    </td>
                    <td><span class="badge badge-blue">${esc(p.category)}</span></td>
                    <td class="text-orange font-medium">${fmt(p.price)}</td>
                    <td><span class="badge ${stockCls}">${p.stock_quantity}</span></td>
                    <td>
                      <div style="display:flex; gap:6px;">
                        <button class="btn-sm-blue" onclick="editProduct('${esc(p.product_id)}')">✏️ Edit</button>
                        <button class="btn-sm-red"  onclick="deleteProduct('${esc(p.product_id)}')">🗑 Del</button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add / Edit form -->
      <div class="card admin-form">
        <h3>${STATE.editingPid ? "✏️ Edit Product" : "➕ Add New Product"}</h3>

        ${[
          { key: "name",           label: "Product Name",  type: "text"   },
          { key: "price",          label: "Price (৳)",     type: "number" },
          { key: "stock_quantity", label: "Stock Qty",     type: "number" },
          { key: "image_url",      label: "Emoji Icon",    type: "text"   },
        ].map(field => `
          <div class="form-group" style="margin-bottom:12px;">
            <label class="form-label">${field.label}</label>
            <input
              class="input input-sm"
              type="${field.type}"
              value="${esc(f[field.key])}"
              oninput="STATE.productForm['${field.key}']=this.value"
            />
          </div>
        `).join("")}

        <div class="form-group" style="margin-bottom:12px;">
          <label class="form-label">Category</label>
          <select class="input input-sm" onchange="STATE.productForm.category=this.value">
            ${CATEGORIES.filter(c => c !== "All").map(c => `
              <option value="${esc(c)}" ${f.category === c ? "selected" : ""}>${esc(c)}</option>
            `).join("")}
          </select>
        </div>

        <div class="form-group" style="margin-bottom:18px;">
          <label class="form-label">Description</label>
          <textarea
            class="input input-sm"
            style="height:64px; resize:none;"
            oninput="STATE.productForm.description=this.value"
          >${esc(f.description)}</textarea>
        </div>

        <div style="display:flex; gap:9px;">
          <button class="btn-primary" style="flex:1; justify-content:center; padding:9px;" onclick="saveProduct()">
            ${STATE.editingPid ? "Update Product" : "Add Product"}
          </button>
          ${STATE.editingPid ? `
            <button class="btn-secondary" onclick="cancelEditProduct()">Cancel</button>
          ` : ""}
        </div>
      </div>
    </div>
  `;
}

/* ---- Orders tab ---- */
function adminOrdersTab() {
  return `
    <div class="card admin-panel">
      <h3>All Orders (${STATE.orders.length})</h3>
      ${STATE.orders.length === 0 ? `
        <p style="text-align:center; padding:44px; color:var(--text-muted);">No orders yet.</p>
      ` : `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Items</th>
                <th>Date</th><th>Amount</th><th>Status</th><th>Update</th>
              </tr>
            </thead>
            <tbody>
              ${STATE.orders.slice().reverse().map(order => {
                const customer  = STATE.customers.find(c => c.customer_id === order.customer_id);
                const itemCount = STATE.orderItems
                  .filter(i => i.order_id === order.order_id)
                  .reduce((s, i) => s + i.quantity, 0);
                return `
                  <tr>
                    <td class="font-mono text-sm">#${order.order_id.toUpperCase().slice(0,8)}</td>
                    <td style="font-weight:500;">${esc(customer?.name || "—")}</td>
                    <td>${itemCount} item${itemCount !== 1 ? "s" : ""}</td>
                    <td class="text-muted text-sm">${order.order_date}</td>
                    <td class="text-orange font-medium">${fmt(order.total_amount)}</td>
                    <td><span class="${badgeCls(order.status)}">${order.status}</span></td>
                    <td>
                      <select
                        class="input input-sm"
                        style="width:auto; padding:4px 8px;"
                        onchange="updateOrderStatus('${esc(order.order_id)}', this.value)"
                      >
                        ${["pending","shipped","delivered","cancelled"].map(s => `
                          <option value="${s}" ${order.status === s ? "selected" : ""}>${s}</option>
                        `).join("")}
                      </select>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

/* ---- Customers tab ---- */
function adminCustomersTab(allCustomers) {
  return `
    <div class="card admin-panel">
      <h3>Registered Customers (${allCustomers.length})</h3>
      ${allCustomers.length === 0 ? `
        <p style="text-align:center; padding:44px; color:var(--text-muted);">No customers yet.</p>
      ` : `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Phone</th>
                <th>Address</th><th>Orders</th><th>Spent</th>
              </tr>
            </thead>
            <tbody>
              ${allCustomers.map(c => {
                const cOrders = STATE.orders.filter(o => o.customer_id === c.customer_id);
                const spent   = cOrders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total_amount, 0);
                return `
                  <tr>
                    <td style="font-weight:600;">${esc(c.name)}</td>
                    <td class="text-sm">${esc(c.email)}</td>
                    <td>${esc(c.phone || "—")}</td>
                    <td class="text-sm" style="max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${esc(c.address || "—")}</td>
                    <td><span class="badge badge-blue">${cOrders.length}</span></td>
                    <td class="text-orange font-medium">${fmt(spent)}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

/* ---- Payments tab ---- */
function adminPaymentsTab() {
  return `
    <div class="card admin-panel">
      <h3>Payment Records (${STATE.payments.length})</h3>
      ${STATE.payments.length === 0 ? `
        <p style="text-align:center; padding:44px; color:var(--text-muted);">No payment records yet.</p>
      ` : `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th><th>Order</th><th>Method</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${STATE.payments.slice().reverse().map(p => `
                <tr>
                  <td class="font-mono text-sm">${esc(p.transaction_id)}</td>
                  <td class="text-sm">#${p.order_id.toUpperCase().slice(0,8)}</td>
                  <td>${esc(p.payment_method)}</td>
                  <td><span class="${badgeCls(p.payment_status)}">${p.payment_status}</span></td>
                  <td>
                    ${p.payment_status === "completed" ? `
                      <button class="btn-sm-yellow" onclick="refundPayment('${esc(p.payment_id)}')">Refund</button>
                    ` : ""}
                    ${p.payment_status === "failed" ? `
                      <button class="btn-sm-green" onclick="verifyPayment('${esc(p.payment_id)}')">Verify</button>
                    ` : ""}
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}
