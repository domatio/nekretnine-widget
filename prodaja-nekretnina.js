(function(){
    const wrapperId = 'prodaja-nekretnina-embed-wrapper';
    const containerId = 'prodaja-nekretnina-posts-container';

    if (!document.getElementById(wrapperId)) {
        const wrapper = document.createElement('div');
        wrapper.id = wrapperId;
        document.body.appendChild(wrapper);
    }

    document.getElementById(wrapperId).innerHTML = `
<div style="border: 3px solid black; padding: 20px; max-width: 600px; width: 100%; margin: 0 auto; background-color: #fff; box-sizing: border-box;">
  <div id="${containerId}" style="width: 100%; box-sizing: border-box;"></div>
</div>
`;

    function fetchPosts() {
        $.ajax({
            url: 'https://besplatnioglas.rs/wp-json/wp/v2/categories?slug=prodaja-nekretnina',
            dataType: 'json',
            success: function(categories) {
                if (!categories.length) {
                    document.getElementById(containerId).innerHTML = '<p>Kategorija nije pronađena.</p>';
                    return;
                }

                const categoryId = categories[0].id;
                const postsURL = `https://besplatnioglas.rs/wp-json/wp/v2/posts?categories=${categoryId}&per_page=3&_embed`;

                $.ajax({
                    url: postsURL,
                    dataType: 'json',
                    success: function(posts) {
                        let html = '';

                        posts.forEach(function(post) {
                            const title = $('<textarea>').html(post.title.rendered).text();
                            const link = post.link;
                            const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://via.placeholder.com/600x300?text=Bez+slike";
                            const excerptRaw = post.excerpt.rendered.replace(/<[^>]*>?/gm, '');
                            const excerpt = excerptRaw.length > 200 ? excerptRaw.substr(0, 200) + '...' : excerptRaw;

                            html += `
<a href="${link}" target="_blank" rel="noopener" style="display: block; text-align: center; margin-bottom: 30px; text-decoration: none; color: inherit;">
  <div style="position: relative; height: 200px; overflow: hidden; max-width: 100%;">
    <img src="${image}" alt="${title}" style="position: absolute; top: 50%; left: 0; transform: translateY(-50%); width: 100%; height: auto; max-height: 200px; object-fit: contain; border: none; display: block;" />
  </div>
  <h3 style="margin-top: 10px; font-size: 18px;">${title}</h3>
  <p style="font-size: 14px; color: #333;">${excerpt}</p>
</a>`;
                        });

                        document.getElementById(containerId).innerHTML = html;
                    },
                    error: function() {
                        document.getElementById(containerId).innerHTML = '<p>Greška pri učitavanju postova.</p>';
                    }
                });
            },
            error: function() {
                document.getElementById(containerId).innerHTML = '<p>Greška pri učitavanju kategorije.</p>';
            }
        });
    }

    function waitForjQ(cb) {
        if (window.jQuery) cb();
        else setTimeout(() => waitForjQ(cb), 50);
    }

    waitForjQ(fetchPosts);
})();
