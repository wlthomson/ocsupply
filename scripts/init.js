/**
 * init.js
 * 
 * Initialises demo network and containers. Run before any other scripts. 
 */

const fs = require('fs');
const { spawnSync } = require('child_process');
const { log } = require('./utils.js');

const init = async () => {
    // Create demo network.
    log('Creating demo network...');
    const network = 'susnet';
    const { stderr } = spawnSync('docker', ['network', 'create', '-d', 'bridge', network]);
    const error = stderr.toString().trim();
    if (error) console.log(error);
    log('Creating demo network... DONE\n');

    // Initialise demo sites.
    log('Creating demo servers...');
    const image = 'apache/couchdb:latest'
    const hosts = JSON.parse(fs.readFileSync('hosts.json', 'utf8'));
    hosts.forEach(host => {
        const { port, auth, site } = host;
        const [user, pass] = auth.split(':');
        const args = ['run', '-d'];
        if (site) {
            args.push('--name');
            args.push(site);
        }
        if (user && pass) {
            args.push('-e');
            args.push(`COUCHDB_USER=${user}`);
            args.push('-e');
            args.push(`COUCHDB_PASSWORD=${pass}`);
        }
        if (port) {
            args.push('-p');
            args.push(`${port}:5984`);
        }
        args.push('--network')
        args.push(network);
        const { stderr } = spawnSync('docker', [...args, image]);
        const error = stderr.toString().trim();
        if (error) console.log(error);
    });
    log('Creating demo servers... DONE\n');
}

(async () => { try { await init() } catch (err) {} })();
