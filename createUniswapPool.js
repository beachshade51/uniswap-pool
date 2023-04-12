const { ethers } = require("ethers");
const axios = require('axios');
require('dotenv').config();

const UNISWAP_V3_FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

const GOERLI_PROVIDERS = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL_GOERLI);
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const WALLET_PRIVATE_KEY = process.env.PRIVATE_KEY;
const sidCoinA = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const sidCoinB = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

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

    console.log("Creating pool...");
    const tx = await factoryContract.connect(connectedWallet).createPool(sidCoinA, sidCoinB, 500);
    const receipt = await tx.wait();

    console.log(receipt);
  } catch (error) {
    console.error(error);
  }
}

createPool();