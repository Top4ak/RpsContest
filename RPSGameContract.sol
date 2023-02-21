// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9; 

import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";
import "hardhat/console.sol";

contract RPSGameContract is VRFV2WrapperConsumerBase {

    event RpsRequest(uint _requestId);
    event RpsResult(uint _requestId, address _from, uint _amount, uint8 _playerMove, uint8 _computerMove, uint8 _gameResult); //_isPlayerWin : 0 - lose, 1 - win, 2 - draw

    struct rpsStatus {
        uint fees;
        uint randomWord;
        address player;
        uint entryFee;
        uint8 isPlayerWin;      //0 - win, 1 - lose, 2 - draw
        bool fulfilled;
        uint8 choice;           //player move (0 - Rock, 1 - Paper, 2 - Scissors)
        uint8 computerChoice;   //computer move
    }
    
    mapping(uint256 => rpsStatus) public statuses;

    address constant linkAddress = 0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06; 
    address constant vrfWrapperAddress = 0x699d428ee890d55D56d5FC6e26290f3247A762bd;
    uint lastTransactionId;

    uint32 constant callbackGasLimit = 500000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;
    uint8[5] public rpsOptions = [2, 0, 1, 2, 0];   //Scissors < Rock < Paper < Scissors < Rock 

    address owner;

    constructor() payable VRFV2WrapperConsumerBase(linkAddress, vrfWrapperAddress) {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not an owner!");
        _;
    }
    
    function rpsPlayWithBnb(uint8 playerChoice) external payable returns(uint) {
        require(address(this).balance >= msg.value * 2, "No funds in contract");

        uint requestId = requestRandomness(callbackGasLimit, requestConfirmations, numWords);
        lastTransactionId = requestId;

        statuses[requestId] = rpsStatus({
            fees: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
            randomWord: 0,
            player: msg.sender,
            entryFee: msg.value,
            isPlayerWin: 3,
            fulfilled: false,
            choice: playerChoice,
            computerChoice: 3
        });

        emit RpsRequest(requestId);
        return requestId;
    }

    function fulfillRandomWords(uint requestId, uint[] memory randomWords) internal override {
        require(statuses[requestId].fees > 0, "Request not found");
        uint8 myMove = statuses[requestId].choice;
        uint8 computerMove = uint8(randomWords[0] % 3);

        statuses[requestId].fulfilled = true;
        statuses[requestId].randomWord = randomWords[0];
        statuses[requestId].computerChoice = computerMove;

        
        if(rpsOptions[myMove + 1] == rpsOptions[computerMove + 1]) {
            payable(statuses[requestId].player).transfer(statuses[requestId].entryFee);
            statuses[requestId].isPlayerWin = 2;
            emit RpsResult(requestId, statuses[requestId].player, statuses[requestId].entryFee, myMove, computerMove, 2);
            return;
        }
        if(rpsOptions[myMove + 1] == rpsOptions[computerMove + 2]) {
            payable(statuses[requestId].player).transfer(statuses[requestId].entryFee * 2);
            statuses[requestId].isPlayerWin = 1;
            emit RpsResult(requestId, statuses[requestId].player, statuses[requestId].entryFee, myMove, computerMove, 1);
        } else {
            statuses[requestId].isPlayerWin = 0;
            emit RpsResult(requestId, statuses[requestId].player, statuses[requestId].entryFee, myMove, computerMove, 0);
        }
    }

    function getStatus(uint requestId) public view returns(uint8 playerMove, uint8 computerMove) {
        return(statuses[requestId].choice, statuses[requestId].computerChoice);
    }

    function getLastId() public view returns(uint) {
        return lastTransactionId;
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(linkAddress);
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }
    function withdrawBnb() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

     receive() external payable {}
     fallback() external payable {}
}