document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const btn = document.querySelector('.login-btn');

    if (!name || !email || !password || !confirmPassword) {
        alert("Please fill in all the required fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    btn.innerText = "Processing...";
    btn.disabled = true;

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Save token and user details to localStorage
            localStorage.setItem("bb_token", data.data.token);
            localStorage.setItem("bb_user", JSON.stringify(data.data.user));

            window.location.href = "menu.html";
        } else {
            alert(data.message || "Failed to register. The email might already be in use.");
            btn.disabled = false;
            btn.innerText = "CONTINUE";
        }
    } catch (error) {
        console.error("Signup error:", error);
        alert("A network error occurred. Please try again later.");
        btn.disabled = false;
        btn.innerText = "CONTINUE";
    }
});