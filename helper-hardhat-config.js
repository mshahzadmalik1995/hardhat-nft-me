const networkConfig = {
    11155111 : {
        name : "sepolia",
        vrfCoordinatorV2:"0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
        subscriptionId: "798",
        callbackGasLimit: "500000",
        interval: "30",
        mintFee: "10000000000000000",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    default: {
        name: "hardhat",
        keepersUpdateInterval: "30",
        mintFee: "10000000000000000",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    1337 : {
        name: "localhost",
        subscriptionId: "588",
        entranceFee: ethers.utils.parseEther("0.1"),
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
        callbackGasLimit: "50000000",
        interval: "30",
        mintFee: "10000000000000000",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    }
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains
}