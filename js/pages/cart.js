/* ==========================================
   js/pages/cart.js — Shopping cart page
   ========================================== */

function renderCart() {
  const el = document.getElementById("page-root");
  if (!el) return;
  const cartItems = getCartItems();
  const cartTotal = getCartTotal();
  const cartCount = getCartCount();

  el.innerHTML = `
    <div class="page-wrap">
      <div class="page-heading">
        <h2>🛒 Shopping Cart</h2>
        <span class="text-muted" style="font-size:14px; font-weight:400;">(${cartCount} item${cartCount !== 1 ? "s" : ""})</span>
      </div>

      ${cartItems.length === 0 ? `
        <div class="card empty-state">
          <div class="empty-emoji">🛒</div>
          <p class="empty-text">Your cart is empty</p>
          <button class="btn-primary" onclick="navigate('home')">Continue Shopping</button>
        </div>
      ` : `
        <div class="cart-layout">
          <!-- Cart items -->
          <div>
            <div class="card">
              ${cartItems.map(({ product_id, quantity, product: p }, idx) => `
                ${idx > 0 ? '<hr class="cart-divider">' : ""}
                <div class="cart-item">
                  <div class="cart-emoji">${p.image_url}</div>
                  <div class="cart-item-info">
                    <p class="cart-item-name">${esc(p.name)}</p>
                    <p class="cart-item-cat">${esc(p.category)}</p>
                  </div>
                  <div class="qty-ctrl">
                    <button class="btn-icon" onclick="updateCartQty('${esc(product_id)}', ${quantity - 1})">−</button>
                    <span style="font-weight:700; min-width:22px; text-align:center;">${quantity}</span>
                    <button class="btn-icon" onclick="updateCartQty('${esc(product_id)}', ${quantity + 1})">+</button>
                  </div>
                  <span class="cart-item-price">${fmt(p.price * quantity)}</span>
                  <button class="remove-btn" onclick="removeFromCart('${esc(product_id)}')" title="Remove">✕</button>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Order summary -->
          <div class="card summary-card">
            <h3>Order Summary</h3>
            <div class="summary-row"><span>Subtotal</span><span>${fmt(cartTotal)}</span></div>
            <div class="summary-row"><span>Delivery Charge</span><span>৳60</span></div>
            <div class="summary-row"><span>Discount</span><span>৳0</span></div>
            <div class="summary-total"><span>Total</span><span>${fmt(cartTotal + 60)}</span></div>

            <button
              class="btn-primary w-full mt-16"
              style="justify-content:center;"
              onclick="${STATE.currentUser
                ? `STATE.deliveryAddr='${esc(STATE.currentUser.address || "")}'; STATE.checkoutStep=1; navigate('checkout');`
                : "navigate('login');"}"
            >Proceed to Checkout →</button>
            <button class="btn-secondary w-full mt-8" style="text-align:center; justify-content:center;" onclick="navigate('home')">
              Continue Shopping
            </button>
          </div>
        </div>
      `}
    </div>
  `;
}
