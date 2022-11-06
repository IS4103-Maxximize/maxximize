import { apiHost, requestOptionsHelper } from "./constants";

export const getSessionUrl = async (user, setUrl) => {
  const body = JSON.stringify({
    customerId: user.organisation?.membership?.customerId,
    returnUrl: 'http://127.0.0.1:4200/'
  });

  const requestOptions = requestOptionsHelper('POST', body);

  await fetch(`${apiHost}/stripe/create-customer-portal-session`, requestOptions)
    .then(response => response.json())
    .then(result => setUrl(result.url))
    .catch(err => console.log(err));
};
