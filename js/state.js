/* ==========================================
   js/state.js — App state & action functions
   ========================================== */

const STATE = {
  /* Data tables */
  products:   JSON.parse(JSON.stringify(INIT_PRODUCTS)),
  customers:  [Object.assign({}, ADMIN_USER)],
  orders:     [],
  orderItems: [],
  payments:   [],

  /* UI state */
  currentUser:       null,
  page:              "home",
  selectedProductId: null,
  cart:              [],
  searchQ:           "",
  filterCat:         "All",
  adminTab:          "products",

  /* Form state */
  loginForm:   { email: "", password: "" },
  loginErr:    "",
  regForm:     { name: "", email: "", password: "", phone: "", address: "" },
  productForm: { name: "", description: "", price: "", stock_quantity: "", category: "Electronics", image_url: "📦" },
  editingPid:  null,

  /* Checkout */
  checkoutStep: 1,
  payMethod:    "COD",
  deliveryAddr: "",

  /* Internal */
  _toastTimer: null,
};

/* ---- Derived data helpers ---- */

function getFilteredProducts() {
  return STATE.products.filter(p => {
    const catOk    = STATE.filterCat === "All" || p.category === STATE.filterCat;
    const q        = STATE.searchQ.trim().toLowerCase();
    const searchOk = !q || p.name.toLowerCase().includes(q) ||
                     p.description.toLowerCase().includes(q) ||
                     p.category.toLowerCase().includes(q);
    return catOk && searchOk;
  });
}

function getCartItems() {
  return STATE.cart
    .map(ci => ({ ...ci, product: STATE.products.find(p => p.product_id === ci.product_id) }))
    .filter(ci => ci.product);
}

function getCartTotal() {
  return getCartItems().reduce((s, ci) => s + ci.product.price * ci.quantity, 0);
}

function getCartCount() {
  return STATE.cart.reduce((s, ci) => s + ci.quantity, 0);
}

function getMyOrders() {
  if (!STATE.currentUser) return [];
  return STATE.orders
    .filter(o => o.customer_id === STATE.currentUser.customer_id)
    .slice()
    .reverse();
}

/* ---- Toast ---- */

function showToast(msg, type = "success") {
  const el = document.getElementById("toast-root");
  if (!el) return;
  el.innerHTML = `<div class="toast toast-${type}">${type === "error" ? "⚠" : "✓"} ${esc(msg)}</div>`;
  clearTimeout(STATE._toastTimer);
  STATE._toastTimer = setTimeout(() => { if (el) el.innerHTML = ""; }, 3200);
}

/* ---- Navigation ---- */

