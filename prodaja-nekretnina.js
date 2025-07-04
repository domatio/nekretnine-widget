(function(){
    const styleContent = `
.prodaja-nekretnina-post-image-container {
    width: 100% !important;
    overflow: hidden !important;
}
.prodaja-nekretnina-post-image {
    max-width: 100% !important;
    width: 100% !important;
    height: auto !important;
    display: block !important;
    object-fit: contain !important;
}
.prodaja-nekretnina-post {
    margin-bottom: 40px !important;
    box-sizing: border-box !important;
}
.prodaja-nekretnina-post-title {
    margin-top: 10px !important;
    text-align: center !important;
    font-size: 18px !important;
    word-wrap: break-word !important;
}
.prodaja-nekretnina-post-excerpt {
    margin-top: 8px !important;
    font-size: 14px !important;
    color: #555 !important;
    text-align: justify !important;
    padding: 0 5px !important;
    box-sizing: border-box !important;
    word-wrap: break-word !important;
}
body, html {
    overflow-x: hidden !important;
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
                const categoryId = categories[0].id;

                $.ajax({
                    url: `https://besplatnioglas.rs/wp-json/wp/v2/posts?categories=${categoryId}&per_page=5&_embed`,
                    dataType: 'json',
                    success: function(posts) {
                        let output = '';
                        posts.forEach(function(post) {
                            const title = $('<textarea>').html(post.title.rendered).text();
                            const link = post.link;
                            const image = post._embedded && post._embedded["wp:featuredmedia"] 
                                ? post._embedded["wp:featuredmedia"][0].source_url 
                                : "https://via.placeholder.com/600x300?text=Bez+slike";
                            const excerptRaw = post.excerpt.rendered.replace(/<[^>]*>?/gm, '');
                            const excerpt = excerptRaw.length > 200 ? excerptRaw.substr(0, 200) + '...' : excerptRaw;

                            output += 
                                `<div class="prodaja-nekretnina-post">
                                    <a href="${link}" target="_blank" style="text-decoration: none; color: inherit;">
                                        <div class="prodaja-nekretnina-post-image-container">
                                            <img class="prodaja-nekretnina-post-image" src="${image}" alt="${title}" />
                                        </div>
                                        <h3 class="prodaja-nekretnina-post-title">${title}</h3>
                                        <p class="prodaja-nekretnina-post-excerpt">${excerpt}</p>
                                    </a>
                                </div>`;
                        });
                        $('#prodaja-nekretnina-posts-container').html(output);
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

    function waitForjQuery(callback) {
        if(window.jQuery) {
            callback();
        } else {
            setTimeout(() => waitForjQuery(callback), 50);
        }
    }
    waitForjQuery(fetchPosts);
})();
