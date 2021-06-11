module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  testPathIgnorePatterns: [
    "/node_modules/",
    "fixtures"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "api/",
    "providers/",
    "router/",
    "lib/testing",
    "shared/",
    "fixtures/",
    "store/index.ts"
  ]
}
