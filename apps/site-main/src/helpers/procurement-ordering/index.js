import { apiHost, headers } from "../constants"
// Sales Inquiry
// Get all, create, update, delete
export const fetchSalesInquiries = async (orgId) => {
  const apiUrl = `${apiHost}/sales-inquiry/all/${orgId}`;
  return await fetch(apiUrl).then(response => response.json());
}

const fetchSalesInquiry = async (id) => {
  const apiUrl = `${apiHost}/sales-inquiry/${id}`;
  return await fetch(apiUrl).then(response => response.json());
}

const createSalesInquiryLineItems = async (salesInquiryId, lineItems) => {
  const apiUrl = `${apiHost}/sales-inquiry-line-items`;
  const createPromises = lineItems.map(async (item) => {
    let body = {
      quantity: item.quantity,
      rawMaterialId: item.rawMaterial.id,
      salesInquiry: salesInquiryId
    }
    body = JSON.stringify(body);
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: body,
    }
    return fetch(apiUrl, requestOptions)
      .then(response => response.json())
      .catch(err => {throw new Error(err)});
  });
  
  return await Promise.all(createPromises)
    .catch(err => {throw new Error(err)});
}

export const createSalesInquiry = async (orgId, lineItems) => {
  // Create Sales Inquiry
  const apiUrl = `${apiHost}/sales-inquiry`;
  let body = {
    currentOrganisationId: orgId
  }
  body = JSON.stringify(body);
  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: body,
  };
  const salesInquiry = await fetch(apiUrl, requestOptions)
    .then(response => response.json())
    .catch(err => {throw new Error(err)});

  // Create LineItems
  const createdLineItems = await createSalesInquiryLineItems(salesInquiry.id, lineItems);
  const si = await fetchSalesInquiry(salesInquiry.id).catch(err => {throw new Error(err)});
  return si;
}

export const updateSalesInquiry = async (inquiry, values) => {
  const apiUrl = `${apiHost}/sales-inquiry-line-items`;

  const originalLineItemIds = inquiry.salesInquiryLineItems.map(item => item.id);
  const newLineItems = values.lineItems;

  // quantity: number;
  //   rawMaterialId: number;
  //   salesInquiryId: number;

  newLineItems.forEach((newItem) => {
    if (originalLineItemIds.includes(newItem.id)) { // update original item
      let body = {
        quantity: newItem.quantity,
      }
      body = JSON.stringify(body);
      const requestOptions = {
        method: 'PATCH',
        headers: headers,
        body: body,
      };
      fetch(`${apiUrl}/${newItem.id}`, requestOptions).then(response => response.json());
    } else {
      let body = {
        quantity: newItem.quantity,
        rawMaterialId: newItem.rawMaterial.id,  
        salesInquiryId: inquiry.id
      }
      body = JSON.stringify(body);
      const requestOptions = {
        method: 'POST',
        headers: headers,
        body: body,
      };
      fetch(apiUrl, requestOptions).then(response => response.json());
    }
  })

  originalLineItemIds.forEach((id) => {
    if (!newLineItems.map(item => item.id).includes(id)) {
      fetch(`${apiUrl}/${id}`, {method: 'DELETE'});
    }
  })

  return await fetch(`${apiHost}/sales-inquiry/${inquiry.id}`).then(response => response.json());
}

const deleteSalesInquiry = async (id) => {
    const apiUrl = `${apiHost}/sales-inquiry/${id}`;
    const requestOptions = {
      method: 'DELETE',
    };
    fetch(apiUrl, requestOptions);
}

export const deleteSalesInquiries = async (ids) => {
  ids.forEach((id) => {
    deleteSalesInquiry(id);
  });
}

// Quotation
// Get all, create, update, delete
export const fetchQuotations = async () => {
  const apiUrl = `${apiHost}/quotations`;
  return await fetch(apiUrl).then(response => response.json());
}

const fetchQuotation = async (id) => {
  const apiUrl = `${apiHost}/quotations/${id}`;
  return await fetch(apiUrl).then(response => response.json());
}

const createQuotationLineItems = async (quotationId, lineItems) => {
  const apiUrl = `${apiHost}/quotation-line-items`;
  
  const createPromises = lineItems.map(async (item) => {
    let body = {
      quantity: item.quantity,
      price: item.price,
      rawMaterialId: item.rawMaterial.id,
      quotationId: quotationId
    }
    body = JSON.stringify(body);
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: body,
    }
    return fetch(apiUrl, requestOptions)
      .then(response => response.json())
      .catch(err => {throw new Error(err)});
  });
  
  return await Promise.all(createPromises)
    .catch(err => {throw new Error(err)});
}

export const createQuotation = async (salesInquiryId, shellOrganisationId, lineItems) => {
  // Create Sales Inquiry
  const apiUrl = `${apiHost}/quotations`;
  let body = {
    salesInquiryId: salesInquiryId,
    shellOrganisationId: shellOrganisationId,
  }
  body = JSON.stringify(body);
  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: body,
  };
  const quotation = await fetch(apiUrl, requestOptions)
    .then(response => response.json())
    .catch(err => {throw new Error(err)});

  // Create LineItems
  const createdLineItems = await createQuotationLineItems(quotation.id, lineItems);
  const updatedQuotation = await fetchQuotation(quotation.id);
  return updatedQuotation;
}

const deleteQuotation = async (id) => {
  const apiUrl = `${apiHost}/quotations/${id}`;
  const requestOptions = {
    method: 'DELETE',
  };
  fetch(apiUrl, requestOptions);
}

export const deleteQuotations = async (ids) => {
ids.forEach((id) => {
  deleteSalesInquiry(id);
});
}
// Suppliers
// Get All
export const fetchSuppliers = async () => {
  const apiUrl = `${apiHost}/shell-organisations`;
  return await fetch(apiUrl)
    .then(response => response.json())
    .then(result => result.filter((el) => el.type === 'supplier'));
}
