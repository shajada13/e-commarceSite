/* ==========================================
   js/pages/header.js — Header component
   ========================================== */

function renderHeader() {
  const el = document.getElementById("header-root");
  if (!el) return;
  const cartCount = getCartCount();
  el.innerHTML = `
    <div class="hdr">
      <div class="container">
        <div class="hdr-top">

          <!-- Logo -->
          <button class="hdr-logo" onclick="STATE.searchQ=''; STATE.filterCat='All'; navigate('home');">
            🛍 ShopBD
          </button>

          <!-- Search bar -->
          <div class="hdr-search">
            <input
              id="header-search"
              type="text"
              placeholder="Search products, brands…"
              value="${esc(STATE.searchQ)}"
              oninput="handleSearch(this.value)"
            />
            <button class="hdr-search-btn" onclick="handleSearch(document.getElementById('header-search').value)">
              🔍
            </button>
          </div>

          <!-- Action buttons -->
          <div class="hdr-actions">
            <button class="hdr-btn ${STATE.page === 'cart' ? 'hdr-btn-active' : ''}" onclick="navigate('cart')">
              🛒 <span>Cart</span>
              ${cartCount > 0 ? `<span class="cart-count">${cartCount}</span>` : ""}
            </button>

            ${STATE.currentUser ? `
              <button class="hdr-btn ${STATE.page === 'profile' ? 'hdr-btn-active' : ''}" onclick="navigate('profile')">
                👤 <span>${esc(STATE.currentUser.name.split(" ")[0])}</span>
              </button>
              ${STATE.currentUser.role === "admin" ? `
                <button class="hdr-btn ${STATE.page === 'admin' ? 'hdr-btn-active' : ''}" onclick="navigate('admin')" title="Admin Panel">
                  ⚙️
                </button>
              ` : ""}
              <button class="hdr-btn" onclick="handleLogout()" title="Sign out">🚪</button>
            ` : `
              <button class="hdr-signin" onclick="navigate('login')">Sign In</button>
            `}
          </div>
        </div>
      </div>

      <!-- Category bar -->
      <div class="cat-bar">
        <div class="cat-bar-inner">
          ${CATEGORIES.map(cat => `
            <button
              class="cat-btn ${STATE.filterCat === cat ? 'active' : ''}"
              onclick="handleCategoryFilter('${esc(cat)}')"
            >${esc(cat)}</button>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}
