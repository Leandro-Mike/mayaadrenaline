const https = require('https');

const url = 'https://back.mayaadrenaline.com.mx/wp-json/wp/v2/excursion?per_page=1';

console.log('Fetching', url);

https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
        // console.log('Data chunk received');
    });
}).on('error', (e) => {
    console.error(e);
});
