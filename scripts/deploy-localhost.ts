import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

async function main() {
    console.log("=== Starting Deployment Script ===");

    // Step 1: Deploy Mock WETH
    console.log("\nStep 1: Deploying Mock WETH contract...");
    const MockWETH = await ethers.getContractFactory("MockWETH");
    console.log("Fetching MockWETH contract factory...");

    const mockWETH = await MockWETH.deploy();
    console.log("Deploying MockWETH contract, please wait...");

    const mint = ethers.utils.parseEther("1000000"); // 1,000,000 tokens
    console.log(`Setting mint supply for Mock WETH Token: ${mint.toString()} tokens`);

    await mockWETH.deployed();
    console.log(`Mock WETH deployed successfully! Address: ${mockWETH.address}`);

    // Step 2: Deploy Mock ERC20 Token
    console.log("\nStep 2: Deploying Mock ERC20 Token contract...");
    const MockERC20 = await ethers.getContractFactory("MockERC20Token");
    console.log("Fetching MockERC20Token contract factory...");

    const initialSupply = ethers.utils.parseEther("1000000"); // 1,000,000 tokens
    console.log(`Setting initial supply for Mock ERC20 Token: ${initialSupply.toString()} tokens`);

    const mockERC20 = await MockERC20.deploy("Test Token", "TTK", initialSupply);
    console.log("Deploying Mock ERC20 Token, please wait...");

    await mockERC20.deployed();
    console.log(`Mock ERC20 Token deployed successfully! Address: ${mockERC20.address}`);

    // Step 3: Deploy SimpleTokenSwap contract
    console.log("\nStep 3: Deploying SimpleTokenSwap contract...");
    const SimpleTokenSwap = await ethers.getContractFactory("SimpleTokenSwap");
    console.log("Fetching SimpleTokenSwap contract factory...");

    console.log("Using the following contract addresses for deployment:");
    console.log(`Mock WETH Address: ${mockWETH.address}`);
    console.log(`Mock ERC20 Token Address: ${mockERC20.address}`);

    const simpleTokenSwap = await SimpleTokenSwap.deploy(mockERC20.address, mockWETH.address);
    console.log("Deploying SimpleTokenSwap contract, please wait...");

    await simpleTokenSwap.deployed();
    console.log(`SimpleTokenSwap deployed successfully! Address: ${simpleTokenSwap.address}`);

    // Step 4: Output final addresses
    console.log("\n=== Deployment Summary ===");
    console.log(`Mock WETH Address: ${mockWETH.address}`);
    console.log(`Mock ERC20 Token Address: ${mockERC20.address}`);
    console.log(`SimpleTokenSwap Address: ${simpleTokenSwap.address}`);
    console.log("\n=== Deployment Completed Successfully ===");
}

// Run the deployment
main()
    .then(() => {
        console.log("Exiting deployment script.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\nDeployment failed due to an error:");
        console.error(error);
        process.exit(1);
    });
