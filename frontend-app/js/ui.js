function showToast(message) {
  const node = document.getElementById("toast");
  if (!node) return;
  node.textContent = message;
  node.classList.add("show");
  setTimeout(() => node.classList.remove("show"), 2200);
}

function getUser() {
  const raw = localStorage.getItem("bytebite_user");
  return raw ? JSON.parse(raw) : null;
}

function setAuth(data) {
  localStorage.setItem("bytebite_token", data.token);
  localStorage.setItem("bytebite_user", JSON.stringify(data.user));
}

function logout() {
  localStorage.removeItem("bytebite_token");
  localStorage.removeItem("bytebite_user");
  window.location.href = "login.html";
}

async function updateCartBadge() {
  const badge = document.querySelector("[data-cart-count]");
  if (!badge || !localStorage.getItem("bytebite_token")) return;
  try {
    const response = await ByteBiteApi.get("/cart");
    const count = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = count;
  } catch (_error) {
    badge.textContent = "0";
  }
}

function protectPage() {
  if (!localStorage.getItem("bytebite_token")) {
    window.location.href = "login.html";
  }
}

function applyNavbarState() {
  const user = getUser();
  const loginLink = document.querySelector("[data-login-link]");
  const profileLink = document.querySelector("[data-profile-link]");
  const adminLink = document.querySelector("[data-admin-link]");
  const logoutBtn = document.querySelector("[data-logout]");
  if (loginLink) loginLink.classList.toggle("hidden", Boolean(user));
  if (profileLink) profileLink.classList.toggle("hidden", !user);
  if (adminLink) adminLink.classList.toggle("hidden", !(user && user.role === "admin"));
  if (logoutBtn) {
    logoutBtn.classList.toggle("hidden", !user);
    logoutBtn.addEventListener("click", logout);
  }
}

window.ByteBiteUi = {
  showToast,
  setAuth,
  getUser,
  logout,
  protectPage,
  updateCartBadge,
  applyNavbarState
};
