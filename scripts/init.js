/**
 * init.js
 * 
 * Initialises CouchDB servers. Run before any other scripts. 
 */

const fs = require('fs');
const { spawn } = require('child_process');

const main = async () => {
    const hosts = JSON.parse(fs.readFileSync('hosts.json', 'utf8'));
    
    // Create site network.
    const network = 'susnet';
    const process = spawn('docker', ['network', 'create', '-d', 'bridge', network]);
    process.stdout.on("data", data => {
        console.log(`Network ${network}: ${data}`);
    });
    process.stderr.on("data", data => {
        console.log(`Network ${network}: ${data}`);
    });
    process.on('error', (error) => {
        console.log(`Network ${network} error: ${error.message}`);
    });
    process.on("close", code => {
        console.log(`Network ${network} process existed with code ${code}`);
    });

    // Spin up CouchDB instances.
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
        args.push('susnet');
        const process = spawn('docker', [...args, 'apache/couchdb:latest']);
        process.stdout.on("data", data => {
            console.log(`Site ${site}: ${data}`);
        });
        process.stderr.on("data", data => {
            console.log(`Site ${site}: ${data}`);
        });
        process.on('error', (error) => {
            console.log(`Site ${site} error: ${error.message}`);
        });
        process.on("close", code => {
            console.log(`Site ${site} process existed with code ${code}`);
        });
    });
}

main();
