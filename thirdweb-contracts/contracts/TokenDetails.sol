/* SPDX-License-Identifier: UNLICENSED */

pragma solidity ^0.8.9;

contract TokenDetails {
    struct Description{
        address owner;
        string name;
        string symbol;
        address creator;
        address contractAddress;
        string desc;
        string imageUrl;
        string website;
        string[] announcements;
        string sector;
        string[] admins;
    }
    mapping(uint256 => Description) public descriptions;

    uint256 public numberOfTokenDescriptions = 0;

    function createTokenDetails(address _owner, string memory _name, string memory _symbol, string memory _description, string memory _imageUrl, 
    string memory _website, string memory _sector, address _creator, address _contractAddress) public returns (uint256) {
        Description storage description = descriptions[numberOfTokenDescriptions];

        description.owner = _owner;
        description.name = _name;
        description.symbol = _symbol;
        description.desc = _description;
        description.imageUrl = _imageUrl;
        description.website = _website;
        description.sector = _sector;
        description.creator = _creator;
        description.contractAddress = _contractAddress;

        numberOfTokenDescriptions++;

        return numberOfTokenDescriptions -1;
    }

    function delAdmin(string memory _admin, uint256 _id) public {
        Description storage description = descriptions[_id];
        for (uint j=0; j < description.admins.length; j++){
            if(keccak256(abi.encodePacked(description.admins[j])) == keccak256(abi.encodePacked(_admin))){
                delete description.admins[j];
            }
        }
    }

    function addAnnouncements(uint256 _id, string memory _announcement) public {
        Description storage description = descriptions[_id];
        description.announcements.push(_announcement);
    }
    
    function addAdmin(uint256 _id, string memory _admin) public {
         Description storage description = descriptions[_id];
         description.admins.push(_admin);
    }

    function getTokenDetails() public view returns(Description[] memory) {
        Description[] memory allDescriptions = new Description[](numberOfTokenDescriptions);
        for(uint i=0; i< numberOfTokenDescriptions; i++){
            Description storage item = descriptions[i];
            allDescriptions[i] = item;
        }
        return allDescriptions;
    }
}