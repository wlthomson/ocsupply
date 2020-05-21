/**
 * clean.js
 * 
 * Removes demo network and sites. Run when done or reinitialising an existing demo.
 */

const fs = require('fs');
const { spawnSync } = require('child_process');
const { log } = require('./utils.js');

const clean = () => {
    // Remove demo sites.
    log('Removing demo sites...');
    const hosts = JSON.parse(fs.readFileSync('hosts.json', 'utf8'));
    const containers = hosts.map(host => host.site)
    spawnSync('docker', ['rm', '-f', ...containers]);
    log('Removing demo sites... DONE\n');

    // Remove demo network.
    log('Removing demo network...')
    const network = 'susnet';
    spawnSync('docker', ['network', 'rm', network]);
    log('Removing demo network... DONE\n')
}

clean();