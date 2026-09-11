// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../../contracts/IntentShieldEnforcer.sol";

contract IntentShieldEnforcerTest is Test {
    IntentShieldEnforcer public enforcer;
    
    uint256 internal ownerPrivateKey = 0xA11CE;
    address internal owner;
    address internal agent = address(0x123);
    address internal mockTokenIn = address(0x456);
    address internal mockTokenOut = address(0x789);
    address internal mockRouter = address(0x999);

    function setUp() public {
        owner = vm.addr(ownerPrivateKey);
        
        // Deploy kontrak oleh Owner
        vm.prank(owner);
        enforcer = new IntentShieldEnforcer();
    }

    // HELPER: Membuat EIP-712 Signature dari Owner
    function getSignature(IntentShieldEnforcer.Policy memory policy) internal view returns (bytes memory) {
        bytes32 digest = enforcer.hashPolicy(policy);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPrivateKey, digest);
        return abi.encodePacked(r, s, v);
    }

    // TEST 1: Memastikan Signature EIP-712 Owner Terverifikasi Valid
    function test_VerifyValidSignature() public view {
        IntentShieldEnforcer.Policy memory policy = IntentShieldEnforcer.Policy({
            agent: agent,
            action: "swap",
            tokenIn: mockTokenIn,
            tokenOut: mockTokenOut,
            maxAmountIn: 500 * 10**6, // Max 500 USDC
            allowedTarget: mockRouter,
            maxSlippageBps: 100,
            expiresAt: block.timestamp + 1 hours,
            nonce: 1
        });

        bytes memory sig = getSignature(policy);
        assertTrue(enforcer.verifySignature(policy, sig));
    }

    // TEST 2 (DEMO B): Agent Nakal Mencoba Swap Lebih Dari Limit (Must REVERT)
    function test_RevertWhen_AmountExceedsPolicyLimit() public {
        IntentShieldEnforcer.Policy memory policy = IntentShieldEnforcer.Policy({
            agent: agent,
            action: "swap",
            tokenIn: mockTokenIn,
            tokenOut: mockTokenOut,
            maxAmountIn: 500 * 10**6, // Policy cuma izinkan 500 USDC
            allowedTarget: mockRouter,
            maxSlippageBps: 100,
            expiresAt: block.timestamp + 1 hours,
            nonce: 1
        });

        bytes memory sig = getSignature(policy);

        // Agent mencoba ajukan proposal 5,000 USDC
        ISwapRouter.ExactInputSingleParams memory maliciousParams = ISwapRouter.ExactInputSingleParams({
            tokenIn: mockTokenIn,
            tokenOut: mockTokenOut,
            fee: 3000,
            recipient: address(enforcer),
            deadline: block.timestamp,
            amountIn: 5000 * 10**6, // 5,000 USDC (MELANGGAR POLICY!)
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });

        // Eksekusi dari Agent
        vm.prank(agent);
        
        // Harap Revert dengan Custom Error `AmountExceedsPolicyLimit`
        vm.expectRevert(IntentShieldEnforcer.AmountExceedsPolicyLimit.selector);
        enforcer.executeWithPolicy(policy, sig, maliciousParams);
    }
}