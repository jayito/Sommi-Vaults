const { ethers } = require('hardhat');

async function main() {
  const startTime = 24 * 3600; // start depositing after 1 day
  const endTime = startTime + (3 * 30 * 24 * 3600); // end after 3 months 
  const lockPeriod = 14 * 24 * 3600; // locked 14 days

  const Contract = await ethers.getContractFactory("Contract1")
  const contract = await Contract.deploy(startTime, endTime, lockPeriod)

  console.log(`\nnpx hardhat verify --network goerli ${contract.target}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
