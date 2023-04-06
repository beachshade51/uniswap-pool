async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const SidCoinA = await ethers.getContractFactory("sidCoinA");
    const sidCoinA = await SidCoinA.deploy();

    console.log("sidCoinA deployed to:", sidCoinA.address);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    } )