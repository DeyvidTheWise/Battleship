module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  moduleNameMapper: {
    "@shared-types": "<rootDir>/src/types/index.ts",
  },
}
