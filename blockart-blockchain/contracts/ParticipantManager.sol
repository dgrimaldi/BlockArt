pragma solidity ^0.5.0;

import "./UserManager.sol";
import "./ConcatHelper.sol";

contract ParticipantManager is UserManager {
  //library to concat bytes
  using ConcatHelper for bytes;

  //struct with basic information about discussion participant
  struct Participant {
    //address of participator
    bytes32 addressPar;
    // number of remaining vote
    uint numRemVote;
    // is mediator of conversation or not
    bool isMediator;

    uint256 numOfRecVote;

    uint256 numOfPosVote;

    uint256 numOfNegVote;

    uint256 percentage;
  }

  // map with key= 'discussion_title' + 'user_address' and value a number
  mapping(bytes => uint) public participantIds;
  // Array of User that discussions
  Participant[] participants;
  // event fired when an participant is registered
  event newParticipantRegistered(uint id);
  // a list of the participantIds
  bytes[] internal keyList;


  //
  modifier checkIfVoterFinishedVote(
    bytes32 _discussionTitle,
    bytes32 _voter) {
    require(
      isNotVoterFinishedVote(_discussionTitle, _voter),
      "User finished vote"
    );
    _;
  }

  constructor() public{
    // NOTE: the first discussion and participant MUST be empty:
    // if you are trying to access to an element
    // of the participantIds mapping that does not exist you will
    // receive 0, that's why in the first position (with index 0) must be initialized
    addParticipant("", "");
  }

  /**
 * Function to register a new participant to the discussion.
 *
 * @param _addressPar address of participant
 * @param _discussionTitle Title of the discussion
 */
  function registerParticipant(
    bytes32 _addressPar,
    bytes32 _discussionTitle)
  public returns (uint) {
    return addParticipant(_addressPar, _discussionTitle);
  }

  /**
  * Add a new discussion. This function must be private to avoid
  * that an user insert other participant
  *
  * @param _addressPar address of participant
  * @param _discussionTitle Title of discussion
  */
  function addParticipant(
    bytes32 _addressPar,
    bytes32 _discussionTitle)
  private returns (uint) {
    bytes memory _participantKey = ConcatHelper.concat(_discussionTitle, _addressPar);
    // checking if the discussion is already registered
    uint participantId = participantIds[_participantKey];
    require(participantId == 0);
    // associating the title of discussion with the new ID
    participantIds[_participantKey] = participants.length;
    uint newParticipantId = participants.length++;
    // storing the new user details
    participants[newParticipantId] = Participant({
      addressPar : _addressPar,
      numRemVote : 5,
      isMediator : false,
      numOfRecVote : 0,
      numOfPosVote : 0,
      numOfNegVote : 0,
      percentage : 0
      });
    // add key to the keyList
    keyList.push(_participantKey);
    // emitting the event that a new user has been registered
    emit newParticipantRegistered(newParticipantId);
    return newParticipantId;
  }

  function givesVote(
    bytes32 _addressVoter,
    bool _isPositive,
    bytes32 _addressReceiver,
    bytes32 _discussionTitle)
  checkIfVoterFinishedVote(_discussionTitle, _addressVoter) public returns (uint) {
    // require(_addressVoter != _addressReceiver);
    // Leave remaing vote to the sender
    bytes memory _participantKeySender = ConcatHelper.concat(_discussionTitle, _addressVoter);
    uint participantIdSender = participantIds[_participantKeySender];
    Participant storage participantSender = participants[participantIdSender];
    participantSender.numRemVote -= 1;
    // Add vote to the voter

    bytes memory _participantKeyReceiver = ConcatHelper.concat(_discussionTitle, _addressReceiver);
    uint participantIdReceiver = participantIds[_participantKeyReceiver];
    Participant storage participantReceiver = participants[participantIdReceiver];
    participantReceiver.numOfRecVote += 1;

    if (_isPositive)
      participantReceiver.numOfPosVote += 1;
    else
      participantReceiver.numOfNegVote += 1;
    //
    uint votesPos = 0;
    for (uint i = 0; i < keyList.length; i++) {
      bytes32 discussionTitle = ConcatHelper.deconcat(keyList[i]);
      if (_discussionTitle == discussionTitle) {
        uint participantId = participantIds[keyList[i]];
        Participant storage participant = participants[participantId];
        // votes += participant.numOfRecVote;
        votesPos += participant.numOfPosVote;
      }
    }

    if (participantReceiver.numOfPosVote >= participantReceiver.numOfNegVote)
      participantReceiver.percentage = (100 * (participantReceiver.numOfPosVote - participantReceiver.numOfNegVote)) / votesPos;
    setOthersPercentage(votesPos, _discussionTitle);
    return participantReceiver.percentage;
  }

  function setOthersPercentage(uint votesPos, bytes32 _discussionTitle) internal {
    for (uint i = 0; i < keyList.length; i++) {
      bytes32 discussionTitle = ConcatHelper.deconcat(keyList[i]);
      if (_discussionTitle == discussionTitle) {
        uint participantId = participantIds[keyList[i]];
        Participant storage participant = participants[participantId];
        if (participant.numOfPosVote >= participant.numOfNegVote)
          participant.percentage = (100 * (participant.numOfPosVote - participant.numOfNegVote)) / votesPos;
        else
          participant.percentage = 0;
      }
    }
  }


  function isParticipantPresent(bytes32 _discussionTitle, bytes32 _participant) public view returns (bool isPresent) {
    isPresent = true;
    bytes memory _participantKey = ConcatHelper.concat(_discussionTitle, _participant);
    uint participantId = participantIds[_participantKey];
    if (participantId == 0)
      isPresent = false;
  }
  //
  //  function getDiscussionPercentage(bytes32 _addressRep, bytes32 _discussionTitle) public view returns (uint reputation){
  //    reputation = 0;
  //    bytes memory _participantKey = ConcatHelper.concat(_discussionTitle, _addressRep);
  //
  //    uint participantId = participantIds[_participantKey];
  //    Participant storage participant = participants[participantId];
  //    if (participant.numOfPosVote >= participant.numOfNegVote)
  //      reputation = participant.percentage;
  //  }


  function posParticipantIsExist(
    bytes32 _discussionTitle,
    uint _pos)
  public view returns (bool isPresent){
    isPresent = false;
    bytes32 discussionTitle = ConcatHelper.deconcat(keyList[_pos]);
    if (_discussionTitle == discussionTitle)
      isPresent = true;
  }

  function isKeyPresent(
    uint _pos,
    bytes32 _discussionTitle)
  public view returns (bool isPresent) {
    isPresent = false;
    bytes32 discussionTitle = ConcatHelper.deconcat(keyList[_pos]);
    if (_discussionTitle == discussionTitle)
      isPresent = true;
  }

  function getParticipantPercentage(
    uint _pos)
  public view returns (bytes32, uint) {
    uint participantId = participantIds[keyList[_pos]];
    Participant storage participant = participants[participantId];
    bytes32 addressPar = participant.addressPar;
    uint discussionPercentage = participant.percentage;
    return (addressPar, discussionPercentage);
  }

  function numAllParticipants() public view returns (uint){
    return participants.length;
  }

  function getReputation(bytes32 _addressRep) public view returns (uint reputation){
    reputation = 0;
    for (uint i = 0; i <= keyList.length; i++) {
      bytes32 addressRep = ConcatHelper.deconcat2(keyList[i]);
    }
  }

  function getRemaingVote(bytes32 _addressRem, bytes32 _discussionTitle) public view returns (uint) {
    bytes memory _participantKey = ConcatHelper.concat(_discussionTitle, _addressRem);
    uint participantId = participantIds[_participantKey];
    Participant storage participant = participants[participantId];
    return participant.numRemVote;
  }


  function isNotVoterFinishedVote(
    bytes32 _discussionTitle,
    bytes32 _voter)
  public view returns (bool) {
    bytes memory _participantKey = ConcatHelper.concat(_discussionTitle, _voter);
    uint participantId = participantIds[_participantKey];
    Participant storage participant = participants[participantId];
    if (participant.numRemVote > 0)
      return true;
    else
      return false;
  }
}
