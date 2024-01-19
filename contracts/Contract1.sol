// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

// ====================================================================
// ========================= Contract1.sol ==========================
// ====================================================================

/**
 * @title Pool 1
 * @dev https://github.com/jayito
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Contract1 is Ownable {
    uint public startTime;
    uint public endTime;
    uint public lockPeriod;

    struct DepositInfo {
        uint depositAmount;
        uint claimedAmount;
        uint claimedTime;
    }

    mapping(address => mapping(address => DepositInfo)) public deposits;

    // Events
    event Deposit(address indexed token, uint amount);
    event Claim(address indexed token, uint amount);

    constructor(uint _startTime, uint _endTime, uint _lockPeriod) {
        startTime = block.timestamp + _startTime;
        endTime = block.timestamp + _endTime;
        lockPeriod = _lockPeriod;
    }

    /**
     * @notice Deposit token
     * @param _token Token address for deposit
     * @param _amount Token amount for deposit
     */
    function deposit(address _token, uint _amount) external {
        require(block.timestamp < startTime, "Already started.");

        DepositInfo memory newInfo = DepositInfo({
            depositAmount: _amount,
            claimedAmount: 0,
            claimedTime: block.timestamp
        });
        deposits[msg.sender][_token] = newInfo;

        IERC20(_token).transferFrom(msg.sender, address(this), _amount);

        emit Deposit(_token, _amount);
    }

    /**
     * @notice Claim token by lockPeriod
     * @param _token Token address for claim
     */
    function claim(address _token) external {
        DepositInfo storage info = deposits[msg.sender][_token];
        uint restAmount = info.depositAmount - info.claimedAmount;
        require(info.claimedTime + lockPeriod < block.timestamp, "Locked.");
        require(restAmount > 0, "All Claimed.");
        uint unitAmount = info.depositAmount / (endTime - startTime);
        uint availableAmount = unitAmount *
            (block.timestamp - info.claimedTime);
        availableAmount = availableAmount > restAmount
            ? restAmount
            : availableAmount;
        info.claimedAmount = info.claimedAmount + availableAmount;
        IERC20(_token).transfer(msg.sender, availableAmount);

        emit Claim(_token, availableAmount);
    }
}
