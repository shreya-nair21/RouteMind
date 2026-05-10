const fs = require('fs');
const https = require('https');

const data = JSON.parse(fs.readFileSync('C:/Users/Admin/.gemini/antigravity/brain/93d8aca1-dd49-4090-9297-c943ad1ea80d/.system_generated/steps/117/output.txt', 'utf8'));

if (!fs.existsSync('c:/Users/Admin/Desktop/Traveloop/frontend/stitch_exports')){
    fs.mkdirSync('c:/Users/Admin/Desktop/Traveloop/frontend/stitch_exports');
}

data.screens.forEach(screen => {
  if (!screen.htmlCode || !screen.htmlCode.downloadUrl) return;
  const url = screen.htmlCode.downloadUrl;
  const name = screen.title.replace(/[^a-zA-Z0-9]/g, '_') + '.html';
  
  https.get(url, (res) => {
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
      fs.writeFileSync('c:/Users/Admin/Desktop/Traveloop/frontend/stitch_exports/' + name, html);
      console.log(`Saved ${name}`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${name}: `, err);
  });
});
