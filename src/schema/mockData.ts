export const items = [
  {
    id: "ibu1",
    name: "Ibuprofen",
    code: "IBU",
  },
  {
    id: "para1",
    name: "Paracetamol",
    code: "PCT",
  },
];

export const stores = [
  {
    id: "store1",
    name: "store one",
    code: "store1",
    items: ["ibu1"],
    requisitions: ["req1"],
  },
  {
    id: "store2",
    name: "store two",
    code: "store2",
    items: ["ibu1", "para1"],
    requisitions: ["req2"],
  },
];

export const requisitionLines = [
  {
    id: "reqLine1",
    item: "ibu1",
    quantity: 1,
  },
  {
    id: "reqLine2",
    item: "para1",
    quantity: 5,
  },
  {
    id: "reqLine3",
    item: "ibu1",
    quantity: 10,
  },
  {
    id: "reqLine4",
    item: "para1",
    quantity: 50,
  },
];

export const requisitions = [
  { id: "req1", store: "store1", lines: ["reqLine1", "reqLine2"] },
  { id: "req2", store: "store2", lines: ["reqLine3", "reqLine4"] },
];