function navigate(page, extra) {
  STATE.page = page;
  if (extra) Object.assign(STATE, extra);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---- Cart actions ---- */

function addToCart(productId) {
  const product = STATE.products.find(p => p.product_id === productId);
  if (!product || product.stock_quantity < 1) { showToast("Out of stock!", "error"); return; }
  const ex = STATE.cart.find(i => i.product_id === productId);
  if (ex) {
    if (ex.quantity >= product.stock_quantity) { showToast("Max stock reached", "error"); return; }
    STATE.cart = STATE.cart.map(i => i.product_id === productId ? { ...i, quantity: i.quantity + 1 } : i);
  } else {
    STATE.cart = [...STATE.cart, { product_id: productId, quantity: 1 }];
  }
  showToast(product.name + " added to cart! 🛒");
  renderHeader(); // only update header badge; avoid full page re-render
}

function updateCartQty(productId, qty) {
  if (qty < 1) {
    STATE.cart = STATE.cart.filter(i => i.product_id !== productId);
  } else {
    const p = STATE.products.find(p => p.product_id === productId);
    if (p && qty > p.stock_quantity) { showToast("Insufficient stock", "error"); return; }
    STATE.cart = STATE.cart.map(i => i.product_id === productId ? { ...i, quantity: qty } : i);
  }
  render();
}

function removeFromCart(productId) {
  STATE.cart = STATE.cart.filter(i => i.product_id !== productId);
  render();
}

/* ---- Auth actions ---- */

function handleLogin() {
  const { email, password } = STATE.loginForm;
  const c = STATE.customers.find(c => c.email === email && c.password_hash === hashPw(password));
  if (!c) { STATE.loginErr = "Invalid email or password"; render(); return; }
  STATE.currentUser = c;
  STATE.loginErr    = "";
  STATE.loginForm   = { email: "", password: "" };
  navigate(c.role === "admin" ? "admin" : "home");
  showToast("Welcome back, " + c.name.split(" ")[0] + "! 👋");
}

function handleRegister() {
  const f = STATE.regForm;
  if (!f.name || !f.email || !f.password) { showToast("Name, email & password required", "error"); return; }
  if (STATE.customers.find(c => c.email === f.email)) { showToast("Email already registered", "error"); return; }
  const nc = {
    customer_id:   genId(),
    name:          f.name, email: f.email, phone: f.phone, address: f.address,
    password_hash: hashPw(f.password),
    role:          "customer",
  };
  STATE.customers  = [...STATE.customers, nc];
  STATE.currentUser = nc;
  STATE.regForm    = { name: "", email: "", password: "", phone: "", address: "" };
  navigate("home");
  showToast("Account created successfully! 🎉");
}

function handleLogout() {
  STATE.currentUser = null;
  STATE.cart        = [];
  navigate("home");
  showToast("Signed out. See you soon!");
}

/* ---- Order actions ---- */

function placeOrder() {
  if (STATE.cart.length === 0 || !STATE.currentUser) return;
  const cartItems  = getCartItems();
  const cartTotal  = getCartTotal();
  const orderId    = genId();
  const paymentId  = genId();
  const txnId      = "TXN" + Date.now();
  const paySuccess = Math.random() > 0.12;

  if (paySuccess) {
    let stockError = false;
    const updatedProducts = STATE.products.map(p => {
      const ci = STATE.cart.find(i => i.product_id === p.product_id);
      if (ci) {
        if (p.stock_quantity < ci.quantity) stockError = true;
        return { ...p, stock_quantity: p.stock_quantity - ci.quantity };
      }
      return p;
    });
    if (stockError) { showToast("Some items went out of stock. Order rolled back.", "error"); return; }

    const newOrder   = { order_id: orderId, customer_id: STATE.currentUser.customer_id, order_date: todayStr(), total_amount: cartTotal + 60, status: "pending", delivery_address: STATE.deliveryAddr || STATE.currentUser.address };
    const newItems   = STATE.cart.map(ci => ({ order_item_id: genId(), order_id: orderId, product_id: ci.product_id, quantity: ci.quantity, price: STATE.products.find(p => p.product_id === ci.product_id)?.price || 0 }));
    const newPayment = { payment_id: paymentId, order_id: orderId, payment_method: STATE.payMethod, payment_status: "completed", transaction_id: txnId };

    STATE.products   = updatedProducts;
    STATE.orders     = [...STATE.orders, newOrder];
    STATE.orderItems = [...STATE.orderItems, ...newItems];
    STATE.payments   = [...STATE.payments, newPayment];
    STATE.cart       = [];
    STATE.checkoutStep = 1;
    navigate("profile");
    showToast("Order placed! Your items are on the way 🎉");
  } else {
    STATE.payments = [...STATE.payments, { payment_id: paymentId, order_id: orderId, payment_method: STATE.payMethod, payment_status: "failed", transaction_id: txnId }];
    showToast("Payment failed — transaction rolled back. Stock unchanged.", "error");
  }
}

function cancelOrder(orderId) {
  const order = STATE.orders.find(o => o.order_id === orderId);
  if (!order || order.status === "delivered" || order.status === "cancelled") return;
  const items      = STATE.orderItems.filter(i => i.order_id === orderId);
  STATE.products   = STATE.products.map(p => { const it = items.find(i => i.product_id === p.product_id); return it ? { ...p, stock_quantity: p.stock_quantity + it.quantity } : p; });
  STATE.orders     = STATE.orders.map(o => o.order_id === orderId ? { ...o, status: "cancelled" } : o);
  STATE.payments   = STATE.payments.map(p => p.order_id === orderId ? { ...p, payment_status: "refunded" } : p);
  render();
  showToast("Order cancelled. Stock has been restored.");
}

function updateOrderStatus(orderId, status) {
  STATE.orders = STATE.orders.map(o => o.order_id === orderId ? { ...o, status } : o);
  render();
  showToast("Order status → " + status);
}

/* ---- Product (Admin) actions ---- */

function saveProduct() {
  const f = STATE.productForm;
  if (!f.name || !f.price) { showToast("Name and price are required", "error"); return; }
  if (STATE.editingPid) {
    STATE.products = STATE.products.map(p => p.product_id === STATE.editingPid
      ? { ...p, ...f, price: Number(f.price), stock_quantity: Number(f.stock_quantity) }
      : p);
    showToast("Product updated");
  } else {
    STATE.products = [...STATE.products, { product_id: genId(), ...f, price: Number(f.price), stock_quantity: Number(f.stock_quantity), rating: 0, reviews: 0 }];
    showToast("Product added");
  }
  STATE.productForm = { name: "", description: "", price: "", stock_quantity: "", category: "Electronics", image_url: "📦" };
  STATE.editingPid  = null;
  render();
}

function editProduct(pid) {
  const p = STATE.products.find(p => p.product_id === pid);
  if (!p) return;
  STATE.editingPid  = pid;
  STATE.productForm = { name: p.name, description: p.description, price: String(p.price), stock_quantity: String(p.stock_quantity), category: p.category, image_url: p.image_url };
  render();
}

function cancelEditProduct() {
  STATE.editingPid  = null;
  STATE.productForm = { name: "", description: "", price: "", stock_quantity: "", category: "Electronics", image_url: "📦" };
  render();
}

function deleteProduct(pid) {
  STATE.products = STATE.products.filter(p => p.product_id !== pid);
  if (STATE.editingPid === pid) { STATE.editingPid = null; STATE.productForm = { name:"", description:"", price:"", stock_quantity:"", category:"Electronics", image_url:"📦" }; }
  render();
  showToast("Product deleted");
}

/* ---- Payment (Admin) actions ---- */

function refundPayment(paymentId) {
  STATE.payments = STATE.payments.map(p => p.payment_id === paymentId ? { ...p, payment_status: "refunded" } : p);
  render();
  showToast("Payment refunded");
}

function verifyPayment(paymentId) {
  STATE.payments = STATE.payments.map(p => p.payment_id === paymentId ? { ...p, payment_status: "completed" } : p);
  render();
  showToast("Payment verified & marked completed");
}

/* ---- Search (partial DOM update to preserve focus) ---- */

function handleSearch(val) {
  STATE.searchQ = val;
  if (STATE.page !== "home") { STATE.page = "home"; render(); return; }
  // On home page: only update the product section without re-rendering header
  const sec = document.getElementById("products-section");
  if (sec) sec.innerHTML = productsSectionHtml();
}

function handleCategoryFilter(cat) {
  STATE.filterCat = cat;
  if (STATE.page !== "home") { STATE.page = "home"; render(); return; }
  const sec = document.getElementById("products-section");
  if (sec) sec.innerHTML = productsSectionHtml();
  renderHeader(); // update active cat button
}
