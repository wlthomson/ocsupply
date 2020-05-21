/**
 * data.js
 * 
 * Basic proof-of-concept for mapping relational data to a CouchDB document database.
 */

const fs = require('fs');

const main = async () => {
    const hosts = JSON.parse(fs.readFileSync('hosts.json', 'utf8'));
    const sites =  JSON.parse(fs.readFileSync('sites.json', 'utf8'));
    const stores = JSON.parse(fs.readFileSync('stores.json', 'utf8'));
    const items = JSON.parse(fs.readFileSync('items.json', 'utf8'));
    const requisitions = JSON.parse(fs.readFileSync('requisitions.json', 'utf8'));

    // Get primary server databases.
    const { hostname, port, auth } = hosts.find(host => host.site === 'site_p');
    const nano = require('nano')(`http://${auth}@${hostname}:${port}`);

    const dbs = await nano.db.list();

    if (dbs.includes('ocsupply')) await nano.db.destroy('ocsupply');
    if (dbs.includes('_replicator')) await nano.db.destroy('_replicator');

    await nano.db.create('ocsupply');
    await nano.db.create('_replicator');

    const ocsupply = await nano.db.use('ocsupply');

    // Create sites.
    sites.forEach(async site => {
        const { id: _id, name, code, stores } = site;
        const type = "site";
        await ocsupply.insert({ _id, type, name, code, stores })
    })

    // Create stores.
    stores.forEach(async store => {
        const { id: _id, name, code, items, request_requisitions, response_requisitions } = store;
        const type = "store";
        await ocsupply.insert({ _id, type, name, code, items, request_requisitions, response_requisitions });
    })

    // Create items.
    items.forEach(async item => {
        const { id: _id, name, code } = item;
        const type = "item";
        await ocsupply.insert({ _id, type, name, code });
    })

    // Create requisitions.
    requisitions.forEach(async requisition => {
        const { id: _id, number, fromStore, toStore, lines } = requisition;
        const type = "requisition";
        await ocsupply.insert({ _id, type, number, fromStore, toStore, lines })
    })
}

main();
