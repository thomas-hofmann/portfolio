document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("year").textContent = new Date().getFullYear();
     fetch('/backend/article-counter.php')
        .catch(err => {
            // Optional: Fehlerbehandlung (z. B. Logging)
            console.warn('Fehler beim Aufruf von update-article-counter.php:', err);
        });

    fetch('/backend/data.json')
        .then(response => {
            if (!response.ok) throw new Error('Netzwerkfehler');
            return response.json();
        })
        .then(data => {
            const counterElement = document.getElementById('medium-counter');
            if (counterElement && data['article-counter']) {
                counterElement.textContent = data['article-counter'];
            }
        })
        .catch(err => {
            console.warn('Fehler beim Laden des Artikelzählers:', err);
        });

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

    if (!sessionStorage.getItem("counted")) {
        fetch('backend/counter.php')
        .then(res => res.json())
        .then(data => {
            document.getElementById('visitor-count').textContent = data.total;
            sessionStorage.setItem("counted", "true");
        });
    } else {
        fetch('backend/counter.txt')
        .then(res => res.text())
        .then(count => {
            document.getElementById('visitor-count').textContent = count;
        });
    }
});

