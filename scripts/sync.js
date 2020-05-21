/**
 * sync.js
 * 
 * Basic proof-of-concept for primary-to-satellite syncing using CouchDB.
 */

const fs = require('fs');
const { put, post } = require('./http')

const main = async () => {
    const hosts = JSON.parse(fs.readFileSync('hosts.json', 'utf8'));
    const sites =  JSON.parse(fs.readFileSync('sites.json', 'utf8'));
    const stores = JSON.parse(fs.readFileSync('stores.json', 'utf8'));

    // Create satellite site databases.
    const satellites = hosts.filter(host => host.site !== 'site_p');

    satellites.reduce(async (promise, satellite) => {
        await promise; 

        const { hostname, port, auth } = satellite;
        const nano = require('nano')(`http://${auth}@${hostname}:${port}`);
        
        const dbs = await nano.db.list();

        if (dbs.includes('ocsupply')) await nano.db.destroy('ocsupply');
        if (dbs.includes('_replicator')) await nano.db.destroy('_replicator');

        await nano.db.create('ocsupply');
        await nano.db.create('_replicator');
    }, Promise.resolve());
    
    // Insert sync documents to primary replicator.
    const { hostname, port, auth } = hosts.find(host => host.site === 'site_p');
    const nano = require('nano')(`http://${auth}@${hostname}:${port}`);

    satellites.reduce(async (outerPromise, satellite) => {
        await outerPromise;
        const { auth, site: satelliteSite } = satellite;
        const site = sites.find(site => site.id === satelliteSite);
        const { stores: activeStores } = site;
        activeStores.reduce(async (innerPromise, activeStore) => {
            await innerPromise;
            const options =  { selector: { _id: activeStore } } 
            await nano.db.replicate('ocsupply', `http://${auth}@${satelliteSite}:5984/ocsupply`, options);
        }, Promise.resolve())
        activeStores.reduce(async (innerPromise, storeId) => {
            await innerPromise;
            const { request_requisitions: requestRequisitionIds, response_requisitions: responseRequisitionIds, items: itemIds } = stores.find(store => store.id === storeId);
            const syncIds = [storeId, ...requestRequisitionIds, ...responseRequisitionIds, ...itemIds ];
            const options = { selector: { "$in": syncIds } };
            await nano.db.replicate('ocsupply', `http://${auth}@${satelliteSite}:5984/ocsupply`, options);
        }, Promise.resolve())
    }, Promise.resolve());


}

main();
