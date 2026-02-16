const https = require('http');

const url = 'http://mayaadrenaline.local/wp-json/wp/v2/excursion?per_page=1';

console.log('Fetching', url);

https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
        // process.stdout.write(d);
    });
}).on('error', (e) => {
    console.error(e);
});
