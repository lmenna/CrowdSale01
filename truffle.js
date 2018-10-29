require('babel-register');
require('babel-polyfill');

const ropstenProvider = "https://ropsten.infura.io/v3/d82f9b025a1f4e74af9dc32325c3b07b";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // eslint-disable-line camelcase
    }
  }
}
