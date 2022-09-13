import { v4 as uuid } from 'uuid';

export const salesInquiries = [
  {
    id: uuid(),
    status: 'draft',
    lineItems: [
      {
        id: 1,
        subTotal: 5,
        product: {
          id: 1,
          name: 'tomato',
          description: 'from NZ',
          skuCode: '1-TOM',
          unit: 'kilogram',
          unitPrice: 10,
          expiry: 10,
        }
      },
      {
        id: 2,
        subTotal: 5,
        product: {
          id: 2,
          name: 'potato',
          description: 'from AUS',
          skuCode: '2-POT',
          unit: 'kilogram',
          unitPrice: 15,
          expiry: 9,
        }
      },
    ]
  },
  {
    id: uuid(),
    status: 'pending',
    lineItems: [
      {
        id: 1,
        subTotal: 10,
        product: {
          id: 1,
          name: 'tomato',
          description: 'from NZ',
          skuCode: '1-TOM',
          unit: 'kilogram',
          unitPrice: 10,
          expiry: 10,
        }
      },
      {
        id: 2,
        subTotal: 10,
        product: {
          id: 2,
          name: 'potato',
          description: 'from AUS',
          skuCode: '2-POT',
          unit: 'kilogram',
          unitPrice: 15,
          expiry: 9,
        }
      },
    ]
  },
]