let basePriceElem = document.getElementById("displayPrice");
let basePrice = basePriceElem ? parseInt(basePriceElem.getAttribute("data-base-price") || basePriceElem.textContent, 10) : 240;
let currentPrice = basePrice;
let quantity = 1;

function updateTotal() {
    let addedCost = 0;

    const portions = document.getElementsByName("portion");
    for (const radio of portions) {
        if (radio.checked) {
            addedCost += Number.parseInt(radio.value, 10) || 0;
        }
    }

    const addons = document.querySelectorAll('input[type="checkbox"]:checked');
    addons.forEach((addon) => {
        addedCost += Number.parseInt(addon.value, 10) || 0;
    });

    currentPrice = basePrice + addedCost;
    updateDisplay();
}

function changeQty(amount) {
    if (quantity + amount > 0) {
        quantity += amount;
        updateDisplay();
    }
}

function updateDisplay() {
    const displayPrice = document.getElementById("displayPrice");
    const finalPrice = document.getElementById("finalPrice");
    const qtyDisplay = document.getElementById("qtyDisplay");

    if (displayPrice) displayPrice.textContent = String(currentPrice);
    if (finalPrice) finalPrice.textContent = String(currentPrice * quantity);
    if (qtyDisplay) qtyDisplay.textContent = String(quantity);
}

function addToCart() {
    if (!window.ByteBiteCart) {
        return;
    }

    const dishTitleElem = document.querySelector('.dish-title');
    const dishTitle = dishTitleElem ? dishTitleElem.textContent.trim() : "Item";
    const dishId = dishTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const resNameElem = document.querySelector('.restaurant-name');
    const resName = resNameElem ? resNameElem.textContent.replace("By ", "").trim() : "Byte-Bite";

    const mainImgElem = document.querySelector('.main-dish-img');
    const mainImage = mainImgElem ? mainImgElem.src : "";

    window.ByteBiteCart.addItem(
        {
            id: dishId,
            name: dishTitle,
            price: currentPrice,
            image: mainImage,
            restaurant: resName,
            rating: "4.5"
        },
        quantity
    );

    const button = document.querySelector(".add-to-cart-btn");
    const originalText = button.textContent;
    button.textContent = "ADDED TO CART";
    button.style.backgroundColor = "#2ecc71";
    button.style.color = "#ffffff";

    window.ByteBiteCart.updateBadge(".cart-count");

    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = "#eec643";
        button.style.color = "#000000";
    }, 900);
}

document.querySelectorAll(".mini-add").forEach((button) => {
    button.addEventListener("click", () => {
        if (!window.ByteBiteCart) {
            return;
        }

        const name = button.dataset.name || "Side Item";
        const price = Number.parseInt(button.dataset.price, 10) || 0;
        const image = button.dataset.image || "";

        const resNameElem = document.querySelector('.restaurant-name');
        const resName = resNameElem ? resNameElem.textContent.replace("By ", "").trim() : "Byte-Bite";

        window.ByteBiteCart.addItem(
            {
                id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                name,
                price,
                image,
                restaurant: resName,
                rating: "4.5"
            },
            1
        );

        const original = button.textContent;
        button.textContent = "Added";
        button.disabled = true;
        window.ByteBiteCart.updateBadge(".cart-count");

        setTimeout(() => {
            button.textContent = original;
            button.disabled = false;
        }, 700);
    });
});

updateTotal();
if (window.ByteBiteCart) {
    window.ByteBiteCart.updateBadge(".cart-count");
}

// === Reviews System Integration ===

const reviewModal = document.getElementById("reviewModal");
const reviewsContainer = document.getElementById("reviewsContainer");
const avgRatingDisplay = document.getElementById("avgRatingDisplay");
const avgStarsDisplay = document.getElementById("avgStarsDisplay");
const totalReviewsDisplay = document.getElementById("totalReviewsDisplay");

