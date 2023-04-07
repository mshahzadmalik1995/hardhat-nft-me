const {network,ethers} = require("hardhat");
const {developmentChains, networkConfig} = require("../helper-hardhat-config");
const {verify} = require("../utils/verify");
const {storeImages, storeTokenUriMetadata} = require("../utils/uploadToPinata");

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("2");
const imagesLocation = "./images/randomNft";

const metadataTemplate = {
    name: "",
    description: "", 
    image : "",
    attributes: [
        {
            trait_type: "Cuteness",
            value: 100
        },
    ]
}

module.exports = async function ({getNamedAccounts, deployments}) {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;

    //get the IPFS hashes of our images
   /*  let tokenUris = ['ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo',  
                     'ipfs://QmYQC5aGZu2PSQU5EXDdqRyXZtRhSGgJGo',
                    'ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d',       
                    'ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm']*/
    let tokenUris

    if(process.env.UPLOAD_TO_PINATA == "true"){
        tokenUris = await handleTokenUris();
    }


    let vrfCoordinatorV2Address;
    let subscriptionId;
    let vrfCoordinatorV2Mock

    if(developmentChains.includes(network.name)){
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
        const tx = await vrfCoordinatorV2Mock.createSubscription();
        const txReceipt = await tx.wait(1);
        subscriptionId = txReceipt.events[0].args.subId;
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    log("------------------------");

    await storeImages(imagesLocation);
    const args = [
        vrfCoordinatorV2Address, 
        subscriptionId,
        networkConfig[chainId].gasLane, 
        networkConfig[chainId].callbackGasLimit,
        tokenUris,
        networkConfig[chainId].mintFee,
    ]
    const randomIpfsNft = await deploy("RandomIpfsNft", {
        from : deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    log("-----------------------")

    

    if (chainId == 1337) {
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, randomIpfsNft.address)
    }

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(randomIpfsNft.address, args)
    }

}

async function handleTokenUris() {
    tokenUris = []

    const {responses : imagaeUploadResponses, files} = await storeImages(imagesLocation);
    for(imageUploadResponseIndex in imagaeUploadResponses){
        let tokenUriMetadata = {...metadataTemplate}
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "");
        tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`
        tokenUriMetadata.image = `ipfs://${imagaeUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name}...`)
        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata);
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Token URIs uploaded! They are: ")
    console.log(tokenUris)
    return tokenUris;
}

module.exports.tags = ["all", "randomipfs", "main"]