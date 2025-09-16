module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/src/setupTests.js'],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@nivo|d3-|internmap|delaunator|robust-predicates))',
  ],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/src/tests/__mocks__/styleMock.js',
    '\\.svg$': '<rootDir>/src/tests/__mocks__/fileMock.js',
  }
};
