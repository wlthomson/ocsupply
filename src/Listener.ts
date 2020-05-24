import { Requisition } from "./Database/Requisition/Requisition";

export class Listener {
  _nano;

  constructor(nano) {
    this._nano = nano;
  }

  processDoc(doc: any) {
    return doc.type === "requisition" && !doc.requestRequisitionId;
  }

  logListen() {
     // tslint:disable-next-line:no-console
    console.log("Listening for changes...\n");
  }

  logRequest(doc: any) {
    // tslint:disable-next-line:no-console
    console.log(`Detected new request requisition from ${doc.fromStoreId} to ${doc.toStoreId} with id ${doc._id}\n`);
  }

  logResponse(doc: any) {
    // tslint:disable-next-line:no-console
    console.log(`Response requisition with ID ${doc._id} created for request requistion with id ${doc.requestRequisitionId}\n`);
  }

  listen(db) {
    this.logListen();
    const feed = db.follow({ since: "now" });
    feed.on("change", (change) => {
      db.get(change.id).then((doc: any) => {
        if (this.processDoc(doc)) {
          const requestRequisition = doc;
          this.logRequest(requestRequisition);
          const responseRequisition: Requisition = new Requisition(
            requestRequisition.toStoreId,
            requestRequisition.fromStoreId
          );
          this._nano.uuids(1).then((uuidDoc: any) => {
            const { uuids } = uuidDoc;
            const [uuid] = uuids;
            responseRequisition._id = uuid;
            responseRequisition.requestRequisitionId = requestRequisition._id;
            responseRequisition.lines = requestRequisition.lines;
            db.insert(responseRequisition).then((responseDoc: any) => {
                if (responseDoc.ok) this.logResponse(responseRequisition);
            });
          });
        }
      });
    });
    feed.follow();
  }
}
