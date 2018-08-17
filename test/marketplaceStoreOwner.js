/**
* @author: Kedar Joshi
* @dev: Tests possible actions StoreOwner can take
* We plan: account[0] thru [2] to be Admin or Superuser
*        : account[3] thru [5] to be Storeowner
*        : account[6] thru [9] to be Customer
*
* We then test out who can perform certain actions
*/
const MarketPlace = artifacts.require("./MarketPlace.sol");

contract('MarketPlace', async (accounts) => {
  before('initial prep', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.addSuper(accounts[1]);
    await marketplace.addSuper(accounts[2]);
    await marketplace.registerAsStoreowner('Acme Inc.', 'EIN: 99-999999', {from: accounts[3]});
    await marketplace.registerAsStoreowner('Food Inc.', 'EIN: AA-9999ZZ', {from: accounts[4]});
    await marketplace.registerAsStoreowner('Tool Inc.', 'PIN: BB-9999YY', {from: accounts[5]});
    await marketplace.approveStoreowner(accounts[3]);
    await marketplace.approveStoreowner(accounts[4]);
    await marketplace.approveStoreowner(accounts[5]);

    /*let events = await marketplace.allEvents({address: accounts[0]});
    events.watch((error, result) => {
      if (!error)
        console.log(result);
    }); */
    returnedVal = await marketplace.isStoreowner(accounts[5]);
    assert.isTrue(returnedVal);
  });

  it('should allow approved storeowner to create stores', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.addNewStore('Humble Home Store', 'Image HHS', {from: accounts[3]});
    await marketplace.addNewStore('Trendy Sports Shop', 'Image TSS', {from: accounts[3]});

    let returnedVal = await marketplace.getStoreByOwner(accounts[3], {from: accounts[3]});
    for (let i = 0; i < returnedVal.length; i++) {
      console.log('Store id#' + returnedVal[i].toString());
      let storeInfo = await marketplace.getStoreById(returnedVal[i]);
      console.log(storeInfo[0], storeInfo[1], storeInfo[2], storeInfo[3].toString(), storeInfo[4].toString());
    };
    assert.isTrue(returnedVal.length > 0);
  });

  it('should allow customers to view all stores', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.addNewStore('Busy Bee Backery', 'Image BBB', {from: accounts[4]});
    await marketplace.addNewStore('Fast Furious Ford', 'Image FFF', {from: accounts[5]});

    let returnedVal = await marketplace.getAllStores({from: accounts[6]});
    for (let i = 0; i < returnedVal.length; i++) {
      console.log('Store id#' + returnedVal[i].toString());
      let storeInfo = await marketplace.getStoreById(returnedVal[i]);
      console.log(storeInfo[0], storeInfo[1], storeInfo[2], storeInfo[3].toString(), storeInfo[4].toString());
    };
    assert.isTrue(returnedVal.length > 0);
  });

  it('should not show customers stores that have been revoked', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.revokeAccess(accounts[4]);

    let returnedVal = await marketplace.getAllStores({from: accounts[7]});

    for (let i = 0; i < returnedVal.length; i++) {
      console.log('Store id#' + returnedVal[i].toString());
      let storeInfo = await marketplace.getStoreById(returnedVal[i]);
      console.log(storeInfo[0], storeInfo[1], storeInfo[2], storeInfo[3].toString(), storeInfo[4].toString());
    };

    assert.isFalse(await marketplace.isStoreowner(accounts[4]));
  });

  it('should allow storeowner to maintain store info', async () => {
    let marketplace = await MarketPlace.deployed();
    let stores3 = await marketplace.getStoreByOwner(accounts[3], {from: accounts[3]});
    for (let i = 0; i < stores3.length; i++) {
      await marketplace.maintainStore(stores3[i], 'Johns Goods#'+i.toString(), 'ImageJHG', {from: accounts[3]});
    }

    let returnedVal = await marketplace.getAllStores({from: accounts[7]});
    for (let i = 0; i < returnedVal.length; i++) {
      console.log('Store id#' + returnedVal[i].toString());
      let storeInfo = await marketplace.getStoreById(returnedVal[i]);
      console.log(storeInfo[0], storeInfo[1], storeInfo[2], storeInfo[3].toString(), storeInfo[4].toString());
    };

    assert.isTrue(await marketplace.isStoreowner(accounts[3]));
  });

  it('should not allow storeowner to add more than 3 stores', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.addNewStore('Best Grocery Store', 'Image BGR', {from: accounts[3]});
    await marketplace.addNewStore('Quality Icecream Parlor', 'Image QIP', {from: accounts[3]});
    let returnedVal = await marketplace.getAllStores({from: accounts[8]});
    for (let i = 0; i < returnedVal.length; i++) {
      console.log('Store id#' + returnedVal[i].toString());
      let storeInfo = await marketplace.getStoreById(returnedVal[i]);
      console.log(storeInfo[0], storeInfo[1], storeInfo[2], storeInfo[3].toString(), storeInfo[4].toString());
    };

    assert.isTrue(await marketplace.isStoreowner(accounts[3]));
  });


})
