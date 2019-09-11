pragma solidity ^0.5.0;

contract UserManager {
  //sturct with the basic user information
  struct User {
    // name of the user
    string username;
    // a variable with the sum of positive evaluation
    bytes32 repAddress;
    // reputation value
    uint256 repValue;
    // number of evaluation received
    uint256 numEvaluation;
    // needed a variable to keep track of the past works
  }

  // it maps the user's reputation E|Beta(α,β)| address with the user ID
  // where α is the variable of the sum of negative evaluation and β the sum of positive evaluation
  mapping(bytes32 => uint) public usersIds;

  // Array of User that holds the list of users and their details
  User[] users;

  // event fired when an user is registered
  event newUserRegistered(uint id);

  // event fired when the user updates his status or name
  event userUpdateRepEvent(uint id);

  // Modifier: check if the caller of the smart contract is registered
  modifier checkSenderIsNotRegistered(bytes32 _address) {
    require(
      isNotRegistered(_address),
      "User already registered"
    );
    _;
  }

  /**
  * Constructor function
  */
  constructor() public {
    // NOTE: the first user MUST be emtpy: if you are trying to access to an element
    // of the usersIds mapping that does not exist (like usersIds[0x12345]) you will
    // receive 0, that's why in the first position (with index 0) must be initialized
    addUser("", bytes32("0x0"));
    // Some dummy data

    addUser("Leon Brown", bytes32("0x333333333333"));
    addUser("John Doent", bytes32("0x111111111111"));
    addUser("Mary Smith", bytes32("0x222222222222"));

  }

  /**
  * Function to register a new user.
  *
  * @param _username The displaying name*
  */
  function registerUser(string memory _username, bytes32 _address) checkSenderIsNotRegistered(_address) public returns (uint) {
    return addUser(_username, _address);
  }
  /**
  * Add a new user. This function must be private because an user
  * cannot insert another user on behalf of someone else.
  *
  * @param _rAddr Address reputation of the user
  */
  function addUser(string memory _username, bytes32 _rAddr) private returns (uint) {
    // checking if the user is already registered
    uint userId = usersIds[_rAddr];
    require(userId == 0);
    // associating the user reputation address with the new ID
    usersIds[_rAddr] = users.length;
    uint newUserId = users.length++;
    // storing the new user details
    users[newUserId] = User({
      username : _username,
      repAddress : _rAddr,
      // inital reputation value
      repValue : 1,
      // initial number of evaluation received
      numEvaluation : 0
      });
    // emitting the event that a new user has been registered
    emit newUserRegistered(newUserId);
    return newUserId;
  }

  /**
  * Update the evaluation of the user calling this method.
  * Note: only the evaluation has been validate profile is update.
  *
  * @param _newEvaluation The new user's displaying name
  * @param _address of the updated profile
  */
  function updateReputaion(uint256 _newEvaluation, bytes32 _address) public returns (uint) {
    // Only the voting of moderator.
    uint userId = usersIds[_address];
    User storage user = users[userId];
    user.repValue = _newEvaluation;
    user.numEvaluation = user.numEvaluation++;
    emit userUpdateRepEvent(userId);
    return userId;
  }

  /**
  * Update the works and its percentage of the user
  * beta version dosen't keep track of the past partecipation of the user
  * the final version will need of a review of this function
  *
  * @param _address of the updated profile
  * @param _workId identifier of the work
  * @param _percentage percentage of the collaboration of the user to the work
  */

  //function updateWork(address _address, uint _workId, uint _percentage) public return(uint) {
  //    uint userId = usersIds[_address];
  //    User storage user = users[userId];
  //
  //    //  checking if the user is already registered
  //    //  uint workId = user.works[_workId];
  //    user.works[_workId] = _percentage;
  //    emit userUpdateWorksEvent(workId);
  //    return workId;
  //}

  /**
  * Check if the user that is calling the smart contract is registered.
  * @param _address address of the user
  */
  function isNotRegistered(bytes32 _address) public view returns (bool) {
    return (usersIds[_address] == 0);
  }
  /**
  * Return string with name of function's caller
  * @param _address of caller of the function
  */
  function getName(bytes32 _address) public view returns (string memory){
    uint userId = usersIds[_address];
    User storage user = users[userId];
    return user.username;
  }
  /**
  * Return uint256 with reputation value of function's caller
  * @param _address of caller of the function
  */
  function getReputation(bytes32 _address) public view returns(uint256){
    uint userId = usersIds[_address];
    User storage user = users[userId];
    return user.repValue;
  }

}

