// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract SimpleTokenSwap {
    ISwapRouter public swapRouter;
    address public WETH;

    // Set the Uniswap Router address and WETH address in the constructor
    constructor(address _swapRouter, address _WETH) {
        swapRouter = ISwapRouter(_swapRouter);
        WETH = _WETH;
    }

    // Create a swap function that takes input and output token addresses,
    // the input amount, the minimum output amount, and the recipient's address
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMinimum,
        address recipient
    ) external {
        // Transfer the input tokens from the sender to the contract
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        // Approve the Uniswap router to spend the input tokens
        IERC20(tokenIn).approve(address(swapRouter), amountIn);

        // Define the exact input swapping path
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: 3000, // Set the fee tier, e.g., 0.3%
            recipient: recipient,
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: amountOutMinimum,
            sqrtPriceLimitX96: 0
        });

        // Call the Uniswap router's exactInputSingle function to execute the swap
        swapRouter.exactInputSingle(params);
    }
}
