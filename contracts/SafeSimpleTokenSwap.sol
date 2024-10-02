// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SimpleTokenSwap is ReentrancyGuard {
    ISwapRouter public swapRouter;
    address public WETH;

    // Event for token swaps
    event TokensSwapped(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        address indexed recipient
    );

    // Set the Uniswap Router address and WETH address in the constructor
    constructor(address _swapRouter, address _WETH) {
        require(_swapRouter != address(0), "Invalid swap router address");
        require(_WETH != address(0), "Invalid WETH address");
        
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
    ) external nonReentrant {
        require(tokenIn != address(0), "Invalid input token address");
        require(tokenOut != address(0), "Invalid output token address");
        require(amountIn > 0, "Amount in must be greater than zero");
        require(amountOutMinimum > 0, "Minimum amount out must be greater than zero");
        require(recipient != address(0), "Invalid recipient address");

        // Transfer the input tokens from the sender to the contract
        bool successTransfer = IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        require(successTransfer, "Transfer failed");

        // Approve the Uniswap router to spend the input tokens
        bool successApprove = IERC20(tokenIn).approve(address(swapRouter), amountIn);
        require(successApprove, "Approve failed");

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
        uint256 amountOut = swapRouter.exactInputSingle(params);
        
        // Emit an event for the swap
        emit TokensSwapped(tokenIn, tokenOut, amountIn, amountOut, recipient);
    }
}
