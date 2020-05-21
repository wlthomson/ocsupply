/**
 * clean.js
 * 
 * Removes demo network and sites. Run when done or reinitialising an existing demo.
 */

const fs = require('fs');
const { spawnSync } = require('child_process');

const clean = () => {
    // Remove demo sites.
    const hosts = JSON.parse(fs.readFileSync('hosts.json', 'utf8'));
    const containers = hosts.map(host => host.site)
    spawnSync('docker', ['rm', '-f', ...containers]);

    // Remove demo network.
    const network = 'susnet';
    spawnSync('docker', ['network', 'rm', network]);
}

clean();