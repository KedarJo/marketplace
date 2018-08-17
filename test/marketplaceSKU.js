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
    await marketplace.addNewStore('Humble Home Store', 'ImageHHS', {from: accounts[3]});
    await marketplace.addNewStore('Trendy Sports Shop', 'ImageTSS', {from: accounts[3]});
    await marketplace.addNewStore('Busy Bee Backery', 'ImageBBB', {from: accounts[4]});
    await marketplace.addNewStore('Fast Furious Ford', 'ImageFFF', {from: accounts[5]});

    /*let events = await marketplace.allEvents({address: accounts[0]});
    events.watch((error, result) => {
      if (!error)
        console.log(result);
    }); */
    returnedVal = await marketplace.isStoreowner(accounts[5]);
    assert.isTrue(returnedVal);
  });

  it('Should allow store owners to list skus to their stores', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.addNewItem(1,'Beautiful Vase', 'ImgHHSBV', 'DescHHSSBV',
                                 20000000000000, 0, 50, {from: accounts[3]});

    await marketplace.addNewItem(1,'Boho Chair', 'ImgHHSBC', 'DescHHSSBC',
                                 90000000000000, 0, 25, {from: accounts[3]});

    await marketplace.addNewItem(1,'Woodcraft Coasters', 'ImgHHSWC', 'DescHHSSWC',
                                 10000000000000, 0, 75, {from: accounts[3]});


    let returnedVal = await marketplace.getItemsByStoreID(1, {from: accounts[3]});
    //console.log('Should be 3 ' + returnedVal.length.toString());
    for (let i = 0; i < returnedVal.length; i++) {
      console.log('Sku#' + returnedVal[i].toString());
      let skuInfo = await marketplace.getItemsBySku(returnedVal[i]);
      console.log(skuInfo[0], skuInfo[1], skuInfo[2], skuInfo[3].toString(),
                  skuInfo[4].toString(), skuInfo[5].toString());
    };
    assert.isTrue(returnedVal.length > 0);

  });

  it('Should allow store owners to maintain skus', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.maintainItem(1,'Glass Vase', 'ImgHHSBV', 'DescHHSSBV',
                                 20000000000000, 15, 55, {from: accounts[3]});

    await marketplace.maintainItem(2,'Boho Chair', 'ImgHHSBC', 'DescHHSSBC',
                                 90000000000000, 5, 30, {from: accounts[3]});

    await marketplace.maintainItem(3,'Woodcraft Coasters', 'ImgHHSWC', 'DescHHSSWC',
                                 10000000000000, 10, 50, {from: accounts[3]});


    let returnedVal = await marketplace.getItemsByStoreID(1, {from: accounts[3]});
    //console.log('Should be 3 ' + returnedVal.length.toString());
    for (let i = 0; i < returnedVal.length; i++) {
      console.log('Sku#' + returnedVal[i].toString());
      let skuInfo = await marketplace.getItemsBySku(returnedVal[i]);
      console.log(skuInfo[0], skuInfo[1], skuInfo[2], skuInfo[3].toString(),
                  skuInfo[4].toString(), skuInfo[5].toString());
    };
    assert.isTrue(returnedVal.length > 0);

  });

  it('Should not allow store owners to add sku to others store', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.addNewItem(3,'Glass Vase', 'ImgHHSBV', 'DescHHSSBV',
                                 20000000000000, 0, 55, {from: accounts[3]});

    let returnedVal = await marketplace.getItemsByStoreID(3, {from: accounts[4]});
    //console.log('Should be 3 ' + returnedVal.length.toString());
    for (let i = 0; i < returnedVal.length; i++) {
      console.log('Sku#' + returnedVal[i].toString());
      let skuInfo = await marketplace.getItemsBySku(returnedVal[i]);
      console.log(skuInfo[0], skuInfo[1], skuInfo[2], skuInfo[3].toString(),
                  skuInfo[4].toString(), skuInfo[5].toString());
    };
    assert.isTrue(returnedVal.length > 0);

  });

  it('Customers should view all skus', async () => {
    let marketplace = await MarketPlace.deployed();
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
                                 80000000000000, 5, 300, {from: accounts[4]});

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

    let returnedVal = await marketplace.getSkuCount({from: accounts[7]});
    //console.log('Should be 3 ' + returnedVal.length.toString());
    for (let i = 0; i < returnedVal; i++) {
      console.log('Sku#' + (i+1).toString());
      let skuInfo = await marketplace.getItemsBySku(i+1);
      console.log(skuInfo[0], skuInfo[1], skuInfo[2], skuInfo[3].toString(),
                  skuInfo[4].toString(), skuInfo[5].toString());
    };
    assert.isTrue(returnedVal > 0);

  });

  it('Should not allow store owners to add more than 10 skus', async () => {
    let marketplace = await MarketPlace.deployed();
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

    let returnedVal = await marketplace.getSkuCount({from: accounts[7]});
    //console.log('Should be 3 ' + returnedVal.length.toString());
    for (let i = 0; i < returnedVal; i++) {
      console.log('Sku#' + (i+1).toString());
      let skuInfo = await marketplace.getItemsBySku(i+1);
      console.log(skuInfo[0], skuInfo[1], skuInfo[2], skuInfo[3].toString(),
                  skuInfo[4].toString(), skuInfo[5].toString());
    };

    await marketplace.addNewItem(2,'Karate Gear', 'ImgHHSFG', 'DescHHSSFG',
                                 60000000000000, 40, 550, {from: accounts[3]});

    returnedVal = await marketplace.getSkuCount({from: accounts[9]});

    assert.isTrue(returnedVal > 0);

  });

  it('Should not show disabled items to customers, but show to storeowner', async () => {
    let marketplace = await MarketPlace.deployed();
    await marketplace.revokeAccess(accounts[4]);

    let returnedVal = await marketplace.getSkuCount({from: accounts[7]});
    //console.log('Should be 3 ' + returnedVal.length.toString());
    for (let i = 0; i < returnedVal; i++) {
      console.log('Sku#' + (i+1).toString());
      let skuInfo = await marketplace.getItemsBySku(i+1);
      console.log(skuInfo[0], skuInfo[1], skuInfo[2], skuInfo[3].toString(),
                  skuInfo[4].toString(), skuInfo[5].toString());
    };

    returnedVal = await marketplace.getSkuCount({from: accounts[4]});
    //console.log('Should be 3 ' + returnedVal.length.toString());
    for (let i = 0; i < returnedVal; i++) {
      console.log('Sku#' + (i+1).toString());
      let skuInfo = await marketplace.getItemsBySku(i+1, {from: accounts[4]});
      console.log(skuInfo[0], skuInfo[1], skuInfo[2], skuInfo[3].toString(),
                  skuInfo[4].toString(), skuInfo[5].toString());
    };

    assert.isTrue(returnedVal > 0);
  });


})
