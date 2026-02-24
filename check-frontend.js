const axios = require('axios');

const test = async () => {
    try {
        const html = await axios.get('https://expance-traker.vercel.app/');
        const match = html.data.match(/src="(\/assets\/index-[^"]+\.js)"/);

        if (match) {
            console.log('Found JS:', match[1]);
            const js = await axios.get('https://expance-traker.vercel.app' + match[1]);

            // Search for typical API endpoints inside the bundle
            const apiMatch = js.data.match(/https?:\/\/[a-zA-Z0-9.-]+(?:vercel\.app|localhost|onrender\.com)[^\"]*/g);
            if (apiMatch) {
                console.log('API URLs found in bundled JS:');
                console.log([...new Set(apiMatch)]);
            } else {
                console.log('No API URL found in bundle');
            }
        } else {
            console.log('JS bundle not found in HTML');
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
};

test();
