/**
 * demo.js
 * 
 * Basic proof of concept for mapping relational data to a document database.
 */

const http = require('http');
const fs = require('fs');

const HOST = 'localhost';
const PORT = 5984;
const AUTH = 'admin:pass';

const get = path => new Promise((resolve, reject) => {
    const options = {
        hostname: HOST,
        port: PORT,
        path,
        method: 'GET',
        auth: AUTH,
    }

    const buffer = [];
    const request = http.request(options, response => {
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

const put = (path, data = {}) => new Promise((resolve, reject) => {
    const body = JSON.stringify(data);

    const options = {
        hostname: HOST,
        port: PORT,
        path,
        method: 'PUT',
        auth: AUTH,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length
        }
    }


    const buffer = [];
    const req = http.request(options, response => {
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
    
    req.on('error', error => reject(error));
    req.write(body);
    req.end();
});

const main = async () => {
    const stores = JSON.parse(fs.readFileSync('stores.json', 'utf8'));
    const items = JSON.parse(fs.readFileSync('items.json', 'utf8'));
    const storeItems = JSON.parse(fs.readFileSync('store_item.json', 'utf8'));

    // Create ocsupply database.
    await put('/ocsupply');

    // Setup store keys.
    await stores.reduce(async (promise, store, index) => {
        await promise;
        const { uuids } = await get('/_uuids');
        const [id] = uuids;
        stores[index] = { ...store, id };
    }, Promise.resolve());

    // Add store documents.
    await stores.reduce(async (promise, store) => {
        await promise;
        const { id } = store;
        await put(`/ocsupply/${id}`, store);
    }, Promise.resolve());

    // Add store items.
    await storeItems.reduce(async (promise, storeItem) => {
        await promise;
        const { store: storeCode, items: itemCodes  } = storeItem;
        const { id: storeId } = stores.find(store => store.code === storeCode)
        // Update store document.
        const oldStore = await get(`/ocsupply/${storeId}`)
        const newItems = itemCodes.map(code => items.find(item => item.code === code));
        const newStore = { ...oldStore, items: newItems };
        await put(`/ocsupply/${storeId}`, newStore);
    }, Promise.resolve());
}

main();
