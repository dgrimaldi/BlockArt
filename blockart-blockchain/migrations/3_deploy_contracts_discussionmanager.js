var DiscussionManager= artifacts.require("DiscussionManager");

module.exports = function(deployer) {
    deployer.deploy(DiscussionManager);
};