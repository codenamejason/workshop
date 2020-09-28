var HDWalletProvider = require('truffle-hdwallet-provider');
var mnemonic = 'wild render law slight strike seven close damp glory jaguar dawn scan';
var kovanUrl = "https://kovan.infura.io/v3/c3422181d0594697a38defe7706a1e5b";

module.exports = {
  networks: {
    kovan: {
      provider: () => new HDWalletProvider(mnemonic, kovanUrl),
      network_id: 42
    },
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, kovanUrl.replace('kovan','ropsten')),
      network_id: 3
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, kovanUrl.replace('kovan','rinkeby')),
      network_id: 4
    },
   
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    }
  },
  compilers: {
    solc: {
      version: '0.6.10'
    }
  }
}
