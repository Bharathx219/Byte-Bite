document.getElementById('forgotForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const btn = document.querySelector('.reset-btn');

    if(username) {
        const originalText = btn.innerText;
        btn.innerText = "Sending...";
        btn.style.backgroundColor = "#fff";

        setTimeout(() => {
            alert(`Password reset instructions sent to ${username}!`);
            
            window.location.href = "login.html"; 
        }, 1500);
    }
});