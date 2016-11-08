const cheerio = require('cheerio');

function convert(body) {
    let $ = cheerio.load(body);
    const artikel = $('td strong:contains("Artikelnummer")');
    const artikelId = artikel.parent().next();
    const id = artikelId.text().split('-')[0];
    let url = `https://balder.pthor.ch/products/catalogproduct/${id}`;
    $('h2.caption').append(`<a target="_blank" style="color: aquamarine" href="${url}">balder</a>`);
    // inject custom styles
    $('head').append('<link rel="stylesheet" href="/styles.css">');
    return $.html();
}

module.exports = convert;