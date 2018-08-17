var Ownable = artifacts.require("./Zep/Ownable.sol");
var RBAC = artifacts.require("./Zep/rbac/RBAC.sol");
var Roles = artifacts.require("./Zep/rbac/Roles.sol");
var MarketStorage = artifacts.require("./MarketStorage.sol");
var MarketRBAC = artifacts.require("./MarketRBAC.sol");
var MarketPlace = artifacts.require("./MarketPlace.sol");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(Roles);
  deployer.link(Roles, RBAC);
  deployer.deploy(RBAC);
  deployer.deploy(MarketRBAC);
  deployer.deploy(MarketStorage);
  deployer.deploy(MarketPlace);
};
