let posts = []; // außerhalb speichern, damit global zugänglich

async function fetchMediumPosts() {
    const rssToJsonUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@thomas-hofmann';

    try {
        const res = await fetch(rssToJsonUrl);
        const data = await res.json();
        // console.log(data.items.length);
        // console.log(data.items);
        posts = data.items.slice(0, 6); // Last 6 posts

        const container = document.getElementById('medium-posts');
        container.innerHTML = posts.map(post => {
            // Entferne alle <h3>, <a> und <figcaption> aus der Description
            const cleanedDescription = post.description
                .replace(/<h3[^>]*>.*?<\/h3>/gi, '')
                .replace(/<h4[^>]*>.*?<\/h4>/gi, '')
                .replace(/<a[^>]*>.*?<\/a>/gi, '')
                .replace(/<figcaption[^>]*>.*?<\/figcaption>/gi, '');
            
            const imgMatch = cleanedDescription.match(/<img[^>]*>/i);
            const imageTag = imgMatch ? imgMatch[0] : '';

            const cleanedWithoutImage = cleanedDescription
                .replace(/<figure[^>]*>.*?<img[^>]*>.*?<\/figure>/gis, '') // entfernt komplettes <figure> mit <img>
                .replace(/<img[^>]*>/gi, ''); // entfernt einzelne <img>, falls außerhalb von <figure>

            const firstParagraph = cleanedWithoutImage.split('</p>')[0] + '</p>';

            // Kategorien-Badges erstellen
            const badges = post.categories.map(cat => `
        <span class="badge rounded-pill text-bg-dark m-1" data-aos="zoom-in" data-aos-anchor-placement="bottom-bottom">${cat}</span>
    `).join('');

            return `
        <div class="col-lg-4 col-md-6 mb-3 medium-post mb-2" data-aos="fade-up">
            <a href="${post.link}" target="_blank" class="text-decoration-none text-dark d-block h-100">
                <div class="card h-100 p-2">
                    <p class="text-muted mb-2 d-flex justify-content-between align-items-center">
                        <small>${new Date(post.pubDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric'})}</small>
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </p>
                    <div class="d-flex flex-column h-100">
                        <div>
                            <h4 class="post-title" data-aos="fade-up">${post.title}</h4>
                             <div data-aos="fade-up">
                                ${imageTag}
                            </div>
                            <div data-aos="zoom-in" data-aos-anchor-placement="bottom-bottom">
                                ${firstParagraph}
                            </div>
                        </div>
                        <div class="text-muted mb-1 mt-auto">
                            <small class="d-flex flex-wrap-reverse justify-content-center justify-content-md-start">${badges}</small>
                            <hr class="mb-2 mt-2">
                            <p class="mb-0" data-aos="fade-left" data-aos-anchor-placement="bottom-bottom"><small>Written by Thomas Hofmann</small></p>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `;
        }).join('');

        // 🆕 Bilder fertig laden lassen, dann AOS initialisieren oder refreshen
        const images = container.querySelectorAll('img');
        let loadedImages = 0;
        if (images.length === 0) {
            AOS.init(); // oder AOS.refresh();
        } else {
            images.forEach(img => {
                img.onload = img.onerror = () => {
                    loadedImages++;
                    if (loadedImages === images.length) {
                        AOS.init(); // sicherstellen, dass Animationen jetzt korrekt starten
                    }
                };
            });
        }

    } catch (err) {
        console.error('Error fetching Medium posts', err);
        document.getElementById('medium-posts').innerText = 'Failed to load posts.';
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