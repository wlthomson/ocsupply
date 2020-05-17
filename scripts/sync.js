/**
 * sync.js
 * 
 * Basic proof-of-concept for primary-to-satellite syncing using CouchDB.
 */

const fs = require('fs');
const { get, put } = require('./http')

const main = async () => {
    const hosts = JSON.parse(fs.readFileSync('hosts.json', 'utf8'));

    // Get primary, satellite server detils.
    const { primary, satellites } = hosts.reduce(({ primary: primaryHost, satellites: satelliteHosts }, host) => {
        if (host.site === 'P') return { primary: host, satellites: satelliteHosts };
        return { primary: primaryHost, satellites: [...satelliteHosts, host] };
    }, { primary: {}, satellites: [] });

    // Create satellite ocsupply databases.
    await satellites.reduce(async (promise, host) => {
        await promise;
        const { hostname, port, auth } = host;
        const options = { hostname, port, auth };
        put({ ...options, path: '/ocsupply' });
    }, Promise.resolve());
}

main();
