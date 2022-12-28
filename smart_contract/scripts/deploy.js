const hre = require("hardhat");

const main = async() => {

  // the smart contract "class" to deploy
  const Transactions = await hre.ethers.getContractFactory("Transactions");

  // create an instance of the smart contract to deploy
  const transactions = await Transactions.deploy();

  // wait for the deployment of the smart contract to complete
  await transactions.deployed();

  // print the address of the smart contract deployed on the blockchain
  console.log("Transactions deployed to: ", transactions.address);

  // NOTE: For the smart contract to be deployed on the blockchain, we will need to pay
  // gas fees.  
  // For now, we will use GoerliETH
  // We will use alchemy.com for deploying smart contracts

}

const runMain = async() => {

  try {
    await main();

    // process executed successfully
    process.exit(0);
  } catch (error) {

    console.error(error);

    // process execution had an error
    process.exit(1);
  }
}

runMain();