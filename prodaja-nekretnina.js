(function(){
    if (!document.getElementById('prodaja-nekretnina-embed-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.id = 'prodaja-nekretnina-embed-wrapper';
        document.body.appendChild(wrapper);
    }

    const frame = document.createElement('div');
    frame.id = 'prodaja-nekretnina-frame';
    frame.style.cssText = `
        border: 3px solid black;
        padding: 20px;
        max-width: 600px;
        width: 100%;
        margin: 0 auto;
        background: #fff;
        box-sizing: border-box;
        overflow: hidden;
    `;

    const container = document.createElement('div');
    container.id = 'prodaja-nekretnina-posts-container';
    container.style.cssText = 'width: 100%; box-sizing: border-box;';
    frame.appendChild(container);
    document.getElementById('prodaja-nekretnina-embed-wrapper').appendChild(frame);

    function fetchPosts() {
        $.ajax({
            url: 'https://besplatnioglas.rs/wp-json/wp/v2/categories?slug=prodaja-nekretnina',
            dataType: 'json',
            success: function(categories) {
                if(categories.length === 0) {
                    container.innerHTML = '<p>Kategorija nije pronađena.</p>';
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
<div style="margin-bottom:30px; width:100%; box-sizing:border-box;">
  <a href="${link}" target="_blank" rel="noopener" style="text-decoration:none; color:inherit; display:block; width:100%; box-sizing:border-box;">
    <div style="width:100%; overflow:hidden; margin:0 auto 10px auto; display:block; box-sizing:border-box;">
      <img src="${img}" alt="${title}" onload="this.style.width='100%'; this.style.maxWidth='100%'; this.style.height='auto'; this.style.maxHeight='500px'; this.style.objectFit='contain'; this.style.display='block'; this.style.margin='0 auto'; this.style.border='none'; this.style.boxSizing='border-box';">
    </div>
    <h3 style="font-size:18px; font-weight:bold; margin:10px 0 5px; color:#111; word-wrap:break-word;">${title}</h3>
    <p style="font-size:14px; color:#333; word-wrap:break-word;">${excerpt}</p>
  </a>
</div>`;
                        });
                        container.innerHTML = html;
                    },
                    error: function() {
                        container.innerHTML = '<p>Greška pri učitavanju postova.</p>';
                    }
                });
            },
            error: function() {
                container.innerHTML = '<p>Greška pri učitavanju kategorije.</p>';
            }
        });
    }

    function waitForjQ(cb) {
        if(window.jQuery) cb();
        else setTimeout(()=>waitForjQ(cb),50);
    }
    waitForjQ(fetchPosts);
})();
