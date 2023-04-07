const {assert} = require("chai");
const {network, deployments, ethers} = require("hardhat");
const {developmentChains} = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)?
    describe.skip
    : describe("Basic NfT Unit Tests", function() {
        let basicNFT, deployer
        beforeEach(async() => {
            const accounts = await ethers.getSigners()
            deployer = accounts[0]
            await deployments.fixture(["basicnft"]);
            basicNft = await ethers.getContract("BasicNft")
        })

        describe("Constructor", () => {
            it("Initializes the NFT correctly", async() => {
              //  const name = await basicNFT.name();
             //   const symbol = await basicNFT.symbol()
             console.log(basicNFT)
                const tokenCounter = await basicNFT.getTokenCounter()
                //assert.equal(name, "Dogie");
               // assert.equal(symbol,"DOG");
                assert.equal(tokenCounter.toString(), "0");
            })
        })
    })