
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const SidCoinB = await ethers.getContractFactory("sidCoinB");
    const sidCoinB = await SidCoinB.deploy();

    console.log("sidCoinB deployed to:", sidCoinB.address);
}