const fileInput = document.getElementById("file-upload");
const avatarCircle = document.getElementById("avatarCircle");
const editForm = document.getElementById("editForm");
const updateBtn = document.querySelector(".update-btn");

function loadProfile() {
    const username = localStorage.getItem("bb_username") || "";
    const email = localStorage.getItem("bb_email") || "";
    const phone = localStorage.getItem("bb_phone") || "";
    const avatar = localStorage.getItem("bb_avatar");

    document.getElementById("username").value = username;
    document.getElementById("email").value = email;
    document.getElementById("phone").value = phone;

    if (avatar && avatarCircle) {
        avatarCircle.innerHTML = `<img src="${avatar}" alt="Profile photo" style="width:100%;height:100%;object-fit:cover;">`;
    }
}

fileInput?.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = (readEvent) => {
        const imageData = readEvent.target.result;
        localStorage.setItem("bb_avatar", imageData);
        if (avatarCircle) {
            avatarCircle.innerHTML = `<img src="${imageData}" alt="Profile photo" style="width:100%;height:100%;object-fit:cover;">`;
        }
    };
    reader.readAsDataURL(file);
});

editForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!username || !email || !phone) {
        alert("Please fill name, email, and phone number.");
        return;
    }

    localStorage.setItem("bb_username", username);
    localStorage.setItem("bb_email", email);
    localStorage.setItem("bb_phone", phone);

    updateBtn.disabled = true;
    updateBtn.textContent = "Saving...";

    setTimeout(() => {
        window.location.href = "profile.html";
    }, 700);
});

loadProfile();
