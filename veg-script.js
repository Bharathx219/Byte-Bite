const scrollLeftBtn = document.getElementById("scrollLeft");
const scrollRightBtn = document.getElementById("scrollRight");
const carousel = document.getElementById("carousel");

scrollLeftBtn?.addEventListener("click", () => {
    carousel?.scrollBy({ left: -200, behavior: "smooth" });
});

scrollRightBtn?.addEventListener("click", () => {
    carousel?.scrollBy({ left: 200, behavior: "smooth" });
});

// Using inline onclick=... in HTML for product specific redirects
document.querySelectorAll(".circle-item").forEach((card) => {
    card.addEventListener("click", () => {
        window.location.href = "product-paneer.html";
    });
});

if (window.ByteBiteCart) {
    window.ByteBiteCart.updateBadge(".cart-count");
}
