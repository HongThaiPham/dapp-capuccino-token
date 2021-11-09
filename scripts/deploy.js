// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const accounts = await hre.ethers.getSigners();
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(1000000000);

  let tokenInstance = await token.deployed();
  console.log("Token deployed to:", token.address);

  const KycContract = await hre.ethers.getContractFactory("KycContract");
  const kycContract = await KycContract.deploy();
  await kycContract.deployed();

  const MyTokenSales = await hre.ethers.getContractFactory("MyTokenSale");
  const tokenSale = await MyTokenSales.deploy(
    1,
    accounts[0],
    MyToken.address,
    kycContract.address
  );
  await tokenSale.deployed();

  console.log("Token deployed to:", token.address);

  await tokenInstance.transfer(MyTokenSales.address, 1000000000);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
