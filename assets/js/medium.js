let posts = []; // außerhalb speichern, damit global zugänglich

async function fetchMediumPosts() {
    const API_KEY = 'w547tgiprgmypbdzz6hs41geopwtolhntn0zvngw';
    const MEDIUM_FEED = 'https://medium.com/feed/@thomas-hofmann';
    const rssToJsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(MEDIUM_FEED)}&api_key=${API_KEY}`;
    const container = document.getElementById('medium-posts');

    try {
        const res = await fetch(rssToJsonUrl);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // Validierung der Antwortstruktur
        if (data.status !== "ok" || !Array.isArray(data.items)) {
            throw new Error('API returned invalid data structure');
        }

        posts = data.items.slice(0, 6); // Nur die letzten 6 Artikel

        // HTML generieren
        container.innerHTML = posts.map(post => {
            let subtitle = 'Discover more in this article';
            const h4FigurePattern = /<h4[^>]*>(.*?)<\/h4>(?=\s*<figure[^>]*>)/is;
            const subtitleMatch = post.description.match(h4FigurePattern);
            if (subtitleMatch) {
                subtitle = subtitleMatch[1];
            }

            const cleanedDescription = post.description
                .replace(/<h3[^>]*>.*?<\/h3>/gi, '')
                .replace(/<h4[^>]*>.*?<\/h4>/gi, '')
                .replace(/<a[^>]*>.*?<\/a>/gi, '')
                .replace(/<figcaption[^>]*>.*?<\/figcaption>/gi, '');

            const imgMatch = cleanedDescription.match(/<img[^>]*>/i);
            const imageTag = imgMatch ? imgMatch[0] : '';

            const cleanedWithoutImage = cleanedDescription
                .replace(/<figure[^>]*>.*?<img[^>]*>.*?<\/figure>/gis, '')
                .replace(/<img[^>]*>/gi, '');

            const firstParagraph = cleanedWithoutImage.split('</p>')[0] + '</p>';

            const badges = post.categories.map(cat => `
                <span class="badge text-bg-dark m-1" data-aos="zoom-in" data-aos-anchor-placement="bottom-bottom">${cat}</span>
            `).join('');

            return `
                <div class="col-lg-4 col-md-6 medium-post" data-aos="fade-up">
                    <a href="${post.link}" target="_blank" class="text-decoration-none text-dark d-block h-100">
                        <div class="card h-100 p-2">
                            <p class="text-muted mb-2 d-flex justify-content-between align-items-center">
                                <small>${new Date(post.pubDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric'})}</small>
                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            </p>
                            <div class="d-flex flex-column h-100">
                                <div>
                                    <div class="post-title" data-aos="fade-up">
                                        <h4>${post.title}</h4>
                                        ${subtitle ? `<h6 class="text-muted fst-italic">${subtitle}</h6>` : ''}
                                    </div>
                                    <div data-aos="fade-up">
                                        ${imageTag}
                                    </div>
                                    <div data-aos="zoom-in" data-aos-anchor-placement="center-bottom">
                                        ${firstParagraph}
                                    </div>
                                </div>
                                <div class="text-muted mb-1 mt-auto">
                                    <small class="d-flex flex-wrap-reverse justify-content-center justify-content-md-start">${badges}</small>
                                    <hr class="mb-2 mt-2">
                                    <p class="mb-0 fst-italic" data-aos="fade-left" data-aos-anchor-placement="bottom-bottom"><small>Written by Thomas Hofmann</small></p>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        }).join('');

        // Bilder laden → AOS starten
        const images = container.querySelectorAll('img');
        let loadedImages = 0;
        if (images.length === 0) {
            AOS.init();
        } else {
            images.forEach(img => {
                img.onload = img.onerror = () => {
                    loadedImages++;
                    if (loadedImages === images.length) {
                        AOS.init();
                    }
                };
            });
        }

    } catch (err) {
        console.error('Error fetching Medium posts:', err);

        // Fallback UI bei Fehler
        container.innerHTML = `
            <div class="alert alert-warning text-center" role="alert">
                <strong>Beiträge konnten nicht geladen werden.</strong><br>
                Bitte versuche es später erneut.
            </div>
        `;
    }
}

function triggerResize() {
    window.dispatchEvent(new Event('resize'));
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
}

document.addEventListener("DOMContentLoaded", function () {
    AOS.init();
    fetchMediumPosts();
    triggerResize();

    const randomBtn = document.getElementById('random-article-btn');
    randomBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (posts.length > 0) {
            const randomPost = posts[Math.floor(Math.random() * posts.length)];
            window.open(randomPost.link, '_blank');
        }
    });
});