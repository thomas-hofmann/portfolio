document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("year").textContent = new Date().getFullYear();

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));
    
    fetch('/backend/article-counter.php')
        .catch(err => {
            console.warn('Fehler beim Aufruf von article-counter.php:', err);
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

    // Alle Abschnitts-IDs ermitteln (z. B. section[id])
    const sections = Array.from(document.querySelectorAll("section[id]"));
    const sectionOffsets = sections.map(section => section.offsetTop);

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function scrollToSection(index) {
        if (sections[index]) {
            sections[index].scrollIntoView({ behavior: "smooth" });
        }
    }

    function getNextSectionIndex() {
        const scrollPos = window.scrollY + 10; // kleine Toleranz
        for (let i = 0; i < sectionOffsets.length; i++) {
            if (scrollPos < sectionOffsets[i] - 10) {
                return i;
            }
        }
        return -1; // Kein nächster Abschnitt mehr
    }

    scrollIcon.addEventListener("click", () => {
        const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;

        if (atBottom) {
            // Ganz unten: nach ganz oben
            scrollToTop();
        } else {
            // Sonst: zum nächsten Abschnitt scrollen
            const nextIndex = getNextSectionIndex();
            if (nextIndex !== -1) {
                scrollToSection(nextIndex);
            } else {
                // Fallback: ganz nach unten
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth"
                });
            }
        }
    });

    // Icon wechseln je nach Scrollposition
    window.addEventListener("scroll", () => {
        const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
        icon.classList.toggle("fa-circle-down", !atBottom);
        icon.classList.toggle("fa-circle-up", atBottom);
    });
});

