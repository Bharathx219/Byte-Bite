const pages = {
    ORDERS: `
        <h2 class="section-title">Your orders</h2>
        <div class="orders-list">
            <div class="order-card highlight">
                <img src="Biryani.png" alt="Biryani">
                <h3>Chicken biryani</h3>
            </div>
            <div class="order-card">
                <img src="https://www.pngall.com/wp-content/uploads/15/Masala-Dosa-PNG-Photos.png" alt="Dosa">
                <h3>Masal dosa</h3>
            </div>
            <div class="order-card">
                <img src="https://www.pngmart.com/files/5/Samosa-PNG-Transparent-Image.png" alt="Samosa">
                <h3>Samosa</h3>
            </div>
            <div class="order-card">
                <img src="https://www.pngkey.com/png/full/231-2311910_paneer-butter-masala-paneer-butter-masala-png.png" alt="Paneer">
                <h3>Paneer butter masala</h3>
            </div>
        </div>
    `,
    FAVOURITES: `
        <h2 class="section-title">Favourites</h2>
        <div class="orders-list">
            <div class="order-card">
                <img src="https://www.pngmart.com/files/16/Burger-And-Fries-Transparent-PNG.png" alt="Burger">
                <div style="width:100%; display:flex; justify-content:space-between; align-items:center;">
                    <h3>Chicken Burger</h3>
                    <i class="fa-solid fa-heart" style="color: #d1504d;"></i>
                </div>
            </div>
            <div class="order-card">
                <img src="https://www.pngall.com/wp-content/uploads/4/French-Fries-PNG-File.png" alt="Fries">
                <div style="width:100%; display:flex; justify-content:space-between; align-items:center;">
                    <h3>Large Fries</h3>
                    <i class="fa-solid fa-heart" style="color: #d1504d;"></i>
                </div>
            </div>
        </div>
    `,
    ADDRESSES: `
        <div class="empty-state">
            <div class="door-icon">
                <i class="fa-solid fa-door-closed"></i>
            </div>
            <h3>Can't find a Door to Knock</h3>
            <p>YOU DONT HAVE ANY ADDRESS TO DELIVER</p>
        </div>
    `,
    SETTINGS: `
        <h2 class="section-title">SMS preference</h2>
        <div class="settings-row">
            <span>Recommendations & Reminders</span>
            <label class="switch">
                <input type="checkbox" checked>
                <span class="slider"></span>
            </label>
        </div>
    `,
    PAYMENTS: `
        <div class="payments-wrapper">
            <h2 class="section-title">Payments</h2>
            <div class="no-payments">
                NO PAYMENTS YET
            </div>
        </div>
    `
};

const menuItems = document.querySelectorAll('.menu-item');
const contentArea = document.querySelector('.content-area');
const logoutBtn = document.getElementById('logoutBtn');
const editProfileBtn = document.getElementById('editProfileBtn');

function loadContent(sectionName) {
    if (!contentArea) return;
    if (pages[sectionName]) {
        contentArea.innerHTML = pages[sectionName];
        return;
    }
    contentArea.innerHTML = `<h2>${sectionName}</h2><p>Coming Soon...</p>`;
}

menuItems.forEach((item) => {
    item.addEventListener('click', () => {
        menuItems.forEach((menuItem) => {
            menuItem.style.backgroundColor = 'transparent';
            menuItem.classList.remove('active');
        });

        item.style.backgroundColor = '#eee';
        item.classList.add('active');

        const label = item.querySelector('span');
        const sectionName = label ? label.innerText.trim() : '';
        loadContent(sectionName);
    });
});

window.onload = () => {
    const firstItem = menuItems[0];
    if (firstItem) {
        firstItem.style.backgroundColor = '#eee';
        loadContent('ORDERS');
    }
};

logoutBtn?.addEventListener('click', () => {
    if (confirm('Are you sure you want to log out?')) {
        window.location.href = 'index.html';
    }
});

editProfileBtn?.addEventListener('click', () => {
    window.location.href = 'edit-profile.html';
});
