// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";


contract TicketToken is Initializable, ERC721Upgradeable, ERC721BurnableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    address public owner;

    CountersUpgradeable.Counter public _tokenIdCounter;
    mapping(uint256 => bool) private acceptedTokens;
    mapping(address => uint[]) private userTickets;
    mapping(uint256 => address) private _owners;


    constructor() initializer {
      owner = msg.sender;
    }

    function buyTicket() payable public {
      require(msg.value >= 0.05 ether, "Insufficient funds");
      uint256 tokenId = _tokenIdCounter.current();

      userTickets[msg.sender].push(tokenId);
      acceptedTokens[tokenId] = true;
      _owners[tokenId] = msg.sender;
      _tokenIdCounter.increment();
    }

    function initialize() initializer public {
        __ERC721_init("TicketToken", "TCK");
        __ERC721Burnable_init();
    }

    function approveTicket(uint tokenId) public onlyOwner {
        acceptedTokens[tokenId] = true;
    }

    function rejectTicket(uint tokenId) public onlyOwner {
        acceptedTokens[tokenId] = false;
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        userTickets[to].push(tokenId);
        _tokenIdCounter.increment();
        _owners[tokenId]=to;
    }

    function ownerOf(uint tokenId) public view override returns(address) {
        return _owners[tokenId];
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId) public override virtual {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);
        uint[] storage currenUserTickets = userTickets[from];
        uint[] memory updatedTickets;
        uint count = 0;

        for (uint ticketIndex = 0; ticketIndex < currenUserTickets.length; ticketIndex++) {
          if(tokenId != currenUserTickets[ticketIndex]) {
              updatedTickets[count] = currenUserTickets[ticketIndex];
              count++;
          }
        }

        userTickets[from] = updatedTickets;
        userTickets[to].push(tokenId);
    }

    function getUserTickets(address userAddress) public view returns(uint[] memory) {
        return userTickets[userAddress];
    }

    function getAcceptedTicket(uint tokenId) public view returns(bool) {
        return acceptedTokens[tokenId];
    }

    modifier onlyOwner() {
      require(msg.sender == owner);
      _;
    }
}
