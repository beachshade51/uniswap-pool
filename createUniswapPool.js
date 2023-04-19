const { ethers } = require("ethers");
const axios = require('axios');
require('dotenv').config();

const UNISWAP_V3_FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

const GOERLI_PROVIDERS = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL_GOERLI);
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const WALLET_PRIVATE_KEY = process.env.PRIVATE_KEY;
const sidCoinA = "0xaa8C9c9E55b072306Dd3669F40A06DAf24e9b668";
const sidCoinB = "0x567DdF6FC05Cb3fa3E045b27EE18323037e7555F";

async function createPool() {
  try {
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY);
    const connectedWallet = wallet.connect(GOERLI_PROVIDERS);

    const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${UNISWAP_V3_FACTORY_ADDRESS}&apikey=${process.env.ETHERSCAN_API_KEY}`;
    const res = await axios.get(url);
    const abi = JSON.parse(res.data.result);

    const factoryContract = new ethers.Contract(
      UNISWAP_V3_FACTORY_ADDRESS,
      abi,
      GOERLI_PROVIDERS
    );

    const pool = await factoryContract.getPool(sidCoinA, sidCoinB, 500);

    // if (pool != ethers.constants.AddressZero) {
    //   console.log("Pool already exists at address:", pool);
    //   return pool;
    // }

    console.log("Creating pool...");
    const tx = await factoryContract.connect(connectedWallet).createPool(sidCoinA, sidCoinB, 500, { gasLimit: 5000000 });
    const receipt = await tx.wait();

    console.log("Pool created with address:", receipt.logs[0].address);
    return receipt.logs[0].address;
  } catch (error) {
    console.error(error);
  }
}

createPool();