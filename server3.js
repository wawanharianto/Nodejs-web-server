const http = require('http');

const requestListener = (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Powered-By', 'Node.js');

    const { method, url } = request;

    if (url === '/') {
        if (method === 'GET') {
            response.statusCode = 200;
            response.end('<h1>Ini adalah halaman utama</h1>');
        } else {
            response.statusCode = 405; // Method Not Allowed
            response.end(`<h1>Metode ${method} tidak didukung pada halaman utama</h1>`);
        }
    } else if (url === '/about') {
        if (method === 'GET') {
            response.statusCode = 200;
            response.end('<h1>Halo! Ini adalah halaman about</h1>');
        } else if (method === 'POST') {
            let body = [];

            request.on('data', (chunk) => {
                body.push(chunk);
            });

            request.on('end', () => {
                body = Buffer.concat(body).toString();
                try {
                    const { name } = JSON.parse(body);
                    response.statusCode = 200;
                    response.end(`<h1>Halo, ${name}! Ini adalah halaman about</h1>`);
                } catch (error) {
                    response.statusCode = 400; // Bad Request
                    response.end('<h1>Format data tidak valid</h1>');
                }
            });
        } else {
            response.statusCode = 405; // Method Not Allowed
            response.end(`<h1>Halaman tidak dapat diakses menggunakan ${method} request</h1>`);
        }
    } else {
        response.statusCode = 404; // Not Found
        response.end('<h1>Halaman tidak ditemukan!</h1>');
    }
};

const server = http.createServer(requestListener);

const port = 5000;
const host = 'localhost';

server.listen(port, host, () => {
    console.log(`Server berjalan pada http://${host}:${port}`);
});
