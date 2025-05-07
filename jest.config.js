// jest.config.js
/** @type {import('jest').Config} */
module.exports = {
  rootDir: "dist", // ⬅️ This tells Jest to look inside the compiled folder
  testRegex: ".*\\.test\\.js$", // ⬅️ Match compiled test files
  testEnvironment: "node",
};
