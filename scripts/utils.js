/**
 * utils.js
 * 
 * Helper methods for ocsupply scripts.
 */

const forEach = async (arr, fn) => {
    await Promise.all(arr.map(async curr => fn(curr)));
}

const log = msg => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(msg);
}

 module.exports = { forEach, log };