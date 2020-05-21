/**
 * sync.js
 * 
 * Simulates primary-to-satellite sync by populating primary server replicator database.
 */

const fs = require('fs');

const forEach = async (arr, fn) => {
    arr.reduce(async (promise, curr) => {
        await promise;
        fn(curr);
    }, Promise.resolve());
}

const sync = async () => {
    // Create satellite site databases.
    const hosts = JSON.parse(fs.readFileSync('hosts.json', 'utf8'));
    const satellites = hosts.filter(host => host.site !== 'site_p');
    forEach(satellites, async satellite => {
        const { hostname, port, auth } = satellite;
        const nano = require('nano')(`http://${auth}@${hostname}:${port}`);
        const dbs = await nano.db.list();
        if (dbs.includes('ocsupply')) await nano.db.destroy('ocsupply');
        if (dbs.includes('_replicator')) await nano.db.destroy('_replicator');
        await nano.db.create('ocsupply');
        await nano.db.create('_replicator');
    });
    
    // Insert sync documents to primary replicator.
    const sites =  JSON.parse(fs.readFileSync('sites.json', 'utf8'));
    const stores = JSON.parse(fs.readFileSync('stores.json', 'utf8'));

    const { hostname, port, auth } = hosts.find(host => host.site === 'site_p');
    const nano = require('nano')(`http://${auth}@${hostname}:${port}`);

    forEach(satellites, async satellite => {
        const { auth, site: satelliteSite } = satellite;
        const site = sites.find(site => site.id === satelliteSite);
        const { stores: activeStores } = site;
        forEach(activeStores, async storeId => {
            const { 
                request_requisitions: requestRequisitionIds = [],
                response_requisitions: responseRequisitionIds = [],
                items: itemIds = []
            } = stores.find(store => store.id === storeId);
            const syncIds = [storeId, ...requestRequisitionIds, ...responseRequisitionIds, ...itemIds ];
            const options = { selector: { "_id": { "$in": syncIds } } };
            await nano.db.replicate('ocsupply', `http://${auth}@${satelliteSite}:5984/ocsupply`, options);
        })
    });
}

sync();
