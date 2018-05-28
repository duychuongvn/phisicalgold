var ConvertLib = artifacts.require("./ConvertLib.sol");
var PhisicalGold = artifacts.require("./PhisicalGold.sol");

module.exports = function(deployer) {
  deployer.deploy(PhisicalGold);
};
