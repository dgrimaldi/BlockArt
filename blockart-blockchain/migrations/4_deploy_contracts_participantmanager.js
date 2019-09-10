var ParticipantManager= artifacts.require("ParticipantManager");

module.exports = function(deployer) {
    deployer.deploy(ParticipantManager);
};