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
    await marketplace.registerAsStoreowner('Acme Inc.', 'EIN: 99-999999', {from: accounts[3]});
    await marketplace.registerAsStoreowner('Food Inc.', 'EIN: AA-9999ZZ', {from: accounts[4]});
    await marketplace.registerAsStoreowner('Tool Inc.', 'PIN: BB-9999YY', {from: accounts[5]});
  });



})
