pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";


contract PhisicalGold  is ERC721Token("Physical Gold", "XPG"), Ownable {


    string public unit_ = "2 ounces";


    function PhisicalGold() public{


    }

    function mint(uint256 tokenId) public  onlyOwner {

        _mint(msg.sender, tokenId);
    }
}
