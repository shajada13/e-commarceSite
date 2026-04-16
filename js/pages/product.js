/* ==========================================
   js/pages/product.js — Product detail page
   ========================================== */

function renderProduct() {
  const el = document.getElementById("page-root");
  if (!el) return;

  const p = STATE.products.find(pr => pr.product_id === STATE.selectedProductId);
  if (!p) { navigate("home"); return; }

  const inStock     = p.stock_quantity > 0;
  const related     = STATE.products
    .filter(pr => pr.category === p.category && pr.product_id !== p.product_id)
    .slice(0, 4);

  el.innerHTML = `
    <div class="page-wrap">
      <!-- Back button -->
      <button class="btn-secondary back-btn" onclick="navigate('home')">
        ← Back to Products
      </button>

      <!-- Main product card -->
      <div class="card" style="padding:28px; margin-bottom:26px;">
        <div class="detail-grid">
          <!-- Image -->
          <div class="detail-img">${p.image_url}</div>

          <!-- Info -->
          <div>
            <span class="badge badge-blue" style="margin-bottom:12px; display:inline-block;">${esc(p.category)}</span>
            <h2 style="font-family:var(--font-display); font-size:22px; margin-bottom:10px;">${esc(p.name)}</h2>

            <!-- Stars -->
            <div class="rating-row" style="margin-bottom:14px;">
              ${starsHtml(p.rating)}
              <span class="rating-text">${p.rating} · ${p.reviews} reviews</span>
            </div>

            <p class="detail-price">${fmt(p.price)}</p>
            <p class="detail-desc">${esc(p.description)}</p>

            <p class="${inStock ? 'detail-stock-in' : 'detail-stock-out'}">
              ${inStock ? `✓ In Stock — ${p.stock_quantity} units available` : "✗ Out of Stock"}
            </p>

            <div class="detail-actions">
              <button
                class="btn-primary"
                onclick="addToCart('${esc(p.product_id)}')"
                ${!inStock ? "disabled" : ""}
              >Add to Cart</button>
              <button
                class="btn-secondary"
                onclick="addToCart('${esc(p.product_id)}'); navigate('cart');"
                ${!inStock ? "disabled" : ""}
              >Buy Now</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Related products -->
      ${related.length > 0 ? `
        <h3 style="font-family:var(--font-display); font-size:17px; margin-bottom:15px;">
          Related Products
        </h3>
        <div class="related-grid">
          ${related.map(rp => `
            <div class="card" style="padding:14px; cursor:pointer; transition:transform .15s;"
              onmouseover="this.style.transform='translateY(-3px)'"
              onmouseout="this.style.transform=''"
              onclick="navigate('product', { selectedProductId: '${esc(rp.product_id)}' })">
              <div style="font-size:44px; text-align:center; margin-bottom:9px;">${rp.image_url}</div>
              <p style="font-weight:600; font-size:13px; margin-bottom:4px;">${esc(rp.name)}</p>
              <p style="color:var(--primary); font-weight:700; font-size:14px;">${fmt(rp.price)}</p>
            </div>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `;
}
