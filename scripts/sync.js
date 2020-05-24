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
    const { db: satelliteDatabase } = nano(
      `http://${auth}@${hostname}:${port}`
    );

    const satelliteDatabases = await satelliteDatabase.list();

    if (satelliteDatabases.includes("ocsupply"))
      await satelliteDatabase.destroy("ocsupply");
    await satelliteDatabase.create("ocsupply");

    if (satelliteDatabases.includes("_replicator"))
      await satelliteDatabase.destroy("_replicator");
    await satelliteDatabase.create("_replicator");
  });

  log("Creating satellite sites... DONE\n");

  // Insert sync documents to primary replicator.
  log("Creating sync data...");

  const {
    hostname: primaryHostName,
    port: primaryPort,
    auth: primaryAuth,
  } = hosts.find((host) => host.site === "site_p");

  const { db: primaryDatabase } = nano(
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
