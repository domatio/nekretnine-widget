(function () {
    const containerId = 'prodaja-nekretnina-widget-container';

    function createContainer() {
        if (!document.getElementById(containerId)) {
            const container = document.createElement('div');
            container.id = containerId;
            container.style.maxWidth = '100%';
            container.style.margin = '0 auto';
            document.body.appendChild(container);
        }
    }

    function fetchPosts() {
        $.getJSON('https://besplatnioglas.rs/wp-json/wp/v2/categories?slug=prodaja-nekretnina', function (categories) {
            if (!categories.length) {
                document.getElementById(containerId).innerHTML = '<p>Kategorija nije pronađena.</p>';
                return;
            }

            const categoryId = categories[0].id;
            const postsURL = `https://besplatnioglas.rs/wp-json/wp/v2/posts?categories=${categoryId}&per_page=3&_embed`;

            $.getJSON(postsURL, function (posts) {
                let html = '';

                posts.forEach(function (post) {
                    const title = $('<textarea>').html(post.title.rendered).text();
                    const link = post.link;
                    const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://via.placeholder.com/600x300?text=Bez+slike";

                    html += `
<a href="${link}" target="_blank" style="display: block; text-align: center; margin-bottom: 30px; text-decoration: none; color: inherit;">
    <div style="position: relative; height: 200px; overflow: hidden; max-width: 100%;">
        <img src="${image}" alt="${title}" style="position: absolute; top: 50%; left: 0; right: 0; transform: translateY(-50%); width: 100%; height: auto; border: none;" />
    </div>
    <h3 style="margin-top: 10px; font-size: 18px;">${title}</h3>
</a>`;
                });

                document.getElementById(containerId).innerHTML = html;
            });
        });
    }

    function waitForjQ(cb) {
        if (window.jQuery) cb();
        else setTimeout(() => waitForjQ(cb), 50);
    }

    createContainer();
    waitForjQ(fetchPosts);
})();
