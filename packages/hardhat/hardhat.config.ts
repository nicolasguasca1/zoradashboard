import * as dotenv from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false
  },
  solidity: "0.8.4",
  // defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    }
    // mumbai: {
    //   url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    //   accounts: [privateKey!]
    // },
    // mainnet: {
    //   url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    //   accounts: [privateKey!]
    // }
  }
};

export default config;
