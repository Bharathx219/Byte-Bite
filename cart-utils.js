(function () {
    const CART_KEY = "bb_cart";

    function readCart() {
        try {
            const raw = localStorage.getItem(CART_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    function writeCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function normalizeId(value) {
        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }

    function getCart() {
        return readCart();
    }

    function clearCart() {
        writeCart([]);
    }

    function addItem(item, quantity) {
        const qty = Number.parseInt(quantity, 10) || 1;
        if (!item || qty <= 0) {
            return;
        }

        const id = normalizeId(item.id || item.name);
        if (!id) {
            return;
        }

        const cart = readCart();
        const existing = cart.find((entry) => entry.id === id);
        if (existing) {
            existing.qty += qty;
            existing.price = Number(item.price) || existing.price || 0;
            existing.name = item.name || existing.name;
            existing.image = item.image || existing.image;
            existing.restaurant = item.restaurant || existing.restaurant;
            existing.rating = item.rating || existing.rating;
        } else {
            cart.push({
                id,
                name: item.name || "Item",
                price: Number(item.price) || 0,
                qty,
                image: item.image || "",
                restaurant: item.restaurant || "Byte-Bite",
                rating: item.rating || "4.5"
            });
        }

        writeCart(cart);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    function setQuantity(id, quantity) {
        const cart = readCart();
        const target = cart.find((entry) => entry.id === id);
        if (!target) {
            return;
        }

        const qty = Number.parseInt(quantity, 10) || 0;
        if (qty <= 0) {
            writeCart(cart.filter((entry) => entry.id !== id));
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            return;
        }

        target.qty = qty;
        writeCart(cart);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    function removeItem(id) {
        const cart = readCart();
        writeCart(cart.filter((entry) => entry.id !== id));
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    function getItemCount() {
        return readCart().reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
    }

    function getTotals() {
        const cart = readCart();
        const itemTotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 0), 0);
        const deliveryFee = itemTotal > 0 ? 50 : 0;
        const platformFee = itemTotal > 0 ? 12 : 0;
        const taxes = itemTotal > 0 ? Math.round(itemTotal * 0.11) : 0;
        const grandTotal = itemTotal + deliveryFee + platformFee + taxes;
        return { itemTotal, deliveryFee, platformFee, taxes, grandTotal };
    }

    function updateBadge(selector) {
        const count = getItemCount();
        const badges = document.querySelectorAll(selector || ".cart-count");
        badges.forEach((badge) => {
            badge.textContent = String(count);
            badge.style.display = count > 0 ? "flex" : "none";
        });
    }

    window.ByteBiteCart = {
        CART_KEY,
        getCart,
        clearCart,
        addItem,
        setQuantity,
        removeItem,
        getItemCount,
        getTotals,
        updateBadge
    };
})();
