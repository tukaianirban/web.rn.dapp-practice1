// https://eth-goerli.g.alchemy.com/v2/WDqv0yIgDpqkwUEaJ-xu6SePIITihVwe

// hardhat-waffle is used to built smart contract tests
require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      // the url of the endpoint which will help deploy the smart contract
      url: "https://eth-goerli.g.alchemy.com/v2/WDqv0yIgDpqkwUEaJ-xu6SePIITihVwe",
      // this is the account which will be used to fund the smart contract deployment
      // here you literally are pasting in the private key of the account from where 
      // the funds to deploy the contract will be taken. DONT DO THIS !!!!
      accounts: ['81483d03b39482508cebddfa52bb283eeea994f2ccca491b94228b26e05ab14a']
    }
  }
};
