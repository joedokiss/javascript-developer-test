const { httpGet } = require('./mock-http-interface');
const HTTP_STATUS = require('./constants/http-status-codes');

/**
 * Parse the JSON body.
 */
const parseResponseBody = (body) => {
  try {
    return JSON.parse(body);
  } catch (e) {
    return { message: 'Invalid response body' };
  }
};

/**
 * Convert a single HTTP response into the required output format.
 */
const transformResponse = (response) => {
  const { status, body } = response;
  const { message } = parseResponseBody(body);

  if (status === HTTP_STATUS.OK) {
    return { 'Arnie Quote': message };
  }

  return { 'FAILURE': message };
};

/**
 * Fetch a single URL and transform its result.
 */
const fetchAndTransform = async (url) => {
  const response = await httpGet(url);
  return transformResponse(response);
};

const getArnieQuotes = async (urls) => {
  const promises = urls.map(fetchAndTransform);
  return Promise.all(promises);
};

module.exports = {
  getArnieQuotes,
};
