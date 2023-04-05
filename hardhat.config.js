require("@nomicfoundation/hardhat-toolbox")
require('dotenv').config()

module.exports = {
    solidity: "0.8.9",
    network: {
        goerli: {
            url: process.env.INFURA_URL_GOERLI,
            accounts: [process.env.PRIVATE_KEY]
        }
    }
};