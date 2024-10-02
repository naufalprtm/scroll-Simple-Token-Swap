# scroll-Simple-Token-Swap

## Overview

The Simple Token Swap project implements a decentralized token swapping mechanism using a custom `SimpleTokenSwap` contract. This contract allows users to swap tokens using the Uniswap V3 router. The project includes deployment scripts for deploying mock ERC20 tokens and the swap contract on a local blockchain (using Hardhat) and on a specified testnet.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contracts](#contracts)
- [Deployment Scripts](#deployment-scripts)
- [License](#license)

## Features

- Deploys a mock WETH and mock ERC20 token.
- Allows users to swap tokens through the `SimpleTokenSwap` contract.
- Utilizes the Uniswap V3 router for token swapping.

## Installation

1. **Clone the repository:**
   ```
   git clone https://github.com/yourusername/simple-token-swap.git
   cd simple-token-swap
   ```
2. **Install dependencies:**
   ```
    npm install

   ```
   or
   ```
   npm install --legacy-peer-deps
   ```
## Usage
Deploying on Localhost
To deploy the contracts on a local Ethereum blockchain (Hardhat), use the deploy-localhost.ts script:

   ```
npx hardhat run scripts/deploy-localhost.ts --network localhost
   ```
Deploying on Testnet
To deploy the SimpleTokenSwap contract on a testnet, use the deploy.ts script:

   ```
npx hardhat run scripts/deploy.ts --network scrollSepolia
   ```

## Contracts
SimpleTokenSwap.sol
This contract interacts with the Uniswap V3 router to facilitate token swaps. The constructor requires the router address and the WETH address.
   ```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract SimpleTokenSwap {
    ISwapRouter public swapRouter;
    address public WETH;

    constructor(address _swapRouter, address _WETH) {
        swapRouter = ISwapRouter(_swapRouter);
        WETH = _WETH;
    }

    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMinimum,
        address recipient
    ) external {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: 3000,
            recipient: recipient,
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: amountOutMinimum,
            sqrtPriceLimitX96: 0
        });

        swapRouter.exactInputSingle(params);
    }
}
   ```      
## deploy.ts
This script deploys the SimpleTokenSwap contract using the WETH and router addresses.


   ```    
import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    const WETHAddress = "0x5300000000000000000000000000000000000004"; 
    const RouterAddress = "0x17AFD0263D6909Ba1F9a8EAC697f76532365Fb95"; 

    const SimpleTokenSwap = await ethers.getContractFactory("SimpleTokenSwap");
    const simpleTokenSwap = await SimpleTokenSwap.deploy(RouterAddress, WETHAddress);
    await simpleTokenSwap.deployed();
}
main();   
   ```    
### License
This project is licensed under the MIT License - see the LICENSE file for details.