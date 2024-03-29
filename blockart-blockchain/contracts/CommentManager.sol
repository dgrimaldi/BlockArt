pragma solidity ^0.5.0;

import "./UserManager.sol";
import "./ConcatHelper.sol";
import "./DiscussionManager.sol";

contract CommentManager is UserManager {
  //library to concat bytes
  using ConcatHelper for bytes;

  // indicate the status of the comment
  enum Stat{Pending, Accepted, Rejected}

  //struct with the basic comment information
  struct Comment {
    // author of the comment
    bytes32 author;
    //comment title
    bytes32 title;
    // content of the comment
    string content;
    // number of positive vote received
    uint numPosRecVote;
    // number of negative vote received
    uint numNegRecVote;
    // title of discussion
    bytes32 titleDis;
    // the status of the comment
    Stat stat;
  }

  // map with key= 'commentId'+'comment_title' and value a number
  mapping(bytes => uint) public commentIds;

  //Array of comment
  Comment[] public comments;

  // event fired when an comment is registered
  event newCommentRegistered(uint id);

  constructor() public{
    // NOTE: the first comment and participant MUST be emtpy:
    // if you are trying to access to an element
    // of the commentIds mapping that does not exist you will
    // receive 0, that's why in the first position (with index 0) must be initialized
    addComment("", "", "", "");
  }
  /**
    * Function to register a new comment.
    *
    * @param _author the address of the author
    * @param _title title of the comment
    * @param _content the content of the comment
   */
  function registerComment(
    bytes32 _author,
    bytes32 _title,
    string memory _content,
    bytes32 _discussionTitle)
  public returns (uint) {
    return addComment(_author, _title, _content, _discussionTitle);
  }

  /**
  * Add a new comment. This function must be private because an user
  * cannot insert other information about comment and participant
  *
  * @param _author author of the comment
  * @param _commentTitle title of the comment
  * @param _content content of comment
  */
  function addComment(
    bytes32 _author,
    bytes32 _commentTitle,
    string memory _content,
    bytes32 _discussionTitle)
  private returns (uint) {
    bytes memory _commentKey = ConcatHelper.concat2(ConcatHelper.concat(_discussionTitle, _commentTitle), _author);
    // checking if the comment is already registered
    uint commentId = commentIds[_commentKey];
    require(commentId == 0);
    // associating the title of comment with the new ID
    commentIds[_commentKey] = comments.length;
    uint newCommentId = comments.length++;
    // storing the new user details

    comments[newCommentId] = Comment({
      author : _author,
      title : _commentTitle,
      content : _content,
      numPosRecVote : 0,
      numNegRecVote : 0,
      stat : Stat.Pending,
      titleDis : _discussionTitle
      });
    // emitting the event that a new user has been registered
    emit newCommentRegistered(newCommentId);
    return newCommentId;
  }
  /*
  *
  */
  function getComment(uint _id) public view returns (bytes32, bytes32, string memory, uint, uint, bytes32){
    Comment storage c = comments[_id];
    return (
    c.author,
    c.title,
    c.content,
    c.numPosRecVote,
    c.numNegRecVote,
    c.titleDis
    );
  }
  /*
  * return the number of comment
  */
  function getNumComments() public view returns (uint){
    return comments.length;
  }
  /*
  * return the number of comment
  */
  function registerVote(
    bytes32 _author,
    bytes32 _commentTitle,
    bytes32 _discussionTitle,
    bytes32 _voter,
    bool _isPositive
  ) public returns (uint) {
    return addVote(_author, _commentTitle, _discussionTitle, _voter, _isPositive);
  }

  function addVote(
    bytes32 _author,
    bytes32 _commentTitle,
    bytes32 _discussionTitle,
    bytes32 _voter,
    bool _isPosvote)
  private returns (uint){
    // require(_author != _voter);
    bytes memory _commentKey = ConcatHelper.concat2(ConcatHelper.concat(_discussionTitle, _commentTitle), _author);
    uint commentId = commentIds[_commentKey];
    Comment storage comment = comments[commentId];
    if (_isPosvote)
      comment.numPosRecVote += 1;
    else
      comment.numNegRecVote += 1;
    return commentId;
  }

  function getVote(
    bytes32 _author,
    bytes32 _commentTitle,
    bytes32 _discussionTitle
  ) public view returns (uint, uint){
    bytes memory _commentKey = ConcatHelper.concat2(ConcatHelper.concat(_discussionTitle, _commentTitle), _author);
    uint commentId = commentIds[_commentKey];
    Comment storage comment = comments[commentId];
    return (comment.numPosRecVote, comment.numNegRecVote);
  }
}
