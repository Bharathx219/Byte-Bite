const locationInput = document.querySelector(".location-box input");
const pizza = document.querySelector(".bg-pizza-right");

if (locationInput) {
    locationInput.value = localStorage.getItem("bb_location") || "";
    locationInput.addEventListener("change", () => {
        localStorage.setItem("bb_location", locationInput.value.trim());
    });
}

document.addEventListener("mousemove", (event) => {
    if (!pizza) {
        return;
    }
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;
    pizza.style.transform = `translate(-${x * 20}px, -${y * 20}px)`;
});
