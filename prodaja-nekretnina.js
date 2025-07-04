function fetchProdajaNekretninaPosts() {
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

$(document).ready(function() {
    fetchProdajaNekretninaPosts();
});
