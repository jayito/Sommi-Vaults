// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SemmiToken is ERC20, Ownable {
    constructor() ERC20("Semmi Token", "SMI") {}

    function decimals() public view override returns (uint8) {
        return 6;
    }

    /**
     * @notice Mint tokens
     * @param _amount token amount
     */
    function mint(uint256 _amount) external onlyOwner {
        _mint(msg.sender, _amount);
    }

    /**
     * @notice Burn tokens
     * @param _amount token amount
     */
    function burn(uint256 _amount) external onlyOwner {
        _burn(msg.sender, _amount);
    }
}
