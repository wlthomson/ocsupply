/**
 * data.js
 * 
 * Basic proof-of-concept for mapping relational data to a CouchDB document database.
 */

const fs = require('fs');
const { get, put } = require('./http')

const main = async () => {
    const hosts = JSON.parse(fs.readFileSync('hosts.json', 'utf8'));
    const stores = JSON.parse(fs.readFileSync('stores.json', 'utf8'));
    const items = JSON.parse(fs.readFileSync('items.json', 'utf8'));
    const storeItems = JSON.parse(fs.readFileSync('store_item.json', 'utf8'));

    // Get primary server details.
    const { hostname, port, auth } = hosts.find(host => host.site === 'P');
    const options = { hostname, port, auth };

    // Create primary ocsupply database.
    await put({ ...options, path: '/ocsupply' });

    // Setup store keys.
    await stores.reduce(async (promise, store, index) => {
        await promise;
        const { uuids } = await get({ ...options, path: '/_uuids' });
        const [id] = uuids;
        stores[index] = { ...store, id };
    }, Promise.resolve());

    // Add store documents.
    await stores.reduce(async (promise, store) => {
        await promise;
        const { id } = store;
        await put({ ...options, path: `/ocsupply/${id}` }, store);
    }, Promise.resolve());

    // Add store items.
    await storeItems.reduce(async (promise, storeItem) => {
        await promise;
        const { store: storeCode, items: itemCodes  } = storeItem;
        const { id: storeId } = stores.find(store => store.code === storeCode)
        // Update store document.
        const oldStore = await get({ ...options, path: `/ocsupply/${storeId}` });
        const newItems = itemCodes.map(code => items.find(item => item.code === code));
        const newStore = { ...oldStore, items: newItems };
        await put({ ...options, path: `/ocsupply/${storeId}` }, newStore);
    }, Promise.resolve());
}

main();
