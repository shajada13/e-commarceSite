/* ==========================================
   js/utils.js — Helper functions
   ========================================== */

function genId()    { return Math.random().toString(36).substr(2, 9); }
function hashPw(pw) { return btoa(pw + "_salt_bd"); }
function todayStr() { return new Date().toISOString().split("T")[0]; }
function fmt(n)     { return "৳" + Number(n).toLocaleString(); }

/** Escape HTML to prevent XSS when inserting user input into innerHTML */
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Returns a CSS class string for a status badge */
function badgeCls(status) {
  const map = {
    pending:   "badge badge-pending",
    shipped:   "badge badge-shipped",
    delivered: "badge badge-delivered",
    cancelled: "badge badge-cancelled",
    completed: "badge badge-completed",
    failed:    "badge badge-failed",
    refunded:  "badge badge-refunded",
  };
  return map[status] || "badge badge-default";
}

/** Render 5-star rating as HTML */
function starsHtml(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<span class="${i <= Math.round(rating) ? "star-on" : "star-off"}">★</span>`;
  }
  return html;
}
