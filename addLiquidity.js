const { ethers } = require('ethers');
const { Token } = require('@uniswap/sdk-core');
const { Pool, Position, nearestUsableTick } = require('@uniswap/v3-sdk');
const { abi: IUniswapV3PoolABI } = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json');
const { abi: NonfungiblePositionManagerABI } = require('@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json');
const ERC20ABI = require('./ERC20ABI.json');

require('dotenv').config()

const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const WALLET_PRIVATE_KEY = process.env.PRIVATE_KEY;

const poolAddress = "0x34b2A61596A27B7b626C995a594E3706D834a8A0"
const positionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"


const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL_GOERLI);

const sidCoinA = 'sidCoinA'
const symbol0  = 'sidCoinA'
const decimals0 = 18
const address0 = "0xaa8C9c9E55b072306Dd3669F40A06DAf24e9b668"

const sidCoinB = 'sidCoinB'
const symbol1  = 'sidCoinB'
const decimals1 = 18
const address1 = "0x567DdF6FC05Cb3fa3E045b27EE18323037e7555F"

const chainID = 5
const sidCoinAToken = new Token(chainID, address0, decimals0, symbol0, sidCoinA)
const sidCoinBToken = new Token(chainID, address1, decimals1, symbol1, sidCoinB)

const NonfungiblePositionManagerContract = new ethers.Contract(positionManagerAddress, NonfungiblePositionManagerABI, provider);

const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider);

async function getPoolData(poolContract) {
    const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
        poolContract.tickSpacing(),
        poolContract.fee(),
        poolContract.liquidity(),
        poolContract.slot0()
    ])

    return{
        tickSpacing: tickSpacing,
        fee: fee,
        liquidity: liquidity,
        sqrtPriceX96: slot0[0],
        tick: slot0[1],
    }
}

async function main() {
    const poolData = await getPoolData(poolContract) 

    const sidUniPool = new Pool(sidCoinA, sidCoinB, poolData.fee, poolData.sqrtPriceX96.toString(), poolData.liquidity, poolData.tick)

    const tickSpacing = await poolContract.tickSpacing()
    const tickLower = nearestUsableTick(poolData.tick - tickSpacing * 2, tickSpacing)
    const tickUpper = nearestUsableTick(poolData.tick + tickSpacing * 2, tickSpacing) 
    const position = new Position({
        pool: sidUniPool,
        liquidity: ethers.utils.parseUnits('0.01', 18),
        tickLower,
        tickUpper,
    })

    const wallet = new ethers.wallet(WALLET_PRIVATE_KEY)
    const connectedWallet = wallet.connect(provider)

    const approvalAmount = ethers.utils.parseUnits('0.01', 18).toString()
    const tokenContract = new ethers.Contract(address0, ERC20ABI, provider)
    await tokenContract.connect(connectedWallet).approve(positionManagerAddress, approvalAmount)

    const approvalAmount1 = ethers.utils.parseUnits('0.01', 18).toString()
    const tokenContract1 = new ethers.Contract(address1, ERC20ABI, provider)
    await tokenContract1.connect(connectedWallet).approve(positionManagerAddress, approvalAmount1)

    const { amount0: amount0Desired, amount1: amount1Desired } = position.mintAmounts

    params = {
        token0: sidCoinAToken.address,
        token1: sidCoinBToken.address,
        fee: sidUniPool.fee,
        // tickLower: nearestUsableTick(poolData.tickSpacing, poolData.tickSpacing) - poolData.tickSpacing * 2,
        // tickUpper: nearestUsableTick(poolData.tickSpacing, poolData.tickSpacing) + poolData.tickSpacing * 2,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        amount0Desired: amount0Desired.toString(),
        amount1Desired: amount1Desired.toString(),
        amount0Min: amount0Desired.toString(),
        amount1Min: amount1Desired.toString(),
        recipient: WALLET_ADDRESS,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
    }

    NonfungiblePositionManagerContract.connect(connectedWallet).mint(params,{gasLimit: 1000000}).then((res) => {console.log(res)})
}

main();
