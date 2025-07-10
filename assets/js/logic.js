document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("year").textContent = new Date().getFullYear();

    const scrollIcon = document.getElementById("scroll-icon");
    const icon = scrollIcon.querySelector("i");

    function scrollToBottom() {
        window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
        });
    }

    function scrollToTop() {
        window.scrollTo({
        top: 0,
        behavior: "smooth"
        });
    }

    scrollIcon.addEventListener("click", () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        // already at bottom → scroll up
        scrollToTop();
        } else {
        // not at bottom → scroll down
        scrollToBottom();
        }
    });

    // Wechsel Icon je nach Scroll-Position
    window.addEventListener("scroll", () => {
        const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
        icon.classList.toggle("fa-circle-down", !atBottom);
        icon.classList.toggle("fa-circle-up", atBottom);
    });
});

