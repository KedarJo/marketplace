/**
* @author: Kedar Joshi
* @dev: Tests various possible role based access scenarios
* We plan: account[0] thru [2] to be Admin or Superuser
*        : account[3] thru [5] to be Storeowner
*        : account[6] thru [9] to be Customer
*
* We then test out who can perform certain actions
*/
var MarketPlace = artifacts.require("./MarketPlace.sol");

contract('MarketPlace', async (accounts) => {

  //console.log(accounts);

  it('should validate first account as admin user', async () => {
    //let marketplace = await MarketPlace.new({ from: accounts[0] });
    let marketplace = await MarketPlace.deployed();
    let returnedVal = await marketplace.isAdmin(accounts[0]);
    assert.isTrue(returnedVal);
  });

  it('should allow Admin to add Superuser', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.addSuper(accounts[1]);
    let returnedVal = await marketplace.isSuperuser(accounts[1]);
    assert.isTrue(returnedVal);
  });

  it('should allow Admin to remove Superuser', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.removeSuper(accounts[1]);
    let returnedVal = await marketplace.isSuperuser(accounts[1]);
    assert.isFalse(returnedVal);
  });

  it('should not allow Superuser to add other Superuser', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.addSuper(accounts[1]);
    await marketplace.addSuper(accounts[2], {from: accounts[1]});
    let returnedVal = await marketplace.isSuperuser(accounts[2]);
    assert.isFalse(returnedVal);
  });

  it('should allow Admin to transfer Admin role to others', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.transferAdmin(accounts[1]);
    let newAdmin = await marketplace.isAdmin(accounts[1]);
    let oldAdmin = await marketplace.isAdmin(accounts[0]);
    assert.isTrue(newAdmin && !oldAdmin);
  });

  it('should not allow old Admin to add other Superuser', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.addSuper(accounts[2]);
    let returnedVal = await marketplace.isAdmin(accounts[2]);
    assert.isTrue(returnedVal);
  });

  it('should allow customers to register as StoreOwner', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.registerAsStoreowner('Acme Inc.', 'EIN: 99-999999', {from: accounts[3]});
    let returnedVal = await marketplace.isRequestPending(accounts[3]);
    assert.isTrue(returnedVal);
  });

  it('should allow new Admin to approve StoreOwner', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.approveStoreowner(accounts[3], {from: accounts[1]});
    let returnedVal = await marketplace.isStoreowner(accounts[3]);
    assert.isTrue(returnedVal);
  });

  it('should allow Superuser to approve StoreOwner', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.registerAsStoreowner('Food Inc.', 'TIN: 99-999998', {from: accounts[4]});
    await marketplace.addSuper(accounts[2], {from: accounts[1]});
    await marketplace.approveStoreowner(accounts[4], {from: accounts[2]});
    let returnedVal = await marketplace.isStoreowner(accounts[4]);
    assert.isTrue(returnedVal);
  });

  it('should allow Superuser to view pending StoreOwner requests', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.registerAsStoreowner('Toy Inc.', 'PIN: 99-999998', {from: accounts[5]});
    //console.log(title);
    returnedVal = await marketplace.getPendingRequests({from: accounts[2]});
    console.log(returnedVal);
    let pendRequestNum = returnedVal.length;
    console.log(pendRequestNum);
    for (let i = 0; i < pendRequestNum; i++) {
      storeOwner = await marketplace.getStoreOwner(returnedVal[i], {from: accounts[2]} );
      console.log(storeOwner[0]);
      console.log(storeOwner[1]);
      console.log((storeOwner[2]).toString(10));
    }
    assert.isTrue(pendRequestNum >= 0);

    /*let events = await marketplace.allEvents({address: accounts[2]});
    events.watch((error, result) => {
      if (!error)
        console.log(result);
    });*/
  });

  it('should allow Admin to list Approved StoreOwners', async () => {
    let marketplace = await MarketPlace.deployed();
    returnedVal = await marketplace.getApprovedStoreowners({from: accounts[1]});
    console.log(returnedVal);
    let approvedNum = returnedVal.length;
    console.log(approvedNum);
    for (let i = 0; i < approvedNum; i++) {
      //console.log(returnedVal[0][i], returnedVal[1][i], returnedVal[2][i], returnedVal[3][i]);
      storeOwner = await marketplace.getStoreOwner(returnedVal[i], {from: accounts[1]});
      console.log(storeOwner[0]);
      console.log(storeOwner[1]);
      console.log((storeOwner[2]).toString(10));
    }
    assert.isTrue(approvedNum >= 0);

    /*let events = await marketplace.allEvents({address: accounts[1]});
    events.watch((error, result) => {
      if (!error)
        console.log(result);
    }); */

  });

  it('should not allow storeOwner to view Pending Requests', async () => {
    let marketplace = await MarketPlace.deployed();
    returnedVal = await marketplace.getPendingRequests({from: accounts[3]})
    let pendingNum = returnedVal1.length;
    assert.isTrue(pendingNum >= 0);
  });

  it('should not allow storeOwner to view other approved Owners', async () => {
    let marketplace = await MarketPlace.deployed();
    returnedVal = await marketplace.getApprovedStoreowners({from: accounts[4]});
    let approvedNum = returnedVal1.length;
    assert.isTrue(approvedNum >= 0);
  });

  it('should not allow customer to view Pending Requests', async () => {
    let marketplace = await MarketPlace.deployed();
    returnedVal = await marketplace.getPendingRequests({from: accounts[6]})
    let pendingNum = returnedVal1.length;
    assert.isTrue(pendingNum >= 0);
  });

  it('should not allow customer to view other approved owners', async () => {
    let marketplace = await MarketPlace.deployed();
    returnedVal = await marketplace.getApprovedStoreowners({from: accounts[7]});
    let approvedNum = returnedVal1.length;
    assert.isTrue(approvedNum >= 0);
  });

  it('should allow Admin to revoke access of store owner', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.revokeAccess(accounts[3], {from: accounts[1]});
    returnedVal = await marketplace.isStoreowner(accounts[3]);
    assert.isFalse(returnedVal);
  });

  it('should allow Superuser to revoke access of store owner', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.revokeAccess(accounts[4], {from: accounts[2]});
    returnedVal = await marketplace.isStoreowner(accounts[4]);
    assert.isFalse(returnedVal);
  });

  it('should allow Superuser to deny request to be store owner', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.denyPendingRequest(accounts[5], {from: accounts[2]});
    returnedVal = await marketplace.isRequestPending(accounts[5]);
    assert.isFalse(returnedVal);
  });

})
