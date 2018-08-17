pragma solidity ^0.4.24;

import "./Zep/Ownable.sol";
import "./Zep/rbac/RBAC.sol";

/**
 * @title Role Based Access Control for MarketPlace
 * @author Kedar Joshi
 * @dev inherits Open Zeppelin's Ownable and Role based Access control contracts
 * MarketPlace acknowledges three roles: Admin, Superuser, Storeowner
 * The base functionality is inspired by Open Zeppelin example contracts
 * The contract will assign creator as admin and allow admin to add/remove superusers and transfer Admin role.
 * Beyond that Admin and Superuser enjoy same access rights
 * These are - approving storeOwners, managing storeOwner access and invoking circuit-breaker
 * Default role is customer with intent to browse stores and / or buy items
 * Customer can register to be a store owner on the marketplace pending approval from Admin/Superuser
 *
 *
 */
contract MarketRBAC is Ownable, RBAC {
  string public constant ROLE_SUPERUSER = "superuser";
  string public constant ROLE_ADMIN = "admin";
  string public constant ROLE_STOREOWNER = "storeowner";
  string public constant ROLE_STOREOWNERREQ = "storeownerreq";
  bool public paused = false;
  event Pause();
  event Unpause();

  constructor () public {
    addRole(msg.sender, ROLE_ADMIN);
  }
  /**
   * @dev Throws if called by any account that's not a admin.
   */
  modifier onlyAdmin() {
    checkRole(msg.sender, ROLE_ADMIN);
    _;
  }

  modifier onlyAdminOrSuperuser() {
    require(isAdmin(msg.sender) || isSuperuser(msg.sender));
    _;
  }

  modifier onlyStoreowner() {
    require(isStoreowner(msg.sender));
    _;
  }

  /**
   * @dev getter to determine if address has Admin role
   */
  function isAdmin(address _addr)
    public
    view
    returns (bool)
  {
    return hasRole(_addr, ROLE_ADMIN);
  }
  /**
   * @dev getter to determine if address has superuser role
   */
  function isSuperuser(address _addr)
    public
    view
    returns (bool)
  {
    return hasRole(_addr, ROLE_SUPERUSER);
  }
  /**
   * @dev getter to determine if address has StoreOwner role
   */
  function isStoreowner(address _addr)
    public
    view
    returns (bool)
  {
    return hasRole(_addr, ROLE_STOREOWNER);
  }
  /**
   * @dev getter to determine if address has requested StoreOwner role
   */
  function isRequestPending(address _addr)
    public
    view
    returns (bool)
  {
    return hasRole(_addr, ROLE_STOREOWNERREQ);
  }
  /**
   * @dev Only admin can add Superuser
   * @param _superUser address to be added as Superuser
   */
  function addSuper(address _superUser) public onlyAdmin { //
    addRole(_superUser, ROLE_SUPERUSER);
  }
  /**
   * @dev Only admin can remove Superuser
   * @param _superUser address
   */
  function removeSuper(address _superUser) public onlyAdmin {
    removeRole(_superUser, ROLE_SUPERUSER);
  }
  /**
   * @dev anyone can request to be a Storeowner.
   * @param _storeOwner requesting address
   */
  function requestStoreowner(address _storeOwner) internal {
    addRole(_storeOwner, ROLE_STOREOWNERREQ);
  }
  /**
   * @dev Admin or Superuser can deny request to be a Storeowner.
   * @param _storeOwner requesting address
   */
  function removePending(address _storeOwner) internal onlyAdminOrSuperuser{
    removeRole(_storeOwner, ROLE_STOREOWNERREQ);
  }
  /**
   * @dev Only admin or Superuser can add Storeowner
   * @param _storeOwner address to be added as Storeowner
   */
  function addStoreowner(address _storeOwner) internal onlyAdminOrSuperuser {
    checkRole(_storeOwner, ROLE_STOREOWNERREQ);
    removeRole(_storeOwner, ROLE_STOREOWNERREQ);
    addRole(_storeOwner, ROLE_STOREOWNER);
  }
  /**
   * @dev Only admin or Superuser can remove StoreOwner.
   * This deprecates storeowner to regular customer. StoreOwner must reapply to gain access to stores
   * @param _storeOwner address
   */
  function removeStoreowner(address _storeOwner) internal onlyAdminOrSuperuser {
    removeRole(_storeOwner, ROLE_STOREOWNER);
  }
  /**
   * @dev Allows the current Admin to transfer his role to a new Admin.
   * @param _newAdmin The address to transfer ownership to.
   */
  function transferAdmin(address _newAdmin) public onlyAdmin {
    require(_newAdmin != address(0));
    removeRole(msg.sender, ROLE_ADMIN);
    addRole(_newAdmin, ROLE_ADMIN);
  }

  /**
   * @dev Modifier to make a function callable only when the contract is not paused.
   */
  modifier whenNotPaused() {
    require(!paused);
    _;
  }

  /**
   * @dev Modifier to make a function callable only when the contract is paused.
   */
  modifier whenPaused() {
    require(paused);
    _;
  }

  /**
   * @dev called by the Admin or Superuser to pause, triggers stopped state
   */
  function pause() onlyAdmin whenNotPaused public {
    paused = true;
    emit Pause();
  }

  /**
   * @dev called by the Admin or Superuser to unpause, returns to normal state
   */
  function unpause() onlyAdmin whenPaused public {
    paused = false;
    emit Unpause();
  }
}
