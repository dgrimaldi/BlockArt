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

  function deconcat(bytes memory a)
  internal pure returns (bytes32 result) {
    bytes memory m = new bytes(32);
    for (uint32 i = 0; i < 32; i++) {
      m[i] = a[i];
    }
    if (m.length == 0) {
      return 0x0;
    }
    assembly {
      result := mload(add(m, 32))
    }
  }

  function deconcat2(bytes memory a)
  internal pure returns (bytes32 result) {
    bytes memory m = new bytes(32);
    for (uint32 i = 32; i < 64; i++) {
      m[i] = a[i];
    }
    if (m.length == 0) {
      return 0x0;
    }
    assembly {
      result := mload(add(m, 32))
    }
  }
}
