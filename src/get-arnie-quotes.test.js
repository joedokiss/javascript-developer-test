const { getArnieQuotes } = require('./get-arnie-quotes');

const urls = [
  'http://www.smokeballdev.com/arnie0',
  'http://www.smokeballdev.com/arnie1',
  'http://www.smokeballdev.com/arnie2',
  'http://www.smokeballdev.com/arnie3',
];

test('expect no throws', () => {
  expect.assertions(1);
  expect(async () => await getArnieQuotes(urls)).not.toThrow(); 
});

test('responses to be correct', async () => {
  expect.assertions(5);

  const results = await getArnieQuotes(urls);
  
  expect(results.length).toBe(4);

  expect(results[0]).toEqual({ 'Arnie Quote': 'Get to the chopper' });
  expect(results[1]).toEqual({ 'Arnie Quote': 'MY NAME IS NOT QUAID' });
  expect(results[2]).toEqual({ 'Arnie Quote': `What's wrong with Wolfie?` });
  expect(results[3]).toEqual({ 'FAILURE': 'Your request has been terminated' });
});

test('code to be executed in less than 400ms', async () => {
  expect.assertions(2);

  const startTime = process.hrtime();
  await getArnieQuotes(urls);
  const [ seconds, nanos ] = process.hrtime(startTime);
  
  expect(seconds).toBe(0);
  expect(nanos / 1000 / 1000).toBeLessThan(400);
});

test('getArnieQuotes returns a Promise', () => {
  const result = getArnieQuotes(['http://test']);
  expect(result instanceof Promise).toBe(true);
});

test('each result object contains exactly 1 key', async () => {
  const urls = [
    'http://www.smokeballdev.com/arnie0',
    'http://www.smokeballdev.com/arnie3'
  ];

  const results = await getArnieQuotes(urls);
  
  results.forEach(obj => {
    expect(Object.keys(obj).length).toBe(1);
  });
});

test('any invalid URL produces FAILURE object', async () => {
  const urls = [
    'http://www.abc.com/unknown123',
    'http://www.efg.com/arnieXYZ'
  ];

  const results = await getArnieQuotes(urls);

  expect(results[0]).toEqual({ 'FAILURE': 'Your request has been terminated' });
  expect(results[1]).toEqual({ 'FAILURE': 'Your request has been terminated' });
});

test('parses JSON body and extracts message correctly', async () => {
  const results = await getArnieQuotes([
    'http://www.smokeballdev.com/arnie0'
  ]);

  expect(results[0]).toEqual({ 'Arnie Quote': 'Get to the chopper' });
});

test('httpGet is called once for a valid URL', async () => {
  jest.resetModules();

  // Mock "httpGet"
  jest.doMock('./mock-http-interface', () => ({
    httpGet: jest.fn().mockResolvedValue({
      status: 200,
      body: JSON.stringify({ message: 'Mocked message' })
    })
  }));

  const { getArnieQuotes } = require('./get-arnie-quotes');
  const { httpGet } = require('./mock-http-interface');

  await getArnieQuotes(['http://www.smokeballdev.com/arnie0']);

  expect(httpGet).toHaveBeenCalledTimes(1);
});
