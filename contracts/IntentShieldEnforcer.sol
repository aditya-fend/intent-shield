// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IntentShieldEnforcer
 * @notice On-chain enforcement layer & Smart Account wrapper untuk autonomous blockchain agent.
 * Memverifikasi EIP-712 User Signature dan membatasi eksekusi swap Uniswap V3 secara deterministic.
 */

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

// Interface ringkas Uniswap V3 SwapRouter (exactInputSingle)
interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
}

contract IntentShieldEnforcer {
    // ------------------------------------------------------------------------
    // State Variables & Events
    // ------------------------------------------------------------------------
    address public immutable owner;

    // Nonce tracker untuk mencegah Replay Attack per Policy
    mapping(uint256 => bool) public usedNonces;

    // EIP-712 Struct Hash
    bytes32 public constant POLICY_TYPEHASH = keccak256(
        "Policy(address agent,string action,address tokenIn,address tokenOut,uint256 maxAmountIn,address allowedTarget,uint256 maxSlippageBps,uint256 expiresAt,uint256 nonce)"
    );

    bytes32 public immutable DOMAIN_SEPARATOR;

    // Events untuk Audit Trail / Proof Explorer
    event PolicyExecuted(
        bytes32 indexed policyHash,
        address indexed agent,
        uint256 amountIn,
        uint256 amountOut,
        uint256 nonce
    );

    event PolicyRevoked(uint256 indexed nonce);

    // Errors
    error UnauthorizedOwner();
    error UnauthorizedAgent();
    error InvalidSignature();
    error NonceAlreadyUsed();
    error PolicyExpired();
    error TargetNotAllowed();
    error InvalidAction();
    error TokenInMismatch();
    error TokenOutMismatch();
    error AmountExceedsPolicyLimit();
    error InvalidRecipient();

    // ------------------------------------------------------------------------
    // Structs
    // ------------------------------------------------------------------------
    struct Policy {
        address agent;
        string action;
        address tokenIn;
        address tokenOut;
        uint256 maxAmountIn;
        address allowedTarget;
        uint256 maxSlippageBps;
        uint256 expiresAt;
        uint256 nonce;
    }

    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    constructor() {
        owner = msg.sender;

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("IntentShield")),
                keccak256(bytes("1")),
                block.chainid, // Base Sepolia: 84532
                address(this)
            )
        );
    }

    // ------------------------------------------------------------------------
    // Modifiers
    // ------------------------------------------------------------------------
    modifier onlyOwner() {
        if (msg.sender != owner) revert UnauthorizedOwner();
        _;
    }

    // ------------------------------------------------------------------------
    // Core Functions
    // ------------------------------------------------------------------------

    /**
     * @notice Menghitung Hash Policy sesuai standar EIP-712
     */
    function hashPolicy(Policy calldata policy) public view returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(
                    abi.encode(
                        POLICY_TYPEHASH,
                        policy.agent,
                        keccak256(bytes(policy.action)),
                        policy.tokenIn,
                        policy.tokenOut,
                        policy.maxAmountIn,
                        policy.allowedTarget,
                        policy.maxSlippageBps,
                        policy.expiresAt,
                        policy.nonce
                    )
                )
            )
        );
    }

    /**
     * @notice Memverifikasi EIP-712 Signature milik Owner
     */
    function verifySignature(Policy calldata policy, bytes calldata signature) public view returns (bool) {
        bytes32 digest = hashPolicy(policy);
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        address signer = ecrecover(digest, v, r, s);
        return (signer == owner);
    }

    /**
     * @notice Eksekusi Swap yang diusulkan oleh Agent dengan On-Chain Enforcement
     * @param policy Structured policy yang telah ditandatangani oleh User
     * @param signature Tanda tangan EIP-712 User
     * @param swapParams Parameter calldata aktual yang akan dikirim ke Uniswap Router
     */
    function executeWithPolicy(
        Policy calldata policy,
        bytes calldata signature,
        ISwapRouter.ExactInputSingleParams calldata swapParams
    ) external returns (uint256 amountOut) {
        // --- ON-CHAIN POLICY ENFORCEMENT CHECKS --- //

        // 1. Verifikasi Identity Agent yang memanggil fungsi
        if (msg.sender != policy.agent) revert UnauthorizedAgent();

        // 2. Verifikasi Expiration Timestamp
        if (block.timestamp > policy.expiresAt) revert PolicyExpired();

        // 3. Verifikasi Nonce (Replay Attack Protection)
        if (usedNonces[policy.nonce]) revert NonceAlreadyUsed();

        // 4. Verifikasi EIP-712 Signature dari Owner
        if (!verifySignature(policy, signature)) revert InvalidSignature();

        // 5. Verifikasi Hard Constraints Transaksi
        if (keccak256(bytes(policy.action)) != keccak256(bytes("swap"))) revert InvalidAction();
        if (swapParams.tokenIn != policy.tokenIn) revert TokenInMismatch();
        if (swapParams.tokenOut != policy.tokenOut) revert TokenOutMismatch();
        if (swapParams.amountIn > policy.maxAmountIn) revert AmountExceedsPolicyLimit();
        if (policy.allowedTarget != address(swapParams.recipient) && address(this) != swapParams.recipient) {
            revert InvalidRecipient();
        }

        // Tandai Nonce sebagai Terpakai
        usedNonces[policy.nonce] = true;

        // --- EXECUTION PHASE --- //

        // Approve tokenIn ke Uniswap Router Target
        IERC20(policy.tokenIn).approve(policy.allowedTarget, swapParams.amountIn);

        // Eksekusi Swap di Uniswap V3 Router Target
        amountOut = ISwapRouter(policy.allowedTarget).exactInputSingle(swapParams);

        // Emit Event untuk Audit Trail
        emit PolicyExecuted(
            hashPolicy(policy),
            msg.sender,
            swapParams.amountIn,
            amountOut,
            policy.nonce
        );

        return amountOut;
    }

    /**
     * @notice Revoke policy secara manual berdasarkan Nonce (jika user ingin membatalkan sebelum expired)
     */
    function revokePolicy(uint256 nonce) external onlyOwner {
        usedNonces[nonce] = true;
        emit PolicyRevoked(nonce);
    }

    // ------------------------------------------------------------------------
    // Helper Internal Functions
    // ------------------------------------------------------------------------
    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        if (sig.length != 65) revert InvalidSignature();
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

    // Memungkinkan Smart Account menerima ETH hasil Swap (WETH -> ETH)
    receive() external payable {}
}