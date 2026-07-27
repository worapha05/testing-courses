/** @type {import('jest').Config} */
module.exports = {
  rootDir: __dirname,
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.test.js'],
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/billingStatus.js'],
  coverageThreshold: {
    global: { lines: 70, statements: 70, functions: 70, branches: 50 },
  },
  transform: {
    '^.+\\.jsx?$': [
      'babel-jest',
      { presets: [['@babel/preset-env', { targets: { node: 'current' } }]] },
    ],
  },
};
