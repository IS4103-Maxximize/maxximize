// import {v4 as uuid} from "uuid";
export const quotations = [
  {
    id: '1',
    lotQuantity: 5,
    lotPrice: 50,
    unit: 'kilogram',
    shellOrganisation: { // supplier
      id: 1,
      name: 'TomatoFarms Inc',
      type: 'supplier',
      created: new Date('2021-09-14'),
      uen: 'T12345F',
    },
    product: { // raw material
      id: 18,
      name: 'tomato',
      description: 'from NZ',
      skuCode: '18-TOM',
      unit: 'kilogram',
      unitPrice: 10,
      expiry: 10,
    },
  },
  {
    id: '2',
    lotQuantity: 10,
    lotPrice: 100,
    unit: 'kilogram',
    shellOrganisation: { // supplier
      id: 1,
      name: 'TomatoFarms Inc',
      type: 'supplier',
      created: new Date('2021-09-14'),
      uen: 'T12345F',
    },
    product: { // raw material
      id: 18,
      name: 'tomato',
      description: 'from NZ',
      skuCode: '18-TOM',
      unit: 'kilogram',
      unitPrice: 10,
      expiry: 10,
    },
  },
]