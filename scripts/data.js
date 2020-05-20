/**
 * data.js
 * 
 * Basic proof-of-concept for mapping relational data to a CouchDB document database.
 */

const fs = require('fs');
const { get, put } = require('./http')

const main = async () => {
    const hosts = JSON.parse(fs.readFileSync('hosts.json', 'utf8'));
    const sites =  JSON.parse(fs.readFileSync('sites.json', 'utf8'));
    const stores = JSON.parse(fs.readFileSync('stores.json', 'utf8'));
    const items = JSON.parse(fs.readFileSync('items.json', 'utf8'));
    const storeItems = JSON.parse(fs.readFileSync('store_items.json', 'utf8'));
    const requisitions = JSON.parse(fs.readFileSync('requisitions.json', 'utf8'));

    // Get primary server details.
    const { hostname, port, auth } = hosts.find(host => host.site === 'P');
    const options = { hostname, port, auth };
    // Create primary ocsupply database.
    await put({ ...options, path: '/ocsupply' });

    // Setup site keys.
    await sites.reduce(async (promise, site, index) => {
        await promise;
        const { uuids } = await get({ ...options, path: '/_uuids' });
        const [id] = uuids;
        sites[index] = { ...site, id };
    }, Promise.resolve());

    // Add store data.
    stores.forEach((store, index) => {
        const { items: thisStoreItemCodes = [] } = storeItems.find(storeItem => storeItem.store === store.code) || {};
        const thisStoreItems = thisStoreItemCodes.map(itemCode => items.find(item => item.code === itemCode));
        const thisStoreRequisitions = requisitions.filter(requisition => requisition.fromStore === store.code);
        const [thisStoreRequestRequisitions, thisStoreResponseRequisitions] = thisStoreRequisitions.reduce(
            ([requestRequisitions, responseRequisitions], requisition) => {
                const { number, toStore, type, lines } = requisition;
                if (type === "request") return [[...requestRequisitions, { number, toStore, lines }], responseRequisitions];
                if (type === "response") return [requestRequisitions, [...responseRequisitions, { number, toStore, lines }]];
                return [requestRequisitions, responseRequisitions];
            }, [[], []]
        );
        stores[index] = { ...store, items: thisStoreItems, requestRequsitions: thisStoreRequestRequisitions, responseRequisitions: thisStoreResponseRequisitions };
    });

    // Add site stores.
    sites.forEach((site, index) =>
        sites[index] = { ...site, stores: site.stores.map(code => stores.find(store => store.code === code)) }
    );

    // Add site documents.
    await sites.reduce(async (promise, site) => {
        await promise;
        const { id } =  site;
        await put({ ...options, path: `/ocsupply/${id}` }, { site });
    }, Promise.resolve());
}

main();
