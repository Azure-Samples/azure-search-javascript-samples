// When using Azure Static web apps, the base URL is the same
// for the client app and the serverless API functions.

// Developing locally, you need to set the proxy
// to simulate this cloud-based behavior.
// Azure SWA CLI can provide a proxy for you.
// Or you can set the `proxy` property in `package.json`
// 'proxy': 'http://localhost:7071'

const request = async (url, method, body) => {

  const requestOptions = {
    method,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer your-token-here`,
        // Add other headers if needed
      }
  };

  if(method !== 'GET' && method !== 'HEAD') {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${url}`, requestOptions);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }

  return data;
};

export default request;
