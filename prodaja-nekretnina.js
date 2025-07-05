(function(){
    if (!document.getElementById('prodaja-nekretnina-embed-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.id = 'prodaja-nekretnina-embed-wrapper';
        document.body.appendChild(wrapper);
    }

    document.getElementById('prodaja-nekretnina-embed-wrapper').innerHTML = `
<div id="prodaja-nekretnina-frame" style="border: 3px solid black; padding: 20px; max-width: 600px; width: 100%; margin: 0 auto; background-color: #fff; box-sizing: border-box;">
  <div id="prodaja-nekretnina-posts-container" style="width: 100%; box-sizing: border-box;"></div>
</div>
`;

    function fetchPosts() {
        $.ajax({
            url: 'https://besplatnioglas.rs/wp-json/wp/v2/categories?slug=prodaja-nekretnina',
            dataType: 'json',
            success: function(categories) {
                if(categories.length === 0) {
                    document.getElementById('prodaja-nekretnina-posts-container').innerHTML = '<p>Kategorija nije pronađena.</p>';
                    return;
                }
                const id = categories[0].id;
                $.ajax({
                    url: `https://besplatnioglas.rs/wp-json/wp/v2/posts?categories=${id}&per_page=5&_embed`,
                    dataType: 'json',
                    success: function(posts) {
                        let html = '';
                        posts.forEach(function(p) {
                            const title = $('<textarea>').html(p.title.rendered).text();
                            const link = p.link;
                            const img = p._embedded && p._embedded["wp:featuredmedia"]
                                ? p._embedded["wp:featuredmedia"][0].source_url
                                : "https://via.placeholder.com/600x300?text=Bez+slike";
                            const raw = p.excerpt.rendered.replace(/<[^>]*>?/gm, '');
                            const excerpt = raw.length > 200 ? raw.substr(0,200) + '...' : raw;

                            html += `
<a href="${link}" target="_blank" rel="noopener" style="display: block; text-align: center; margin-bottom: 30px; text-decoration: none; color: inherit;">
  <div style="position: relative; height: 200px; overflow: hidden; max-width: 100%;">
    <img src="${img}" alt="${title}" style="position: absolute; top: 50%; left: 0; right: 0; transform: translateY(-50%); width: 100%; height: auto; border: none;" />
  </div>
  <h3 style="margin-top: 10px; font-size: 18px;">${title}</h3>
  <p style="font-size: 14px; color: #333;">${excerpt}</p>
</a>`;
                        });
                        document.getElementById('prodaja-nekretnina-posts-container').innerHTML = html;
                    },
                    error: function() {
                        document.getElementById('prodaja-nekretnina-posts-container').innerHTML = '<p>Greška pri učitavanju postova.</p>';
                    }
                });
            },
            error: function() {
                document.getElementById('prodaja-nekretnina-posts-container').innerHTML = '<p>Greška pri učitavanju kategorije.</p>';
            }
        });
    }

    function waitForjQ(cb) {
        if(window.jQuery) cb();
        else setTimeout(()=>waitForjQ(cb),50);
    }
    waitForjQ(fetchPosts);
})();
