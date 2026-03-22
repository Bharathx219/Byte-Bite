const scrollLeftBtn = document.getElementById("scrollLeft");
const scrollRightBtn = document.getElementById("scrollRight");
const carousel = document.getElementById("carousel");

scrollLeftBtn?.addEventListener("click", () => {
    carousel?.scrollBy({ left: -200, behavior: "smooth" });
});

scrollRightBtn?.addEventListener("click", () => {
    carousel?.scrollBy({ left: 200, behavior: "smooth" });
});

// Using inline onclick=... in HTML for rest-cards
document.querySelectorAll(".circle-item").forEach((card) => {
    card.addEventListener("click", () => {
        window.location.href = "product-pizza.html";
    });
});

if (window.ByteBiteCart) {
    window.ByteBiteCart.updateBadge(".cart-count");
}
