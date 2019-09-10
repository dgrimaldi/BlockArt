var CommentManager= artifacts.require("CommentManager");

module.exports = function(deployer) {
    deployer.deploy(CommentManager);
};