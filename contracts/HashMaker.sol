// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract HashMaker {
    event HashCreated(address indexed account, bytes32 indexed hash);

    function createHash(string memory data) public returns (bytes32) {
        bytes32 hash = keccak256(abi.encodePacked(data));
        emit HashCreated(msg.sender, hash);
        return hash;
    }
}
