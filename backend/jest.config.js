// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // This line tells Jest to run our setup file before running any tests
  setupFiles: ['<rootDir>/jest.setup.ts'],
  // If you are using path aliases like @/ in your backend, include this:
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};