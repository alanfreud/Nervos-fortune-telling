pragma solidity >=0.8.0;

contract Fortune {
  
  uint public totalFortune;
  mapping(uint => SingleFortune) public fortunes;

  struct SingleFortune{
    uint id;
    string text;
  }
  
  constructor() payable {
    totalFortune = 0;
  }

  function createFortune(string memory _text) external {
    totalFortune += 1;
    SingleFortune memory _fortune = SingleFortune(totalFortune,_text);
    fortunes[totalFortune] = _fortune;
  }
  
}