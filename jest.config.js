module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/', // default ignore
    '\\.css$', // ignore CSS files
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "identity-obj-proxy",
    "\\.(css|less)$": "identity-obj-proxy"
  },
  testEnvironment: 'jsdom',
}
