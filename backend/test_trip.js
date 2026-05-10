const http = require('http');

function post(url, data, token) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    });
    req.on('error', (e) => reject(e));
    req.write(JSON.stringify(data));
    req.end();
  });
}

async function test() {
  try {
    const login = await post('http://localhost:5000/api/auth/login', { email: 'alex@traveloop.com', password: 'password123' });
    console.log("Login Status:", login.status);
    if (!login.body.token) {
      console.log("Login failed", login.body);
      return;
    }

    const trip = await post('http://localhost:5000/api/trips', {
      destination: 'Test City',
      startDate: '2026-06-01',
      endDate: '2026-06-10',
      budget: 5000
    }, login.body.token);

    console.log("Trip Creation Status:", trip.status);
    console.log("Trip Data:", trip.body);
  } catch (err) {
    console.error(err);
  }
}

test();
