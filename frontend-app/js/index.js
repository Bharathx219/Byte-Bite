const grid = document.getElementById("restaurantGrid");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("searchInput");

const state = {
  search: "",
  rating: "",
  vegOnly: "",
  maxPriceForTwo: "",
  sortBy: ""
};

const debounce = (fn, delay = 350) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

function renderRestaurants(restaurants) {
  if (!restaurants.length) {
    grid.innerHTML = `<p class="muted">No restaurants found for these filters.</p>`;
    return;
  }
  grid.innerHTML = restaurants
    .map(
      (r) => `
      <article class="card">
        <img src="${r.image}" alt="${r.name}" />
        <div class="card-body">
          <div class="row"><strong>${r.name}</strong><span>${r.rating}★</span></div>
          <p class="muted">${r.category} • ${r.deliveryTime} mins</p>
          <p class="muted">₹${r.priceForTwo} for two • ${r.isVegOnly ? "Veg" : "Veg / Non-Veg"}</p>
          <a class="btn btn-primary" href="restaurant.html?id=${r._id}" style="display:inline-block;margin-top:.6rem;">View Menu</a>
        </div>
      </article>
    `
    )
    .join("");
}

async function loadRestaurants() {
  loader.classList.remove("hidden");
  const params = new URLSearchParams();
  Object.entries(state).forEach(([k, v]) => {
    if (v) params.append(k, v);
  });
  try {
    const response = await ByteBiteApi.get(`/restaurants?${params.toString()}`);
    renderRestaurants(response.data);
  } catch (error) {
    ByteBiteUi.showToast(error.message);
  } finally {
    loader.classList.add("hidden");
  }
}

document.getElementById("ratingFilter").addEventListener("change", (e) => {
  state.rating = e.target.value;
  loadRestaurants();
});
document.getElementById("vegFilter").addEventListener("change", (e) => {
  state.vegOnly = e.target.value;
  loadRestaurants();
});
document.getElementById("priceFilter").addEventListener("change", (e) => {
  state.maxPriceForTwo = e.target.value;
  loadRestaurants();
});
document.getElementById("sortBy").addEventListener("change", (e) => {
  state.sortBy = e.target.value;
  loadRestaurants();
});

searchInput.addEventListener(
  "input",
  debounce((e) => {
    state.search = e.target.value.trim();
    loadRestaurants();
  })
);

document.getElementById("searchBtn").addEventListener("click", () => {
  state.search = searchInput.value.trim();
  loadRestaurants();
});

ByteBiteUi.applyNavbarState();
ByteBiteUi.updateCartBadge();
loadRestaurants();
