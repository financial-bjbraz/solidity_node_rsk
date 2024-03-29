const { ethers } = require("hardhat");

async function deployContract(contractName, ...params) {
  const contractFactory = await ethers.getContractFactory(contractName);
  const smartContract = await contractFactory.deploy(...params);
  await smartContract.deployed();
  console.log(`Contract ${contractName} deployed at address: ${smartContract.address}`);
  return smartContract;
}

module.exports = {
  deployContract,
};
