pragma solidity ^0.4.24;

/**
 * @title MarketStorage
 * @author Kedar Joshi
 * @dev Defines main storage, events and modifiers of the Marketplace
 */
contract MarketStorage {
  uint internal skuCount;
  uint internal storeCount;
  uint8 public constant STORES_PER_OWNER = 3;
  uint8 public constant ITEMS_PER_STORE = 10;

  struct Item {
    uint sku;
    uint storeID;
    address storeOwner;
    string title;
    string imgIPFS;
    string descIPFS;
    uint price;
    uint8 discount;
    uint quantity;
    bool enabled;
  }

  struct Store {
    uint storeID;
    address storeOwner;
    string title;
    string imgIPFS;
    uint storeBal;
    bool enabled;
    uint numItems;
  }

  struct StoreOwner {
    string busTitle;
    string govID;
    uint numStores;
  }

  /**
   * @dev storeOwner => Store => Items exist in 1-to-many relationship.
   * in absence of relational structure and foreign key parallel, declaring a dynamic
   * array seems to be the only option.
   * Howmany storeOwners are approved is controlled by a workflow,
   * Current limit on Stores per Owner and Items per Store each is kept at 10
   */
  mapping (uint => Item) items;
  mapping (uint => Store) stores;
  mapping (address => StoreOwner) storeOwners;
  mapping (address => uint[]) storeIDs; //Owner to Stores is one to many
  mapping (uint => uint[]) skus;        //Store to skus is one to many
  address[] storeOwnerList;
  uint pendRequestNum;

  constructor() public {
    skuCount = 0;
    storeCount = 0;
    pendRequestNum = 0;
  }
  //event PendRequest (address indexed _storeOwner, string _busTitle, string govID);
  //event ApprovedOwner (address indexed _storeOwner, string _busTitle, string govID, uint _numStores);
  event OwnerPaid(uint indexed _storeID, address indexed _storeOwner, uint _storeBal);
  event ItemPurchase(uint indexed _sku, uint indexed _quantity);
  event StoreAdd(uint indexed _storeID, address indexed _storeOwner);
  event StoreMaintain(uint indexed _storeID, address indexed _storeOwner);
  event StoreDisable(uint indexed _storeID, address indexed _storeOwner, uint _storeBal);
  event ItemAdd(uint indexed _sku, uint indexed _storeID, address indexed _storeOwner);
  event ItemMaintain(uint indexed _sku, address indexed _storeOwner);
  event ItemDisable(uint indexed _sku, uint indexed _storeID, address indexed _storeOwner);
  event OutOfStock(uint indexed _sku, uint indexed _storeID, address indexed _storeOwner);

  modifier checkStorelimit(uint _numStores) {require(_numStores < STORES_PER_OWNER); _;}
  modifier checkItemlimit(uint _numItems) {require(_numItems < ITEMS_PER_STORE); _;}
  modifier canBuy(uint _sku) {require(items[_sku].enabled == true); _;}
  modifier checkValue(uint _sku, uint _quantity ) {
    //refund them after pay for item (why it is before, _ checks for logic before func)
    _;
    uint price = items[_sku].price;
    uint discount = items[_sku].discount;
    uint owedAmount = _quantity * items[_sku].price * (100 - items[_sku].discount) / 100;
    uint amountToRefund = msg.value - owedAmount ;
    if (amountToRefund > 0) {msg.sender.transfer(amountToRefund);}
  }

  modifier verifyStock(uint _sku, uint _quantity) {
    //ensure store has enough quantity to service the request. Detect item out of stock and disable it
    if (items[_sku].quantity <= _quantity) {
        _quantity = items[_sku].quantity;
    }
    _;
    items[_sku].quantity -= _quantity;
    if (items[_sku].quantity == 0) {
      items[_sku].enabled = false;
      emit OutOfStock(_sku, items[_sku].storeID, items[_sku].storeOwner);
    }
  }
}