// Helper to get current product name
function getCurrentDishName() {
    const dishTitleElem = document.querySelector('.dish-title');
    return dishTitleElem ? dishTitleElem.textContent.trim() : "Unknown Item";
}

function openReviewModal() {
    const token = localStorage.getItem("bb_token");
    if (!token) {
        alert("Please login to write a review!");
        window.location.href = "login.html";
        return;
    }
    if(reviewModal) reviewModal.classList.add("active");
}

function closeReviewModal() {
    if(reviewModal) reviewModal.classList.remove("active");
}

// Generate stars HTML
function generateStarsHtml(rating) {
    let stars = "";
    const rounded = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
        if (i <= rounded) {
            stars += '<i class="fa-solid fa-star" style="color:#f1c40f"></i> ';
        } else {
            stars += '<i class="fa-solid fa-star" style="color:#ddd"></i> ';
        }
    }
    return stars;
}

// Load Reviews
async function loadReviews() {
    if(!reviewsContainer) return;
    
    const dishName = getCurrentDishName();
    try {
        const response = await fetch(`/api/reviews?menuItemName=${encodeURIComponent(dishName)}`);
        const result = await response.json();

        if (result.success && result.data) {
            const { reviews, stats } = result.data;
            
            // Update Stats Display
            if (stats.totalReviews > 0) {
                avgRatingDisplay.textContent = stats.averageRating.toFixed(1);
                avgStarsDisplay.innerHTML = generateStarsHtml(stats.averageRating);
                totalReviewsDisplay.textContent = `${stats.totalReviews} custom reviews`;
            } else {
                avgRatingDisplay.textContent = "0.0";
                totalReviewsDisplay.textContent = "No reviews yet. Be the first!";
            }

            // Update List Display
            reviewsContainer.innerHTML = "";
            if (reviews.length === 0) {
                reviewsContainer.innerHTML = '<p style="color:#777; font-family:\'Roboto\', sans-serif;">There are no reviews for this item yet.</p>';
            } else {
                reviews.forEach(review => {
                    const date = new Date(review.createdAt).toLocaleDateString();
                    reviewsContainer.innerHTML += `
                        <div class="review-card">
                            <div class="reviewer-header">
                                <div class="reviewer-avatar">${review.user.name.charAt(0).toUpperCase()}</div>
                                <div>
                                    <div class="reviewer-name">${review.user.name} <span style="color:#2ecc71; font-size:0.8rem; margin-left:5px;"><i class="fa-solid fa-circle-check"></i> Verified</span></div>
                                    <div class="review-date">${date}</div>
                                </div>
                            </div>
                            <div style="margin-bottom: 8px;">
                                ${generateStarsHtml(review.rating)}
                            </div>
                            <p class="review-comment">${review.comment}</p>
                        </div>
                    `;
                });
            }
        }
    } catch (error) {
        console.error("Error loading reviews:", error);
    }
}

// Submit Review
async function submitReview(e) {
    e.preventDefault();
    const token = localStorage.getItem("bb_token");
    if (!token) {
        alert("Please login first.");
        return;
    }

    const ratingInput = document.querySelector('input[name="rating"]:checked');
    const commentInput = document.getElementById("reviewComment");

    if (!ratingInput) {
        alert("Please select a star rating.");
        return;
    }

    const dishName = getCurrentDishName();
    const btn = document.getElementById("submitReviewBtn");
    
    try {
        btn.textContent = "Posting...";
        btn.disabled = true;

        const response = await fetch("/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                menuItemName: dishName,
                rating: parseInt(ratingInput.value, 10),
                comment: commentInput.value
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert("Thank you! Your review has been posted.");
            closeReviewModal();
            document.getElementById("reviewForm").reset();
            loadReviews(); // Refresh the DOM with the new review!
        } else {
            alert(data.message || "Failed to post review.");
        }
    } catch (error) {
        console.error("Error posting review:", error);
        alert("An error occurred. Please try again.");
    } finally {
        btn.textContent = "Post Review";
        btn.disabled = false;
    }
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    loadReviews();
});
