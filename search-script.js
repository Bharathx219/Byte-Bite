document.querySelectorAll('.dish-item').forEach(item => {
    item.addEventListener('click', () => {
        const titleText = item.querySelector('p')?.textContent.toLowerCase() || "";

        if (titleText.includes("pizza") || titleText.includes("burger")) {
            window.location.href = "product-pizza.html";
        } else if (titleText.includes("paneer") || titleText.includes("veg") || titleText.includes("thali")) {
            window.location.href = "product-paneer.html";
        } else {
            window.location.href = "product.html"; // default to Biryani
        }
    });
});
