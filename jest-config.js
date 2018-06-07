module.exports = {
  rootDir: "./",
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ["./**/*.js"],
  coverageDirectory: "./coverage",
  moduleFileExtensions: ["js"],
  transform: {
    "^.+\\.js$": "babel-jest"
  }
};
