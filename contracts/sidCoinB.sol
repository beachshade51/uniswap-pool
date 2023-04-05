
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract sidCoinB is ERC20 {
    constructor() ERC20("sidCoinB", "sidCoinB") {
        _mint(msg.sender, 100000 * 10 ** 18);
    }
}