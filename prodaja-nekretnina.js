(function(){
    const wrapper = document.getElementById('prodaja-nekretnina-embed-wrapper');
    if (!wrapper) return;

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.maxWidth = '600px';
    iframe.style.border = '3px solid black';
    iframe.style.display = 'block';
    iframe.style.margin = '0 auto';
    iframe.style.background = '#fff';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('loading', 'lazy');
    wrapper.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
<!DOCTYPE html>
<html lang="sr">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: sans-serif;
      box-sizing: border-box;
    }
    .post {
      margin-bottom: 30px;
    }
    .post img {
      width: 100%;
      max-width: 100%;
      height: auto;
      max-height: 500px;
      object-fit: contain;
      display: block;
      margin: 0 auto;
    }
    .title {
      font-size: 18px;
      font-weight: bold;
      margin: 10px 0 5px;
      color: #111;
    }
    .excerpt {
      font-size: 14px;
      color: #333;
    }
  </style>
</head>
<body>
  <div id="posts">Učitavanje...</div>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script>
    $.ajax({
      url: 'https://besplatnioglas.rs/wp-json/wp/v2/categories?slug=prodaja-nekretnina',
      dataType: 'json',
      success: function(categories) {
        if(categories.length === 0) {
          document.getElementById('posts').innerHTML = '<p>Kategorija nije pronađena.</p>';
          return;
        }
        const id = categories[0].id;
        $.ajax({
          url: 'https://besplatnioglas.rs/wp-json/wp/v2/posts?categories=' + id + '&per_page=5&_embed',
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

              html += \`
<div class="post">
  <a href="\${link}" target="_blank" rel="noopener">
    <img src="\${img}" alt="\${title}">
    <div class="title">\${title}</div>
    <div class="excerpt">\${excerpt}</div>
  </a>
</div>\`;
            });
            document.getElementById('posts').innerHTML = html;
          },
          error: function() {
            document.getElementById('posts').innerHTML = '<p>Greška pri učitavanju postova.</p>';
          }
        });
      },
      error: function() {
        document.getElementById('posts').innerHTML = '<p>Greška pri učitavanju kategorije.</p>';
      }
    });
  </script>
</body>
</html>
    `);
    doc.close();
})();
