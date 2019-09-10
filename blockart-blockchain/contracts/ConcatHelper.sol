pragma solidity ^0.5.0;

library ConcatHelper {
  function concat(bytes32 a, bytes32 b)
  internal pure returns (bytes memory) {
    return abi.encodePacked(a, b);
  }
  function concat2(bytes memory a, bytes32 b)
  internal pure returns (bytes memory) {
    return abi.encodePacked(a, b);
  }
}
