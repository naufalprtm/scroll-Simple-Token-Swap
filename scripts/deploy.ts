import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

async function main() {
    console.log("=== Starting Deployment Script ===");

    // Alamat untuk WETH dan Router
    const WETHAddress = "0x5300000000000000000000000000000000000004"; 
    const RouterAddress = "0x17AFD0263D6909Ba1F9a8EAC697f76532365Fb95"; 

    // Langkah untuk mendepoy kontrak SimpleTokenSwap
    console.log("\nDeploying SimpleTokenSwap contract...");
    const SimpleTokenSwap = await ethers.getContractFactory("SimpleTokenSwap");
    console.log("Fetching SimpleTokenSwap contract factory...");

    console.log("Using the following contract addresses for deployment:");
    console.log(`Router Address: ${RouterAddress}`);
    console.log(`WETH Address: ${WETHAddress}`);

    const simpleTokenSwap = await SimpleTokenSwap.deploy(RouterAddress, WETHAddress);
    console.log("Deploying SimpleTokenSwap contract, please wait...");

    await simpleTokenSwap.deployed();
    console.log(`SimpleTokenSwap deployed successfully! Address: ${simpleTokenSwap.address}`);

    // Ringkasan alamat yang telah dideploy
    console.log("\n=== Deployment Summary ===");
    console.log(`WETH Address: ${WETHAddress}`);
    console.log(`Router Address: ${RouterAddress}`);
    console.log(`SimpleTokenSwap Address: ${simpleTokenSwap.address}`);
    console.log("\n=== Deployment Completed Successfully ===");
}

// Jalankan skrip deployment
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
