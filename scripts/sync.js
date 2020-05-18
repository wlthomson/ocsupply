/**
 * sync.js
 * 
 * Basic proof-of-concept for primary-to-satellite syncing using CouchDB.
 */

const fs = require('fs');
const { put, post } = require('./http')

const main = async () => {
    const hosts = JSON.parse(fs.readFileSync('hosts.json', 'utf8'));
    const sites = JSON.parse(fs.readFileSync('sites.json', 'utf8'));

    // Get primary, satellite server detils.
    const { primary, satellites } = hosts.reduce(({ primary: primaryHost, satellites: satelliteHosts }, host) => {
        if (host.site === 'P') return { primary: host, satellites: satelliteHosts };
        return { primary: primaryHost, satellites: [...satelliteHosts, host] };
    }, { primary: {}, satellites: [] });

    // Create primary replication database.
    const { hostname, port, auth } = primary;
    const options = { hostname, port, auth };
    await put({ ...options, path: '/_replicator' });

    // Create satellite databases.
    await satellites.reduce(async (promise, host) => {
        await promise;
        const { hostname, port, auth } = host;
        const options = { hostname, port, auth };
        put({ ...options, path: '/ocsupply' });
        put({ ...options, path: '/_replicator' });
    }, Promise.resolve());

    // Populate satellite databases.
    const { hostname: sourceHostname, port: sourcePort, auth: sourceAuth } = primary;
    await satellites.reduce(async (promise, host) => {
        await promise;
        const site = sites.find(site => site.code === host.site);
        const { stores } = site;
        const options = { hostname: sourceHostname, port: sourcePort, auth: sourceAuth };
        const { auth: targetAuth, site: targetSite } = host;
        const targetHostname = `SITE_${targetSite}`;
        const syncId = String(new Date().getTime());
        const targetPort = 5984;
        const replicationDocument = {
            _id: syncId,
            source: `http://${sourceAuth}@${sourceHostname}:${sourcePort}/ocsupply`,
            target: `http://${targetAuth}@${targetHostname}:${targetPort}/ocsupply`,
            selector: { site: { code: targetSite } },
            create_target: false,
            continuous: false            
        }
        await post({ ...options, path: '/_replicator' }, replicationDocument);
    }, Promise.resolve());
}

main();
