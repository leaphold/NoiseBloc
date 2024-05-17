// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract HashMaker {
    bytes32 public lastHash;

    function hash(string memory _input) public returns (bytes32) {
        lastHash = keccak256(abi.encodePacked(_input));
        return lastHash;
    }
}
