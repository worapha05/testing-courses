/**
 * Consumer-side expectation — ใน Pact จริงจะ generate pact JSON
 * ที่นี่เก็บ contract object เพื่อสอนแนวคิดโดยไม่ต้องติดตั้ง Pact broker
 */
export const orderCreatedContract = {
  consumer: 'checkout-web',
  provider: 'order-api',
  interactions: [
    {
      description: 'a request to create an order',
      request: {
        method: 'POST',
        path: '/orders',
        body: { sku: 'SKU-1', qty: 1 },
      },
      response: {
        status: 201,
        body: { id: stringMatching(), status: 'CREATED' },
      },
    },
  ],
};

function stringMatching() {
  return { __matcher: 'string' };
}

export function matchesContractBody(actual, expected) {
  if (expected && expected.__matcher === 'string') {
    return typeof actual === 'string' && actual.length > 0;
  }
  if (Array.isArray(expected)) {
    return (
      Array.isArray(actual) &&
      expected.length === actual.length &&
      expected.every((v, i) => matchesContractBody(actual[i], v))
    );
  }
  if (expected && typeof expected === 'object') {
    return Object.keys(expected).every((key) => matchesContractBody(actual?.[key], expected[key]));
  }
  return actual === expected;
}
