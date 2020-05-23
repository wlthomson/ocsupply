/**
 * data.js
 *
 * Populates ocsupply primary server with mock data. Run before sync.js.
 */

const fs = require("fs");
const { forEach, log } = require("./utils.js");

const data = async () => {
  // Create primary server databases.
  log("Creating primary server databases...");
  const hosts = JSON.parse(fs.readFileSync("hosts.json", "utf8"));
  const { hostname, port, auth } = hosts.find((host) => host.site === "site_p");
  const nano = require("nano")(`http://${auth}@${hostname}:${port}`);
  const dbs = await nano.db.list();
  if (dbs.includes("ocsupply")) await nano.db.destroy("ocsupply");
  if (dbs.includes("_replicator")) await nano.db.destroy("_replicator");
  await nano.db.create("ocsupply");
  await nano.db.create("_replicator");
  const ocsupply = await nano.db.use("ocsupply");
  log("Creating primary server databases... DONE\n");

  // Populate primary server data.
  log("Populating primary server data...");
  const sites = JSON.parse(fs.readFileSync("sites.json", "utf8"));
  await forEach(sites, async (site) => {
    const { id: _id, name, code, stores = [] } = site;
    const type = "site";
    await ocsupply.insert({ _id, type, name, code, stores });
  });
  const stores = JSON.parse(fs.readFileSync("stores.json", "utf8"));
  await forEach(stores, async (store) => {
    const {
      id: _id,
      name,
      code,
      itemIds = [],
      requestRequisitionIds = [],
      responseRequisitionIds = [],
    } = store;
    const type = "store";
    await ocsupply.insert({
      _id,
      type,
      name,
      code,
      itemIds,
      requestRequisitionIds,
      responseRequisitionIds,
    });
  });
  const items = JSON.parse(fs.readFileSync("items.json", "utf8"));
  await forEach(items, async (item) => {
    const { id: _id, name, code } = item;
    const type = "item";
    await ocsupply.insert({ _id, type, name, code });
  });
  const requisitions = JSON.parse(fs.readFileSync("requisitions.json", "utf8"));
  await forEach(requisitions, async (requisition) => {
    const {
      id: _id,
      number,
      fromStoreId,
      toStoreId,
      requestRequisitionId = "",
      lines = [],
    } = requisition;
    const type = "requisition";
    await ocsupply.insert({
      _id,
      type,
      number,
      fromStoreId,
      toStoreId,
      requestRequisitionId,
      lines,
    });
  });
  log("Populating primary server data... DONE\n");
};

(async () => {
  try {
    await data();
  } catch (err) {}
})();
