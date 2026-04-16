/* ==========================================
   js/app.js — Master render loop & boot
   ========================================== */

/**
 * render() is the single entry-point that decides which page to show.
 * It always re-renders the header (for cart count, active nav, etc.)
 * and then delegates to the appropriate page renderer.
 */
function render() {
  renderHeader();

  const page = STATE.page;

  if (page === "home") {
    renderHome();
    return;
  }
  if (page === "product") {
    renderProduct();
    return;
  }
  if (page === "cart") {
    renderCart();
    return;
  }
  if (page === "checkout") {
    if (STATE.currentUser) renderCheckout();
    else renderLogin();
    return;
  }
  if (page === "login") {
    renderLogin();
    return;
  }
  if (page === "register") {
    renderRegister();
    return;
  }
  if (page === "profile") {
    if (STATE.currentUser) renderProfile();
    else renderLogin();
    return;
  }
  if (page === "admin") {
    if (STATE.currentUser?.role === "admin") renderAdmin();
    else renderLogin();
    return;
  }

  // Fallback
  renderHome();
}

/* ---- Boot ---- */
document.addEventListener("DOMContentLoaded", () => {
  render();
});
