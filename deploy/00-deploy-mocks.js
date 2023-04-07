const {developmentChains} = require("../helper-hardhat-config");
const {ethers} = require("hardhat");
//const BASE_FEE = ethers.utils.parseEther("0.25");
const BASE_FEE = "250000000000000000";
const GAS_PRICE_LINK = 1e9;
const DECIMALS = "18"
const INITIAL_PRICE = ethers.utils.parseUnits("2000", "ether");

module.exports = async function ({getNamedAccounts, deployments}) {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId;
    const args = [BASE_FEE, GAS_PRICE_LINK];
    console.log(`chainId in 00 : ${chainId}`);
    if(developmentChains.includes(network.name)){
        log("Local network detected! Deploying mocks....");
        await deploy("VRFCoordinatorV2Mock", {
            from : deployer,
            log: true,
            args: args
        });

        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })

        log("Mocks Deployed!")
        log("----------------------------------------------------------")
        log("You are deploying to a local network, you'll need a local network running to interact")
        log(
            "Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!"
        )
    }
        log("----------------------------------------------------------")
}
module.exports.tags = ["all", "mocks"]