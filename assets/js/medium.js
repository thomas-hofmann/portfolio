async function fetchMediumPosts() {
    const rssToJsonUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@thomas-hofmann';

    try {
        const res = await fetch(rssToJsonUrl);
        const data = await res.json();
        const posts = data.items.slice(0, 3); // Last 2 posts

        const container = document.getElementById('medium-posts');
        container.innerHTML = posts.map(post => `
            <div class="col-lg-4 col-md-6 mb-3 mb-md-0 medium-post">
                <a href="${post.link}" target="_blank" class="text-decoration-none text-dark d-block h-100">
                    <div class="card h-100 p-2" data-aos="fade-up">
                        <p class="text-muted mb-2">${post.pubDate.slice(0, 10)}</p>
                        <div class="d-flex flex-column justify-content-between" style="height:100%;">
                            <h4>${post.title}</h4>
                            <p>${post.description.split('</p>')[0]}</p>
                        </div>
                    </div>
                </a>
            </div>
        `).join('');

        // AOS aktualisieren
        AOS.refreshHard();

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
});