const loginForm = document.getElementById("loginForm");
const loginButton = document.querySelector(".login-btn");

loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Signing In...";

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Save token and user data
            localStorage.setItem("bb_token", data.data.token);
            localStorage.setItem("bb_user", JSON.stringify(data.data.user));

            window.location.href = "menu.html";
        } else {
            alert(data.message || "Failed to sign in. Please check your credentials.");
            loginButton.disabled = false;
            loginButton.textContent = "Sign In";
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("A network error occurred. Please try again.");
        loginButton.disabled = false;
        loginButton.textContent = "Sign In";
    }
});
