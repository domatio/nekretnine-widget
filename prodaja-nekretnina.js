(function(){
    const styleContent = `
/* Ovaj CSS obara stilove Blogger teme i garantuje da slika ostaje unutar margina */
#prodaja-nekretnina-wrapper,
#prodaja-nekretnina-posts-container,
.prodaja-nekretnina-post,
.prodaja-nekretnina-post-image-container,
.prodaja-nekretnina-post-image {
    all: unset !important;
}
#prodaja-nekretnina-wrapper {
    display: block !important;
    box-sizing: border-box !important;
    max-width: 600px !important;
    margin: 0 auto !important;
    padding: 0 10px !important;
}
.prodaja-nekretnina-post {
    display: block !important;
    margin-bottom: 40px !important;
}
.prodaja-nekretnina-post-image-container {
    display: block !important;
    width: 100% !important;
    box-sizing: border-box !important;
}
.prodaja-nekretnina-post-image {
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    display: block !important;
}
.prodaja-nekretnina-post-title,
.prodaja-nekretnina-post-excerpt {
    display: block !important;
    box-sizing: border-box !important;
    color: inherit !important;
    font: inherit !important;
    text-align: left !important;
}
a.prodaja-nekretnina-link {
    display: block !important;
    text-decoration: none !important;
    color: inherit !important;
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
                    $('#prodaja-nekretnina-posts-container').html('<p>Kategorija nije pronađena.</p>');
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
                        $('#prodaja-nekretnina-posts-container').html(html);
                    },
                    error: function() {
                        $('#prodaja-nekretnina-posts-container').html('<p>Greška pri učitavanju postova.</p>');
                    }
                });
            },
            error: function() {
                $('#prodaja-nekretnina-posts-container').html('<p>Greška pri učitavanju kategorije.</p>');
            }
        });
    }

    function waitForjQ(cb) {
        if(window.jQuery) cb();
        else setTimeout(()=>waitForjQ(cb),50);
    }
    waitForjQ(fetchPosts);
})();
