module.exports = {
  preset: "ts-jest",
  setupFiles: ["<rootDir>/src/backend/utils/setup_tests.ts"],
  testEnvironment: "node",
  testMatch: ["src/*.test.ts"],
};
