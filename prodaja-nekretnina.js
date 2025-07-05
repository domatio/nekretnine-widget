(function(){
    if (!document.getElementById('prodaja-nekretnina-embed-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.id = 'prodaja-nekretnina-embed-wrapper';
        document.body.appendChild(wrapper);
    }

    document.getElementById('prodaja-nekretnina-embed-wrapper').innerHTML = `
<div id="prodaja-nekretnina-frame">
  <div id="prodaja-nekretnina-posts-container"></div>
</div>
`;

    const styleContent = `
#prodaja-nekretnina-frame {
    border: 3px solid black;
    padding: 20px;
    max-width: 100%;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background-color: #fff;
    box-sizing: border-box;
    overflow: hidden;
}

#prodaja-nekretnina-posts-container {
    width: 100%;
    box-sizing: border-box;
}

.prodaja-nekretnina-post {
    margin-bottom: 30px;
    width: 100%;
    box-sizing: border-box;
}

.prodaja-nekretnina-post-image-container {
    width: 100%;
    overflow: hidden;
    margin: 0 auto 10px auto;
    display: block;
    box-sizing: border-box;
}

.prodaja-nekretnina-post-image {
    display: block;
    width: 100%;
    height: auto;
    max-height: 500px;
    object-fit: contain;
    border: none;
    max-width: 100%;
}

.prodaja-nekretnina-post-title {
    font-size: 18px;
    font-weight: bold;
    margin: 10px 0 5px;
    color: #111;
    word-wrap: break-word;
}

.prodaja-nekretnina-post-excerpt {
    font-size: 14px;
    color: #333;
    word-wrap: break-word;
}

a.prodaja-nekretnina-link {
    text-decoration: none;
    color: inherit;
    display: block;
    width: 100%;
    box-sizing: border-box;
}
`;

    const style = document.createElement('style');
    style.textContent = styleContent;
    document.head.appendChild(style);

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
<div class="prodaja-nekretnina-post">
  <a class="prodaja-nekretnina-link" href="${link}" target="_blank" rel="noopener">
    <div class="prodaja-nekretnina-post-image-container">
      <img class="prodaja-nekretnina-post-image" src="${img}" alt="${title}">
    </div>
    <h3 class="prodaja-nekretnina-post-title">${title}</h3>
    <p class="prodaja-nekretnina-post-excerpt">${excerpt}</p>
  </a>
</div>`;
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
