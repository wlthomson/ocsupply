import { gql } from "apollo-server";
import { db } from "../index";

export const RequisitionSchema = gql`
  """
  A requisition.
  """
  type Requisition {
    "Unique requisition identifier"
    _id: ID

    "The number of this requisition."
    number: Int

    "The ID of the customer store associated with this requisiton."
    fromStoreId: String

    "The customer store associated with this requisition."
    fromStore: Store

    "The ID of the supplier store associated with this requisiton."
    toStoreId: String

    "The supplier store associated with this requisition."
    toStore: Store

    "The identifier of the request requisition associated with this response. Only applicable for response requisitions."
    requestRequisitionId: String

    "The request requisition associated with this response."
    requestRequisition: Requisition

    "The item lines for this requisition."
    lines: [RequisitionLine]
  }
`;

export const RequisitionResolvers = {
  Requisition: {
    requestRequisition: async (requisition: any) => {
      const result = await db.find({
        selector: { _id: requisition.requestRequisitionId },
      });
      const [requestRequisition] = result.docs;
      return requestRequisition;
    },
    fromStore: async (requisition: any) => {
      const result = await db.find({
        selector: { _id: requisition.fromStoreId },
      });
      const [store] = result.docs;
      return store;
    },
    toStore: async (requisition: any) => {
      const result = await db.find({
        selector: { _id: requisition.toStoreId },
      });
      const [store] = result.docs;
      return store;
    },
  },
};
