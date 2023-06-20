# uniswap-pool

### Introduction 
Uniswap is a decentralized exchange protocol built on the Ethereum blockchain that allows users to swap ERC-20 tokens directly from their wallets without the need for intermediaries. Uniswap operates on the principle of automated liquidity provision, which means that it uses liquidity pools instead of relying on traditional order books.

A Uniswap pool is a smart contract that holds reserves of two different ERC-20 tokens. These pools are created and maintained by liquidity providers (LPs) who deposit an equal value of both tokens into the pool. For example, a pool could hold ETH and DAI tokens in equal proportions.

When a user wants to trade one token for another, Uniswap matches the user's trade with the pool's reserves. The price of each token in the pool is determined by a constant product formula, known as the "x*y=k" equation, where x and y represent the quantities of the two tokens in the pool, and k is a constant.

When a trade occurs, the pool's reserves are adjusted, and the trader receives their desired token based on the current exchange rate. The larger the trade, the more the pool's reserves shift, leading to a slippage in the exchange rate. This slippage encourages liquidity providers to maintain balanced pools to minimize their exposure to impermanent loss.

Liquidity providers earn fees for providing liquidity to Uniswap pools. Every trade that occurs in a pool incurs a small fee, which is proportionally distributed to the liquidity providers based on their share of the pool. These fees incentivize users to become liquidity providers and contribute to the liquidity of the platform.

Uniswap introduced a major upgrade called Uniswap V3, which allows LPs to concentrate their liquidity within specific price ranges, known as "liquidity positions." This provides more control over capital efficiency and allows LPs to earn higher returns.

## Setup
```
npm i
npm start
```

.env setup
- INFURA_URL_GOERLI
- WALLET_ADDRESS
- PRIVATE_KEY
- UNISWAP_V3_FACTORY_ADDRESS
- ETHERSCAN_API_KEY

### NOTES
- In order to create a uniswap pool, you first have to create a pair of 2 tokens, then add liquidity to that pair. 
- If your stuck please follow: https://www.youtube.com/watch?v=0IzL2cRArVM
- https://docs.uniswap.org/
- check the interfaces in the unicswap code 
