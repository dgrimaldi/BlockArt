pragma solidity ^0.5.0;

import "./ConcatHelper.sol";
import "./UserManager.sol";
import "./CommentManager.sol";
import "./ParticipantManager.sol";

contract DiscussionManager is UserManager, CommentManager, ParticipantManager {

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
        // array of commentIDS
        bytes32[] disComment;
        // array of participantIDS
        bytes32[] disParticipant;
    }

    //map with key user_address and value a number
    mapping(bytes32 => uint) public discussionIds;

    // Array of User that participate to discussions
    Discussion[] discussions;

    // event fired when an discussion is registered
    event newDiscussionRegistered(uint id);

    constructor() public{
        // NOTE: the first discussion and participant MUST be emtpy:
        // if you are trying to access to an element
        // of the discussionIds mapping that does not exist you will
        // receive 0, that's why in the first position (with index 0) must be initialized
        addDiscussion("", "", false, 0);
        //addParticipant("", 0, false);
    }
    /**
    * Function to register a new discussion.
    *
    * @param _title The displaying title
    * @param _initiator The initiator address
    * @param _isPrivate discussion public or private
    * @param _moderatorLev reputation level to participate to the discussion
    */
    function registerDiscussion(
        bytes32 _title,
        bytes32 _initiator,
        bool _isPrivate,
        uint _moderatorLev)
    public returns (uint) {
        return addDiscussion(_title, _initiator, _isPrivate, _moderatorLev);
    }

    /**
    * Add a new discussion. This function must be private because an user
    * cannot insert other information about comment and participant
    *
    * @param _title title of discussion
    * @param _initiator address of initiator of discussion
    * @param _isPrivate discussion public or private
    * @param _moderatorLev reputation level to become moderator
    */
    function addDiscussion(
        bytes32 _title,
        bytes32 _initiator,
        bool _isPrivate,
        uint _moderatorLev)
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
            isPrivate : _isPrivate,
            moderatorLev : _moderatorLev,
            //new bytes32[] empty
            disComment : new bytes32[](0),
            //new bytes32[] empty
            disParticipant : new bytes32[](0)
            });
        // emitting the event that a new user has been registered
        emit newDiscussionRegistered(newDiscussionId);
        return newDiscussionId;
    }

}
