// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import hre from "hardhat";
import fs from "fs";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  // COMMENTED OUT TO DEPLOY THE VRFCONSUMERBASE
//   const NFTMarket = await ethers.getContractFactory("NFTMarket");
//   const nftMarket = await NFTMarket.deploy();
//   await nftMarket.deployed();
//   console.log("nftMarket deployed to:", nftMarket.address);

//   const NFT = await ethers.getContractFactory("NFT");
//   const nft = await NFT.deploy(nftMarket.address);
//   await nft.deployed();
//   console.log("nft deployed to:", nft.address);

//   let config = `
//   export const nftmarketaddress = "${nftMarket.address}"
//   export const nftaddress = "${nft.address}"
//   `;

//   let data = JSON.stringify(config);
//   fs.writeFileSync("config.ts", JSON.parse(data));
// }

  const VRFConsumer = await ethers.getContractFactory("RandomNumberConsumer");
  const vrfConsumer = await VRFConsumer.deploy();
  await vrfConsumer.deployed();
  console.log("RandomNumberConsumer deployed to:", vrfConsumer.address);

  // let config = config + `
  // export const vrfConsumeraddress = "${vrfConsumer.address}"
  // `;

  // let data = JSON.stringify(config);
  // fs.writeFileSync("config.ts", JSON.parse(data));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
