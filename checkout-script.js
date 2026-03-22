const cartItemsContainer = document.getElementById("cartItems");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const locationBtn = document.getElementById("locationBtn");
const addressLabel = document.getElementById("addressLabel");

function money(value) {
    return `Rs. ${value}`;
}

function updateSummary() {
    const totals = window.ByteBiteCart ? window.ByteBiteCart.getTotals() : {
        itemTotal: 0,
        deliveryFee: 0,
        platformFee: 0,
        taxes: 0,
        grandTotal: 0
    };

    document.getElementById("summaryTopTotal").textContent = money(totals.itemTotal);
    document.getElementById("itemTotal").textContent = money(totals.itemTotal);
    document.getElementById("deliveryFee").textContent = money(totals.deliveryFee);
    document.getElementById("platformFee").textContent = money(totals.platformFee);
    document.getElementById("taxes").textContent = money(totals.taxes);
    document.getElementById("grandTotal").textContent = money(totals.grandTotal);
    document.getElementById("finalPrice").textContent = money(totals.grandTotal);

    placeOrderBtn.disabled = totals.grandTotal === 0;
}

function renderCart() {
    if (!window.ByteBiteCart || !cartItemsContainer) {
        return;
    }

    const cart = window.ByteBiteCart.getCart();
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add your favorite dishes to continue.</p>
                <a href="menu.html" class="home-link">Go to Menu</a>
            </div>
        `;
        updateSummary();
        return;
    }

    cartItemsContainer.innerHTML = cart.map((item) => `
        <article class="item-row" data-id="${item.id}">
            <div class="item-info">
                <img src="${item.image || "Biryani.png"}" alt="${item.name}">
                <div>
                    <h3>${item.name}</h3>
                    <p class="sub-text">${item.restaurant || "Byte-Bite"}</p>
                    <span class="rating"><i class="fa-solid fa-star"></i> ${item.rating || "4.5"}</span>
                </div>
            </div>
            <div class="item-actions">
                <div class="qty-control">
                    <button type="button" class="qty-btn" data-action="dec">-</button>
                    <span>${item.qty}</span>
                    <button type="button" class="qty-btn" data-action="inc">+</button>
                </div>
                <p class="item-price">${money(item.price * item.qty)}</p>
                <button type="button" class="remove-btn" data-action="remove">Remove</button>
            </div>
        </article>
    `).join("");

    updateSummary();
}

cartItemsContainer?.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.classList.contains("qty-btn") && !target.classList.contains("remove-btn")) {
        return;
    }

    const row = target.closest(".item-row");
    const id = row?.dataset.id;
    if (!id || !window.ByteBiteCart) {
        return;
    }

    const cart = window.ByteBiteCart.getCart();
    const item = cart.find((entry) => entry.id === id);
    if (!item) {
        return;
    }

    const action = target.dataset.action;
    if (action === "inc") {
        window.ByteBiteCart.setQuantity(id, item.qty + 1);
    } else if (action === "dec") {
        window.ByteBiteCart.setQuantity(id, item.qty - 1);
    } else if (action === "remove") {
        window.ByteBiteCart.removeItem(id);
    }

    renderCart();
});

const savedAddress = localStorage.getItem("bb_location");
if (savedAddress && addressLabel) {
    addressLabel.textContent = savedAddress;
}

locationBtn?.addEventListener("click", () => {
    const locationText = prompt("Enter your delivery address");
    if (locationText && locationText.trim()) {
        localStorage.setItem("bb_location", locationText.trim());
        addressLabel.textContent = locationText.trim();
        return;
    }
    window.location.href = "edit-profile.html";
});

placeOrderBtn?.addEventListener("click", () => {
    if (!window.ByteBiteCart || window.ByteBiteCart.getItemCount() === 0) {
        alert("Your cart is empty.");
        return;
    }

    if (!localStorage.getItem("bb_token")) {
        alert("Please log in to place an order.");
        window.location.href = "login.html";
        return;
    }

    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = "Processing...";
    setTimeout(() => {
        window.location.href = "online-payment.html";
    }, 700);
});

renderCart();
