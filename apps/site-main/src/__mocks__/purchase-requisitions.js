export const mock_prs = [
  {
    id: 1,
    expectedQuantity: 10, // expected
    quantityToFulfill: 10,
    status: 'pending',
    createdDateTime: new Date('2022-09-29'),
    rawMaterial : {
      "id": 1,
      "name": "Tomato",
      "description": "from Italy bestest farm ever",
      "skuCode": "1-TOM",
      "unit": "kilogram",
      "unitPrice": 10,
      "lotQuantity": 50,
      "type": "RawMaterial",
      "expiry": 30,
    },
    productionLineItem: {
      id: 1,
      productionOrder: {
        id: 1
      }
    },
    salesInquiry: null
  },
  {
    id: 2,
    expectedQuantity: 5, // expected
    quantityToFulfill: 5,
    status: 'pending',
    createdDateTime: new Date('2022-09-29'),
    rawMaterial : {
      "id": 2,
      "name": "Olive Oil",
      "description": "From Italy, A2.1 quality",
      "skuCode": "2-OLI",
      "unit": "litre",
      "unitPrice": 30,
      "lotQuantity": 10,
      "type": "RawMaterial",
      "expiry": 150,
    },
    productionLineItem: {
      id: 2,
      productionOrder: {
        id: 1
      }
    },
    salesInquiry: null
  },
  {
    id: 3,
    expectedQuantity: 15, // expected
    quantityToFulfill: 15,
    status: 'pending',
    created: new Date('2022-09-29'),
    rawMaterial : {
      "id": 2,
      "name": "Olive Oil",
      "description": "From Italy, A2.1 quality",
      "skuCode": "2-OLI",
      "unit": "litre",
      "unitPrice": 30,
      "lotQuantity": 10,
      "type": "RawMaterial",
      "expiry": 150,
    },
    productionLineItem: {
      id: 3,
      productionOrder: {
        id: 2
      }
    },
    salesInquiry: null
  }
]
