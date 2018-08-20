/**
* @author: Kedar Joshi
* @dev: Tests possible actions Customer can take
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
    await marketplace.addNewStore('Humble Home Store', 'ImageHHS', {from: accounts[3]});
    await marketplace.addNewStore('Trendy Sports Shop', 'ImageTSS', {from: accounts[3]});
    await marketplace.addNewStore('Busy Bee Backery', 'ImageBBB', {from: accounts[4]});
    await marketplace.addNewStore('Fast Furious Ford', 'ImageFFF', {from: accounts[5]});
    await marketplace.addNewItem(1,'Beautiful Vase', 'ImgHHSBV', 'DescHHSSBV',
                                 20000000000000, 0, 50, {from: accounts[3]});

    await marketplace.addNewItem(1,'Boho Chair', 'ImgHHSBC', 'DescHHSSBC',
                                 90000000000000, 0, 25, {from: accounts[3]});

    await marketplace.addNewItem(1,'Woodcraft Coasters', 'ImgHHSWC', 'DescHHSSWC',
                                 10000000000000, 0, 75, {from: accounts[3]});
    //
    await marketplace.addNewItem(2,'Tennis Gear', 'ImgHHSTG', 'DescHHSSTG',
                                 90000000000000, 15, 505, {from: accounts[3]});

    await marketplace.addNewItem(2,'Baseball Gear', 'ImgHHSBG', 'DescHHSSBG',
                                 80000000000000, 5, 300, {from: accounts[3]});

    await marketplace.addNewItem(2,'Football Gear', 'ImgHHSFG', 'DescHHSSFG',
                                 50000000000000, 10, 450, {from: accounts[3]});

    await marketplace.addNewItem(2,'Fancy Gear', 'ImgHHSFG', 'DescHHSSFG',
                                 70000000000000, 10, 150, {from: accounts[3]});

    await marketplace.addNewItem(2,'Fiesta Gear', 'ImgHHSFG', 'DescHHSSFG',
                                 60000000000000, 40, 550, {from: accounts[3]});
    //console.log('Should be 3 ' + returnedVal.length.toString());
    await marketplace.addNewItem(3,'Awesome Cupcakes', 'ImgHHSTG', 'DescHHSSTG',
                                 90000000000000, 15, 505, {from: accounts[4]});

    await marketplace.addNewItem(3,'Yummy Donuts', 'ImgHHSBG', 'DescHHSSBG',
                                 8000000000000, 5, 3, {from: accounts[4]});

    await marketplace.addNewItem(3,'Themed Birthday Cakes', 'ImgHHSFG', 'DescHHSSFG',
                                 50000000000000, 10, 450, {from: accounts[4]});

    await marketplace.addNewItem(3,'Garlic Bread', 'ImgHHSFG', 'DescHHSSFG',
                                 70000000000000, 10, 150, {from: accounts[4]});

    await marketplace.addNewItem(3,'Garlic Naan', 'ImgHHSFG', 'DescHHSSFG',
                                 60000000000000, 40, 550, {from: accounts[4]});
    //console.log('Should be 3 ' + returnedVal.length.toString());
    await marketplace.addNewItem(4,'Car Mats', 'ImgHHSTG', 'DescHHSSTG',
                                 90000000000000, 15, 505, {from: accounts[5]});

    await marketplace.addNewItem(4,'Sturdy Tires', 'ImgHHSBG', 'DescHHSSBG',
                                 80000000000000, 5, 300, {from: accounts[5]});

    await marketplace.addNewItem(4,'Steering Protection', 'ImgHHSFG', 'DescHHSSFG',
                                 50000000000000, 10, 450, {from: accounts[5]});

    await marketplace.addNewItem(4,'Glass Lamination', 'ImgHHSFG', 'DescHHSSFG',
                                 70000000000000, 10, 150, {from: accounts[5]});

    await marketplace.addNewItem(4,'Sunroof Modify', 'ImgHHSFG', 'DescHHSSFG',
                                 60000000000000, 40, 550, {from: accounts[5]});
    //console.log('Should be 3 ' + returnedVal.length.toString());
    await marketplace.addNewItem(2,'Hockey Gear', 'ImgHHSTG', 'DescHHSSTG',
                                 90000000000000, 15, 505, {from: accounts[3]});

    await marketplace.addNewItem(2,'Snowboards', 'ImgHHSBG', 'DescHHSSBG',
                                 80000000000000, 5, 300, {from: accounts[3]});

    await marketplace.addNewItem(2,'Roller Blades', 'ImgHHSFG', 'DescHHSSFG',
                                 50000000000000, 10, 450, {from: accounts[3]});

    await marketplace.addNewItem(2,'Dumbells', 'ImgHHSFG', 'DescHHSSFG',
                                 70000000000000, 10, 150, {from: accounts[3]});

    await marketplace.addNewItem(2,'Bench Press Stuff', 'ImgHHSFG', 'DescHHSSFG',
                                 60000000000000, 40, 550, {from: accounts[3]});

    //console.log('Should be 3 ' + returnedVal.length.toString());

    /*let events = await marketplace.allEvents({address: accounts[0]});
    events.watch((error, result) => {
      if (!error)
        console.log(result);
    }); */
    //returnedVal = await marketplace.isStoreowner(accounts[5]);
    //assert.isTrue(returnedVal);
  });

  it('Should allow customer to purchase listed sku', async () => {
    let marketplace = await MarketPlace.deployed();
    console.log('Contract Balance: ' + web3.eth.getBalance(marketplace.address).toString());
    console.log('Account8 Balance: ' + web3.eth.getBalance(accounts[8]).toString());
    let skuInfo = await marketplace.getItemsBySku(22, {from: accounts[8]});
    console.log(skuInfo[0], skuInfo[1], skuInfo[2], skuInfo[3].toString(),
                skuInfo[4].toString(), skuInfo[5].toString());

    await marketplace.purchaseItem(22, 1, {from: accounts[8]}, {value: 100000000000000});
    console.log('Contract Balance: ' + web3.eth.getBalance(marketplace.address).toString());
    for (let i = 0; i < 10; i++) {
      console.log('Account'+ i + 'Balance: ' + web3.eth.getBalance(accounts[i]).toString());
    }
    //console.log('Account8 Balance: ' + web3.eth.getBalance(accounts[8]).toString());
    //console.log('Account5 Balance: ' + web3.eth.getBalance(accounts[5]).toString());
    skuInfo = await marketplace.getItemsBySku(22, {from: accounts[8]});
    console.log(skuInfo[0], skuInfo[1], skuInfo[2], skuInfo[3].toString(),
                skuInfo[4].toString(), skuInfo[5].toString());
    assert.isTrue(true);
  });

  it('Should disable item out of stock for customers', async () => {
    let marketplace = await MarketPlace.deployed();
    console.log('Contract Balance: ' + web3.eth.getBalance(marketplace.address).toString());
    console.log('Account7 Balance: ' + web3.eth.getBalance(accounts[7]).toString());
    let skuInfo = await marketplace.getItemsBySku(10, {from: accounts[7]});
    console.log(skuInfo[0], skuInfo[1], skuInfo[2], skuInfo[3].toString(),
                skuInfo[4].toString(), skuInfo[5].toString());

    await marketplace.purchaseItem(10, 1, {from: accounts[7]}, {value: 100000000000000});
    console.log('Contract Balance: ' + web3.eth.getBalance(marketplace.address).toString());
    /*for (let i = 0; i < 10; i++) {
      console.log('Account'+ i + 'Balance: ' + web3.eth.getBalance(accounts[i]).toString());
    }*/
    console.log('Account7 Balance: ' + web3.eth.getBalance(accounts[7]).toString());
    //console.log('Account5 Balance: ' + web3.eth.getBalance(accounts[5]).toString());
    skuInfo = await marketplace.getItemsBySku(10, {from: accounts[7]});
    console.log(skuInfo[0], skuInfo[1], skuInfo[2], skuInfo[3].toString(),
                skuInfo[4].toString(), skuInfo[5].toString());

    console.log('Account9 Balance: ' + web3.eth.getBalance(accounts[9]).toString());
    await marketplace.purchaseItem(10, 2, {from: accounts[9]}, {value: 100000000000000});
    console.log('Contract Balance: ' + web3.eth.getBalance(marketplace.address).toString());
    console.log('Account9 Balance: ' + web3.eth.getBalance(accounts[9]).toString());
    //item went out of stock. do not show to customer
    skuInfo = await marketplace.getItemsBySku(10, {from: accounts[8]});
    console.log(skuInfo[0], skuInfo[1], skuInfo[2], skuInfo[3].toString(),
                skuInfo[4].toString(), skuInfo[5].toString());
    //Show item to store owner
    skuInfo = await marketplace.getItemsBySku(10, {from: accounts[4]});
    console.log(skuInfo[0], skuInfo[1], skuInfo[2], skuInfo[3].toString(),
                skuInfo[4].toString(), skuInfo[5].toString());
    //
    storeInfo = await marketplace.getStoreById(3);
    console.log(storeInfo[0], storeInfo[1], storeInfo[2], storeInfo[3].toString(), storeInfo[4].toString());
    storeInfo = await marketplace.getStoreById(2);
    console.log(storeInfo[0], storeInfo[1], storeInfo[2], storeInfo[3].toString(), storeInfo[4].toString());

    assert.isTrue(true);
  });

  it('Should not allow purchase of diabled item', async () => {
    let marketplace = await MarketPlace.deployed();
    console.log('Contract Balance: ' + web3.eth.getBalance(marketplace.address).toString());
    console.log('Account7 Balance: ' + web3.eth.getBalance(accounts[7]).toString());
    await marketplace.purchaseItem(10, 2, {from: accounts[9]}, {value: 100000000000000});

  });

  it('Should allow admin to trigger payment to store owner', async () => {
    let marketplace = await MarketPlace.deployed();
    console.log('Contract Balance: ' + web3.eth.getBalance(marketplace.address).toString());
    console.log('Account4 Balance: ' + web3.eth.getBalance(accounts[4]).toString());
    storeInfo = await marketplace.getStoreById(3);
    console.log(storeInfo[0], storeInfo[1], storeInfo[2], storeInfo[3].toString(), storeInfo[4].toString());

    await marketplace.payStore(3);
    console.log('Contract Balance: ' + web3.eth.getBalance(marketplace.address).toString());
    console.log('Account4 Balance: ' + web3.eth.getBalance(accounts[4]).toString());
    storeInfo = await marketplace.getStoreById(3);
    console.log(storeInfo[0], storeInfo[1], storeInfo[2], storeInfo[3].toString(), storeInfo[4].toString());

  });

  it('Should not allow purchase when contract is paused', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.pause();
    await marketplace.purchaseItem(12, 2, {from: accounts[9]}, {value: 100000000000000});
  });

  it('Should not allow payments to storeowner when contract is paused', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.pause();
    await marketplace.payStore(2);

  });


})
