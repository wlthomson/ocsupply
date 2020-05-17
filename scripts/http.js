/**
 * http.js
 * 
 * Helper HTTP wrappers.
 */

const http = require('http');

const get = options => new Promise((resolve, reject) => {
    const buffer = [];
    const request = http.request({...options, method: 'GET' }, response => {
        response.on('data', data => buffer.push(data));
        response.on('end', () => {
            try {
                const body = Buffer.concat(buffer).toString();
                resolve(JSON.parse(body));
            } catch (e) {
              console.error(e.message);
            }
          });
    })
    
    request.on('error', error => reject(error));
    request.end();
});

const put = (options, data = {}) => new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const headers = {
        'Content-Type': 'application/json',
        'Content-Length': body.length
    };
    const buffer = [];
    const request = http.request({ ...options, headers, method: 'PUT'}, response => {
        response.on('data', data => buffer.push(data));
        response.on('end', () => {
            try {
                const body = Buffer.concat(buffer).toString();
                resolve(JSON.parse(body));
            } catch (e) {
              console.error(e.message);
            }
          });
    })
    
    request.on('error', error => reject(error));
    request.write(body);
    request.end();
});

module.exports = { get, put };