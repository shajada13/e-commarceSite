/* ==========================================
   js/pages/home.js — Home / product listing page
   ========================================== */

/** Renders just the products section (used for partial updates on search/filter) */
function productsSectionHtml() {
  const filtered = getFilteredProducts();
  const countLabel = `Showing <strong>${filtered.length}</strong> product${filtered.length !== 1 ? "s" : ""}${STATE.filterCat !== "All" ? ` in <strong>"${esc(STATE.filterCat)}"</strong>` : ""}${STATE.searchQ ? ` for <strong>"${esc(STATE.searchQ)}"</strong>` : ""}`;

  if (filtered.length === 0) {
    return `
      <p class="section-meta">${countLabel}</p>
      <div class="card empty-state">
        <div class="empty-emoji">🔍</div>
        <p class="empty-text">No products found. Try a different search or category.</p>
        <button class="btn-secondary" onclick="STATE.searchQ=''; STATE.filterCat='All'; document.getElementById('header-search').value=''; renderHeader(); document.getElementById('products-section').innerHTML = productsSectionHtml();">
          Clear Filters
        </button>
      </div>
    `;
  }

  return `
    <p class="section-meta">${countLabel}</p>
    <div class="product-grid">
      ${filtered.map(p => productCardHtml(p)).join("")}
    </div>
  `;
}

/** Single product card HTML */
function productCardHtml(p) {
  const inStock = p.stock_quantity > 0;
  return `
    <div class="card product-card" onclick="navigate('product', { selectedProductId: '${esc(p.product_id)}' })">
      <div class="product-card-img">${p.image_url}</div>
      <div class="product-card-body">
        <span class="badge badge-blue">${esc(p.category)}</span>
        <p class="product-name">${esc(p.name)}</p>
        <div class="rating-row">
          ${starsHtml(p.rating)}
          <span class="rating-text">${p.rating > 0 ? `${p.rating} (${p.reviews})` : "New"}</span>
        </div>
        <p class="product-price">${fmt(p.price)}</p>
        <p class="${inStock ? 'stock-in' : 'stock-out'}">
          ${inStock ? `✓ ${p.stock_quantity} in stock` : "✗ Out of stock"}
        </p>
        <button
          class="btn-primary w-full"
          style="justify-content:center; padding:8px 0; font-size:13px;"
          onclick="event.stopPropagation(); addToCart('${esc(p.product_id)}')"
          ${!inStock ? "disabled" : ""}
        >Add to Cart</button>
      </div>
    </div>
  `;
}

/** Full home page render */
function renderHome() {
  const el = document.getElementById("page-root");
  if (!el) return;
  el.innerHTML = `
    <div class="page-wrap">
      <!-- Hero banner -->
      <div class="hero">
        <div>
          <p class="hero-tag">⚡ Limited time offer</p>
          <h2>Up to 50% off on Electronics</h2>
          <p>Flash deals ending soon — grab yours now!</p>
          <button class="btn-primary" onclick="handleCategoryFilter('Electronics')">Shop Now →</button>
        </div>
        <div class="hero-emoji">🛍️</div>
      </div>

      <!-- Products section (partial-update target) -->
      <div id="products-section">
        ${productsSectionHtml()}
      </div>
    </div>
  `;
}
