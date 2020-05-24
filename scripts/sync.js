/**
 * sync.js
 *
 * Simulates primary-to-satellite sync by populating primary server replicator database.
 */

const nano = require("nano");
const { forEach, log } = require("./utils.js");

const sites = require("./sites.json");
const hosts = require("./hosts.json");

const sync = async () => {
  // Create satellite site databases.
  log("Creating satellite sites...");

  const satellites = hosts.filter((host) => host.site !== "site_p");

  await forEach(satellites, async ({ hostname, port, auth }) => {
    const { db } = nano(`http://${auth}@${hostname}:${port}`);
    const dbs = await db.list();

    if (dbs.includes("ocsupply")) await db.destroy("ocsupply");
    if (dbs.includes("_replicator")) await db.destroy("_replicator");

    await db.create("ocsupply");
    await db.create("_replicator");
  });

  log("Creating satellite sites... DONE\n");
  // Insert sync documents to primary replicator.
  log("Creating sync data...");

  const {
    hostname: primaryHostName,
    port: primaryPort,
    auth: primaryAuth,
  } = hosts.find((host) => host.site === "site_p");

  const { db: primaryDb } = nano(
    `http://${primaryAuth}@${primaryHostName}:${primaryPort}`
  );

  await forEach(satellites, async (satellite) => {
    const { auth, site: satelliteSite } = satellite;
    const site = sites.find((site) => site.id === satelliteSite);
    const { storeIds: activeStoreIds } = site;

    const options = {
      primaryToSatellite: {
        continuous: true,
        selector: {
          $or: [
            { fromStoreId: { $in: activeStoreIds } },
            { $and: [
                { fromStoreId: { $exists: false } },
                { toStoreId: { $exists: false } },
              ],
            },
          ],
        },
      },
      satelliteToPrimary: {
        continuous: true,
        selector: {
          $and: [
            { fromStoreId: { $in: activeStoreIds } },
            {
              $not: {
                toStoreId: { $in: activeStoreIds },
              },
            },
          ],
        },
      },
    };

    await primaryDatabase.replicate(
      `http://${auth}@${satelliteSite}:5984/ocsupply`,
      "ocsupply",
      options.satelliteToPrimary
    );

    await primaryDatabase.replicate(
      "ocsupply",
      `http://${auth}@${satelliteSite}:5984/ocsupply`,
      options.primaryToSatellite
    );
  });

  log("Creating sync data... DONE\n");
};

(async () => {
  try {
    await sync();
  } catch (err) {
    console.log(err);
  }
})();
