/* ==========================================
   js/pages/auth.js — Login & Register pages
   ========================================== */

function renderLogin() {
  const el = document.getElementById("page-root");
  if (!el) return;
  el.innerHTML = `
    <div class="narrow">
      <div class="card auth-card">
        <h2>Sign In to ShopBD</h2>
        <p class="auth-subtitle">
          Demo credentials:<br/>
          <code style="background:var(--bg-secondary); padding:2px 6px; border-radius:4px;">admin@shopbd.com</code>
          &nbsp;/&nbsp;
          <code style="background:var(--bg-secondary); padding:2px 6px; border-radius:4px;">admin123</code>
        </p>

        ${STATE.loginErr ? `<div class="alert-error">${esc(STATE.loginErr)}</div>` : ""}

        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input
            id="login-email"
            class="input"
            type="email"
            placeholder="your@email.com"
            value="${esc(STATE.loginForm.email)}"
            oninput="STATE.loginForm.email = this.value"
            onkeydown="if(event.key==='Enter') handleLogin()"
          />
        </div>
        <div class="form-group" style="margin-bottom:22px;">
          <label class="form-label">Password</label>
          <input
            id="login-password"
            class="input"
            type="password"
            placeholder="••••••••"
            value="${esc(STATE.loginForm.password)}"
            oninput="STATE.loginForm.password = this.value"
            onkeydown="if(event.key==='Enter') handleLogin()"
          />
        </div>

        <button class="btn-primary w-full" style="justify-content:center;" onclick="handleLogin()">
          Sign In
        </button>

        <p class="auth-footer">
          New customer?&nbsp;
          <button class="auth-link" onclick="STATE.loginErr=''; navigate('register')">
            Create Account
          </button>
        </p>
      </div>
    </div>
  `;
}

function renderRegister() {
  const el = document.getElementById("page-root");
  if (!el) return;
  const f = STATE.regForm;
  el.innerHTML = `
    <div class="narrow">
      <div class="card auth-card">
        <h2>Create Account</h2>
        <p class="auth-subtitle" style="margin-bottom:24px;">Join ShopBD today — it's free!</p>

        <div class="form-group">
          <label class="form-label">Full Name *</label>
          <input class="input" type="text" placeholder="Rahim Uddin"
            value="${esc(f.name)}" oninput="STATE.regForm.name=this.value" />
        </div>
        <div class="form-group">
          <label class="form-label">Email Address *</label>
          <input class="input" type="email" placeholder="rahim@example.com"
            value="${esc(f.email)}" oninput="STATE.regForm.email=this.value" />
        </div>
        <div class="form-group">
          <label class="form-label">Password *</label>
          <input class="input" type="password" placeholder="Min. 6 characters"
            value="${esc(f.password)}" oninput="STATE.regForm.password=this.value" />
        </div>
        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input class="input" type="text" placeholder="01XXXXXXXXX"
            value="${esc(f.phone)}" oninput="STATE.regForm.phone=this.value" />
        </div>
        <div class="form-group" style="margin-bottom:22px;">
          <label class="form-label">Address</label>
          <input class="input" type="text" placeholder="Gulshan, Dhaka"
            value="${esc(f.address)}" oninput="STATE.regForm.address=this.value" />
        </div>

        <button class="btn-primary w-full" style="justify-content:center;" onclick="handleRegister()">
          Create Account
        </button>

        <p class="auth-footer">
          Already registered?&nbsp;
          <button class="auth-link" onclick="navigate('login')">Sign In</button>
        </p>
      </div>
    </div>
  `;
}
