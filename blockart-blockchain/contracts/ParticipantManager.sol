pragma solidity ^0.5.0;

import "./UserManager.sol";
import "./ConcatHelper.sol";

contract ParticipantManager is UserManager{
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
  }

  // map with key= 'discussion_title' + 'user_address' and value a number
  mapping(bytes => uint) public participantIds;
  // Array of User that discussions
  Participant[] participants;
  // event fired when an participant is registered
  event newParticipantRegistered(uint id);

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
      isMediator : false
      });
    // emitting the event that a new user has been registered
    emit newParticipantRegistered(newParticipantId);
    return newParticipantId;
  }
}
