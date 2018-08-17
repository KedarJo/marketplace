pragma solidity ^0.4.24;
//pragma experimental ABIEncoderV2;

import "./MarketRBAC.sol";
import "./MarketStorage.sol";
/**
 * @title Marketplace
 * @author Kedar Joshi
 * @dev MarketPlace inherits Open Zeppelin's Ownable and Role based Access control contracts
 * The contract will assign creator as admin and allow admin to assign superusers
 * Default role is customer with intent to browse and / or buy
 * Customer can register to be a store owner on the marketplace pending approval from admin
 *
 */
contract MarketPlace is MarketStorage, MarketRBAC {

  /**
   * @dev Customer can register to become a storeowner. At this stage this is pending approval
   * @param _busTitle Business name
   * @param _govID Government ID such as tax ID
   */
   function registerAsStoreowner(string _busTitle, string _govID)
    public {
     storeOwners[msg.sender].busTitle = _busTitle;
     storeOwners[msg.sender].govID = _govID;
     storeOwners[msg.sender].numStores = 0;
     storeOwnerList.push(msg.sender);
     pendRequestNum ++;
     requestStoreowner(msg.sender);
     //return storeOwners[msg.sender].busTitle;
   }
   /**
    * @dev Wrapper for addStoreowner to reduce pending counter
    */
   function approveStoreowner(address _storeOwner)
    public {
      addStoreowner(_storeOwner);
      pendRequestNum --;
    }
   /**
    * @dev getter for Admin or Superuser to view all pending requests
    * pattern - instead of returning array, log events for each one.
    * If no requests are pending, return false
    */
   function getPendingRequests()
      public
      view
      onlyAdminOrSuperuser
      returns (address[]){

        address[] memory pendOwners = new address[](pendRequestNum);
        uint64 counter = 0;
        for (uint i=0; i < storeOwnerList.length; i++) {
          if(isRequestPending(storeOwnerList[i]))
          {
            pendOwners[counter] = storeOwnerList[i];
            counter++;
          }
        }

        return (pendOwners);
   }
   /**
    * @dev getter for Admin or Superuser to view all approved storeOwners. This allows them to revoke access if required.
    */
   function getApprovedStoreowners()
      public
      view
      onlyAdminOrSuperuser
      returns (address[]) {
        uint approvedNum = storeOwnerList.length - pendRequestNum;
        address[] memory approvedOwners = new address[](approvedNum);
        uint64 counter = 0;

        for (uint i=0; i < storeOwnerList.length; i++) {
          if(isStoreowner(storeOwnerList[i]))
          {
              approvedOwners[counter] = storeOwnerList[i];
              counter++;
          }
        }
        return (approvedOwners);
   }
   /**
    * @dev simple getter for Storeowner data based on address.
    * Can be used with getPendingRequests and getApprovedStoreowners
    */
    function getStoreOwner(address _storeOwner)
     public
     view
     returns (string, string, uint){
       require(isAdmin(msg.sender) || isSuperuser(msg.sender) || msg.sender == _storeOwner);

       return (storeOwners[_storeOwner].busTitle,
               storeOwners[_storeOwner].govID,
               storeOwners[_storeOwner].numStores);
    }
   /**
    * @dev Admin or Superuser can revoke storeowner access. With that disable all stores and listings
    */
   function revokeAccess(address _storeOwner)
    public
    onlyAdminOrSuperuser
    {
      require (isStoreowner(_storeOwner));
      removeStoreowner(_storeOwner);
      uint[] memory myStores = storeIDs[_storeOwner];
      for (uint8 i = 0; i < myStores.length; i++) {
        stores[myStores[i]].enabled = false;
        emit StoreDisable(myStores[i], _storeOwner, stores[myStores[i]].storeBal);

        uint[] memory mySkus = skus[myStores[i]];
        for (uint8 j = 0; j < mySkus.length; j++) {
          items[mySkus[j]].enabled = false;
          emit ItemDisable(mySkus[j], items[mySkus[j]].storeID, items[mySkus[j]].storeOwner);
        }
      }
   }
    /**
     * @dev Admin or Superuser can deny request. Wrapper for removePending
     */
   function denyPendingRequest(address _storeOwner)
     public
     onlyAdminOrSuperuser {
       require (isRequestPending(_storeOwner));
       removePending(_storeOwner);
   }
    /**
    * @dev Approved storeowner can add new store
    */
   function addNewStore(string _title, string _imgIPFS)
     public
     onlyStoreowner
     checkStorelimit(storeOwners[msg.sender].numStores) {
       storeCount ++;
       stores[storeCount].storeID = storeCount;
       stores[storeCount].storeOwner = msg.sender;
       stores[storeCount].title = _title;
       stores[storeCount].imgIPFS = _imgIPFS;
       stores[storeCount].storeBal = 0;
       stores[storeCount].enabled = true;
       stores[storeCount].numItems = 0;
       storeOwners[msg.sender].numStores += 1;
       storeIDs[msg.sender].push(storeCount);
       emit StoreAdd(storeCount, msg.sender);
   }
   /**
    * @dev Approved storeowner can maintain store info - title and image
    */
  function maintainStore(uint _storeID, string _title, string _imgIPFS)
    public
    onlyStoreowner {
      require(stores[_storeID].storeOwner == msg.sender);
      stores[_storeID].title = _title;
      stores[_storeID].imgIPFS = _imgIPFS;
      emit StoreMaintain(_storeID, msg.sender);
  }
  /**
   * @dev simple getter for Stores. Ensure store is not disabled. Do not show storeBalance to customers
   */
  function getStoreById(uint _storeID)
    public
    view
    returns (address, string, string, uint, uint) {
      require(stores[_storeID].enabled == true);
      if (msg.sender == stores[_storeID].storeOwner || isAdmin(msg.sender) || isSuperuser(msg.sender)) {
        return (stores[_storeID].storeOwner,
                stores[_storeID].title,
                stores[_storeID].imgIPFS,
                stores[_storeID].storeBal,
                stores[_storeID].numItems);
      } else {
        return (stores[_storeID].storeOwner,
                stores[_storeID].title,
                stores[_storeID].imgIPFS,
                0,
                stores[_storeID].numItems);
      }
  }
  /**
    * @dev getter for store IDs belonging to owner. This needs to be followed by calls to getStoreById
    */
  function getStoreByOwner(address _storeOwner)
    public
    view
    onlyStoreowner
    returns (uint []) {
      require (msg.sender == _storeOwner);
      return storeIDs[_storeOwner];
  }
  /**
    * @dev getter for customers. Customers do not see diabled stores from owners with revoked access
    * This should be followed by getStoreById calls to get the details of each
    */
  function getAllStores()
    public
    view
    returns (uint []) {
      uint[] activeStores;
      for (uint i = 0; i <= storeCount; i++) {
        if (stores[i].enabled == true) {activeStores.push(i);}
      }
      return activeStores;
  }/**
   * @dev Approved storeowner can add new item to their stores
   */
  function addNewItem(uint _storeID, string _title, string _imgIPFS, string _descIPFS, uint _price, uint8 _discount, uint _quantity)
    public
    onlyStoreowner
    checkItemlimit(stores[_storeID].numItems) {
      require(msg.sender == stores[_storeID].storeOwner);
      require(_discount <= 100 && _discount >= 0);
      skuCount ++;
      items[skuCount].sku = skuCount;
      items[skuCount].storeOwner = msg.sender;
      items[skuCount].storeID = _storeID;
      items[skuCount].title = _title;
      items[skuCount].imgIPFS = _imgIPFS;
      items[skuCount].descIPFS = _descIPFS;
      items[skuCount].price = _price;
      items[skuCount].discount = _discount;
      items[skuCount].quantity = _quantity;
      items[skuCount].enabled = false;
      if (_quantity > 0) {items[skuCount].enabled = true;}
      stores[_storeID].numItems += 1;
      skus[_storeID].push(skuCount);
      emit ItemAdd(skuCount, _storeID, msg.sender);
  }
  /**
   * @dev Approved storeowner can maintain item details
   * @param _sku key to access item and update all other attributes
   */
  function maintainItem(uint _sku, string _title, string _imgIPFS, string _descIPFS, uint _price, uint8 _discount, uint _quantity)
    public
    onlyStoreowner {
      require(items[_sku].storeOwner == msg.sender);
      require(_discount <= 100 && _discount >= 0);
      items[_sku].title = _title;
      items[_sku].imgIPFS = _imgIPFS;
      items[_sku].descIPFS = _descIPFS;
      items[_sku].price = _price;
      items[_sku].discount = _discount;
      items[_sku].quantity = _quantity;
      items[_sku].enabled = false;
      if (_quantity > 0) {items[_sku].enabled = true;}
      emit ItemMaintain(_sku, msg.sender);
  }
  /**
   * @dev simple getter for SKU. Storeowner sees all items. Customers do not see out-of-stock / diabled items
   */
  function getItemsBySku(uint _sku)
    public
    view
    returns (string, string, string, uint, uint8, uint) {
      if (items[_sku].enabled == true || items[_sku].storeOwner == msg.sender){
        return (items[_sku].title,
                items[_sku].imgIPFS,
                items[_sku].descIPFS,
                items[_sku].price,
                items[_sku].discount,
                items[_sku].quantity);
      }
    }
    /**
     * @dev simple getter for SKU for owner properties. Split above to address 'stack too deep' issue with solidity
     */
    function getItemsOwner(uint _sku)
      public
      view
      returns (address, uint) {
        if (items[_sku].enabled == true || items[_sku].storeOwner == msg.sender){
          return (items[_sku].storeOwner,
                  items[_sku].storeID);
        }
      }

  /**
   * @dev getter for items by storeID.
   */
  function getItemsByStoreID(uint _storeID)
    public
    view
    returns (uint[]) {
      return skus[_storeID];
  }
  /**
    * @dev getter for skuCount items for customers. Customers do not see out-of-stock / diabled items
    * This should be followed by getItemsBySku in loop to get all items.
    * We can do this because the sku is simple counter
    */
  function getSkuCount()
    public
    view
    returns (uint) {
      return skuCount;
  }
  /**
   * @dev When purchasing item, make sure
   * Item is enabled
   * Item is in stock to service the request
   * Amount paid is sufficient to cover the purchased item. Pay purchase price to storeOwner and send balance back to customer
   */
  function purchaseItem(uint _sku, uint _quantity)
    public
    payable
    whenNotPaused
    verifyStock(_sku, _quantity) {
        require(items[_sku].enabled == true);
        uint owedAmount = _quantity * items[_sku].price * (100 - items[_sku].discount) / 100;
        require (msg.value >= owedAmount);
        if (msg.value > owedAmount) {msg.sender.transfer(msg.value - owedAmount);}
        emit ItemPurchase(_sku, _quantity);
        //if overflow of storeBalance, payout current balance to storeOwner and replace with new value. Otherwise accumulate.
        uint _storeID = items[_sku].storeID;
        if (stores[_storeID].storeBal + owedAmount < stores[_storeID].storeBal) {
          uint currBal = stores[_storeID].storeBal;
          stores[_storeID].storeBal = owedAmount;
          emit OwnerPaid(_storeID, stores[_storeID].storeOwner, currBal);
          stores[_storeID].storeOwner.transfer(currBal);
        } else {
          stores[_storeID].storeBal += owedAmount;
        }

  }
  /**
   * @dev Only Admin or Superuser can trigger payments to Storeowners
   */
  function payStore(uint _storeID)
    public
    payable
    whenNotPaused
    onlyAdminOrSuperuser {
      uint balance = stores[_storeID].storeBal;
      emit OwnerPaid(_storeID, stores[_storeID].storeOwner, balance);
      stores[_storeID].storeBal = 0;
      stores[_storeID].storeOwner.transfer(balance);
    }
  /**
   * @dev Transfers the current balance to the owner, pays out all active Storeowners and terminates the contract.
   */
  function destroy() public payable onlyOwner  {
    for(uint i=0; i < storeCount; i++){
      if (isStoreowner(stores[i].storeOwner) && stores[i].storeBal > 0) {
        emit OwnerPaid(stores[i].storeID, stores[i].storeOwner, stores[i].storeBal);
        stores[i].storeOwner.transfer(stores[i].storeBal);
      }
    }
    selfdestruct(owner);
  }
  /**
   * @dev Fall back function
   */
  function () public {
    revert();
  }
}
