import { ethers } from "hardhat";
import { assert } from "console";

async function main() {
    console.log("=== Starting Token Swap Testing ===");

    // Step 1: Fetch deployed contract addresses
    const [owner] = await ethers.getSigners(); // Hanya menggunakan pemilik
    console.log(`Owner Address: ${owner.address}`);

    // Fetch deployed contract factories
    const SimpleTokenSwap = await ethers.getContractFactory("SimpleTokenSwap");
    const MockWETH = await ethers.getContractFactory("MockWETH");
    const MockERC20 = await ethers.getContractFactory("MockERC20Token");

    // Insert the deployed addresses
    const mockWETHAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e"; 
    const mockERC20Address = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0"; 
    const simpleTokenSwapAddress = "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82"; 

    // Attach to the deployed contracts
    const mockWETH = MockWETH.attach(mockWETHAddress);
    const mockERC20 = MockERC20.attach(mockERC20Address);
    const simpleTokenSwap = SimpleTokenSwap.attach(simpleTokenSwapAddress);

    // Step 2: Mint tokens to owner for testing purposes
    console.log("\nMinting test tokens...");
    const mintAmount = ethers.utils.parseEther("1000"); 
    await mockERC20.mint(owner.address, mintAmount);
    console.log(`Minted ${ethers.utils.formatEther(mintAmount)} MockERC20 tokens to ${owner.address}`);

    // Step 3: Approve SimpleTokenSwap to spend owner's MockERC20 tokens
    console.log("\nApproving SimpleTokenSwap contract to spend MockERC20 tokens...");
    const approveAmount = ethers.utils.parseEther("500"); 
    await mockERC20.approve(simpleTokenSwapAddress, approveAmount);
    console.log(`Approved ${ethers.utils.formatEther(approveAmount)} MockERC20 tokens for SimpleTokenSwap contract`);

    // Step 4: Perform the token swap
    console.log("\nPerforming token swap (MockERC20 -> MockWETH)...");
    const amountIn = ethers.utils.parseEther("500"); // Amount to swap
    const amountOutMin = ethers.utils.parseEther("1"); // Minimum WETH to receive

    await simpleTokenSwap.swap(
        mockERC20Address,
        mockWETHAddress,
        amountIn,
        amountOutMin,
        owner.address
    );

    console.log(`Swapped ${ethers.utils.formatEther(amountIn)} MockERC20 for WETH`);

    // Step 5: Verify the balances after the swap
    const wethBalance = await mockWETH.balanceOf(owner.address);
    const erc20Balance = await mockERC20.balanceOf(owner.address);

    console.log(`\n=== Token Balances After Swap ===`);
    console.log(`MockERC20 balance of owner: ${ethers.utils.formatEther(erc20Balance)} tokens`);
    console.log(`WETH balance of owner: ${ethers.utils.formatEther(wethBalance)} WETH`);

    // Additional assertions to ensure correctness using assert
    assert(erc20Balance.toString() === ethers.utils.parseEther("500").toString(), 
        "Expected MockERC20 balance to be 500 tokens after swap");

    assert(wethBalance.gte(amountOutMin), 
        `Expected WETH balance to be at least ${ethers.utils.formatEther(amountOutMin)} after swap`);

    console.log("\n=== Token Swap Test Completed Successfully ===");
}

// Run the testing script
main()
    .then(() => {
        console.log("Exiting test script.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\nTest failed due to an error:");
        console.error(error);
        process.exit(1);
    });
