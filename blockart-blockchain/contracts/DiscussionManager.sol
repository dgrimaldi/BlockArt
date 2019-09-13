pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./ConcatHelper.sol";
import "./UserManager.sol";
import "./CommentManager.sol";
import "./ParticipantManager.sol";

contract DiscussionManager is UserManager, CommentManager, ParticipantManager {
  //library to concat bytes
  using ConcatHelper for bytes;


  //struct with the basic discussion information
  struct Discussion {
    // title of the discussion topic
    bytes32 title;
    // initiator of the discussion
    bytes32 initiator;
    // the discussion is private or not
    bool isPrivate;
    // moderator reputation level
    uint moderatorLev;
  }


  // UserManager um;

  //map with key user_address and value a number
  mapping(bytes32 => uint) public discussionIds;

  // Array of User that participate to discussions
  Discussion[] discussions;

  // event fired when an discussion is registered
  event newDiscussionRegistered(bytes32 title);

  constructor() public{
    // NOTE: the first discussion and participant MUST be emtpy:
    // if you are trying to access to an element
    // of the discussionIds mapping that does not exist you will
    // receive 0, that's why in the first position (with index 0) must be initialized
    addDiscussion("", "");
    //addParticipant("", 0, false);
    // um = UserManager(msg.sender);
  }
  /**
  * Function to register a new discussion.
  *
  * @param _title The displaying title
  * @param _initiator The initiator address
  */
  function registerDiscussion(
    bytes32 _title,
    bytes32 _initiator)
  public returns (uint) {
    return addDiscussion(_title, _initiator);
  }

  /**
  * Add a new discussion. This function must be private because an user
  * cannot insert other information about comment and participant
  *
  * @param _title title of discussion
  * @param _initiator address of initiator of discussion
  */
  function addDiscussion(
    bytes32 _title,
    bytes32 _initiator)
  private returns (uint) {
    // checking if the discussion is already registered
    uint discussionId = discussionIds[_title];
    require(discussionId == 0);
    // associating the title of discussion with the new ID
    discussionIds[_title] = discussions.length;
    uint newDiscussionId = discussions.length++;
    // storing the new user details
    discussions[newDiscussionId] = Discussion({
      title : _title,
      initiator : _initiator,
      isPrivate : false,
      moderatorLev : 1
      //new bytes32[] empty
      //disComment : new bytes32[](0),
      });
    // emitting the event that a new user has been registered
    emit newDiscussionRegistered(_title);
    return discussionId;
  }

  /*
  *
  */


  function getDiscussions(uint _id) public view returns (bytes32, bytes32){
    Discussion storage discussion = discussions[_id];
    //string memory initiator = getNameInitiator(discussion.initiator);
    return (discussion.title, discussion.initiator);
  }

  /*
  * return the number of discussion
  */
  function getNumDiscussion() public view returns (uint){
    return discussions.length;
  }
  /*
  function getNameInitiator(bytes32 _address) public view returns(string memory){
    string memory username = um.getName(_address);
    return username;
  }*/
}
