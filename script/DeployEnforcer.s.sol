// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {IntentShieldEnforcer} from "../contracts/IntentShieldEnforcer.sol";

contract DeployEnforcer is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Panggil tanpa argumen
        IntentShieldEnforcer enforcer = new IntentShieldEnforcer();

        vm.stopBroadcast();

        console.log("IntentShieldEnforcer deployed at:", address(enforcer));
    }
}