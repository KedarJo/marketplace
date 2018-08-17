import React, { Component } from 'react'
import MarketPlaceContract from '../build/contracts/MarketPlace.json'
import getWeb3 from './utils/getWeb3'

import ipfs from './ipfs'

import AdmNav from './Admin/AdmNav'
import AdmPendReq from './Admin/AdmPendReq'
import AdmDisableStores from './Admin/AdmDisableStores'
import AdmPayStore from './Admin/AdmPayStore'
import AdmAddSuper from './Admin/AdmAddSuper'
import AdmPause from './Admin/AdmPause'
import CusNav from './Customer/CusNav'
import CusItemGrid from './Customer/CusItemGrid'
import CusItemDetail from './Customer/CusItemDetail'
import CusStoreGrid from './Customer/CusStoreGrid'
import CusStoreDetail from './Customer/CusStoreDetail'
import CusRegister from './Customer/CusRegister'
import StrNav from './Storeowner/StrNav'
import StrAddStore from './Storeowner/StrAddStore'
import StrEditStore from './Storeowner/StrEditStore'
import StrStoreGrid from './Storeowner/StrStoreGrid'
import StrAddStoreItem from './Storeowner/StrAddStoreItem'
import StrEditStoreItem from './Storeowner/StrEditStoreItem'
import StrItemGrid from './Storeowner/StrItemGrid'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      admin: false,
      superuser: false,
      storeowner: false,
      web3: null,
      contract: null,
      account: null,
      contractBal: 0,
      pendAccount: [],
      storeOwners: [],
      storeOwner: null,
      stores: [],
      store: null,
      skus: [],
      sku: null,
      toggle: false,
      paused: false,
      admMenu: "ApproveRequests",
      strMenu: "BrowseMyStores",
      cusMenu: "Shop",

    }
    // Admin stories
    this.admNavCurrent = this.admNavCurrent.bind(this)
    this.getPendingRequests = this.getPendingRequests.bind(this)
    this.handleApproveReq = this.handleApproveReq.bind(this)
    this.getApprovedStoreowners = this.getApprovedStoreowners.bind(this)
    this.handleDiable = this.handleDiable.bind(this)
    this.getStores = this.getStores.bind(this)
    this.handlePayout = this.handlePayout.bind(this)
    this.handlePause = this.handlePause.bind(this)
    this.handleAddSuper = this.handleAddSuper.bind(this)
    //Customer stories
    this.cusNavCurrent = this.cusNavCurrent.bind(this)
    this.getSkus = this.getSkus.bind(this)
    this.handleCusItemClick = this.handleCusItemClick.bind(this)
    this.handleCusPurchase = this.handleCusPurchase.bind(this)
    this.getSkusByStoreID = this.getSkusByStoreID.bind(this)
    this.handleCusStoreClick = this.handleCusStoreClick.bind(this)
    this.handleRegistration = this.handleRegistration.bind(this)
    //StoreOwner Stories
    this.strNavCurrent = this.strNavCurrent.bind(this)
    this.getMyStores = this.getMyStores.bind(this)
    this.handleStrStoreClick = this.handleStrStoreClick.bind(this)
    this.handleStrAddClick = this.handleStrAddClick.bind(this)
    this.handleStrEditClick = this.handleStrEditClick.bind(this)
    this.handleStoreAdd = this.handleStoreAdd.bind(this)
    this.handleStoreEdit = this.handleStoreEdit.bind(this)
    this.handleStrItemAddClick = this.handleStrItemAddClick.bind(this)
    this.handleStrItemEditClick = this.handleStrItemEditClick.bind(this)
    this.handleStoreItemAdd = this.handleStoreItemAdd.bind(this)
    this.handleStoreItemEdit = this.handleStoreItemEdit.bind(this)

  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    //console.log('instantiateContract() ')
    const contract = require('truffle-contract')
    const marketplace = contract(MarketPlaceContract)
    marketplace.setProvider(this.state.web3.currentProvider)
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
        var result;
        // Get MarketPlace Contract Instance
        let getMarketplace = new Promise((resolve, reject) => {
          result = marketplace.deployed();
          resolve(result)
        });
        getMarketplace
         .then((result) => {
           //console.log('getMarketplace')
           this.setState({contract: result, account: accounts[0]});

           let getAdminCheck = new Promise((resolve, reject) => {
             result = this.state.contract.isAdmin(accounts[0]);
             resolve(result)
           });
           getAdminCheck
            .then((result) => {
              //console.log('getAdminCheck')
             if (result === true) {
               this.setState({admin: true,
                              superuser: false,
                              storeowner: false})

               this.getPendingRequests()
             } else {
               let getSuperCheck = new Promise((resolve, reject) => {
                 result = this.state.contract.isSuperuser(accounts[0]);
                 resolve(result)
               })
               getSuperCheck
                .then((result) => {
                    //console.log('getSuperCheck')
                    if (result === true) {
                      this.setState({admin: false,
                                     superuser: true,
                                     storeowner: false})

                      this.getPendingRequests()
                    } else {
                      let getStoreCheck = new Promise((resolve, reject) => {
                        result = this.state.contract.isStoreowner(accounts[0]);
                        resolve(result)
                      })
                      getStoreCheck
                        .then((result) => {
                          //console.log('getStoreCheck ')
                          if (result === true) {
                            //console.log('setting State ')
                            this.setState({admin: false,
                                           superuser: false,
                                           storeowner: true})
                            //console.log('state is set')
                            this.getMyStores()

                          } else {
                            this.getSkus()
                          }
                      })
                      .catch(() => {console.log('unable to check isStoreowner()')})
                    }
               })
               .catch(() => {console.log('unable to check isSuperuser()')})
             }
           })
            .catch(() => {console.log('unable to check isAdmin()')})
         })
         .catch(() => {console.log('unable to get deployed')});
    })
  }

 handleApproveReq(_account, approved){
    const contract = this.state.contract;
    //console.log(_account, approved)
    if (approved) {
        let roleAddEvent = contract.RoleAdded({'operator': _account })

        let approveReq = new Promise((resolve, reject) => {
          contract.approveStoreowner(_account, {from: this.state.account})
          resolve(true)
        })
        approveReq
        .then(() => {
          document.getElementById("txWarn").innerHTML = "Processing request! Please allow a few moments..."
          roleAddEvent.watch((error, result) => {
            if(!error) {
              console.log(_account + 'approved')
              document.getElementById("txWarn").innerHTML = ""
              this.setState({toggle: !this.state.toggle})
            }
          })
        })
        .catch((err) => {
          console.log('err: handleApproveReq > approveStoreowner')
          console.log(err)
        })

    } else {
        let roleRemovedEvent = contract.RoleRemoved({'operator': _account})
        let denyReq = new Promise((resolve, reject) => {
          contract.denyPendingRequest(_account, {from: this.state.account})
          resolve(true)
        })
        denyReq
        .then(() => {
          document.getElementById("txWarn").innerHTML = "Processing request! Please allow a few moments..."
          roleRemovedEvent.watch((error, result) => {
            if (!error) {
              //console.log(_account + 'denied')
              document.getElementById("txWarn").innerHTML = ""
              this.setState({toggle: !this.state.toggle})
            }
          })
        })
        .catch((err) => {
          console.log('err: handleApproveReq > denyPendingRequest')
          console.log(err)
        })
    }
  }

  getPendingRequests() {
    //console.log('getPendingRequests()')
    const contract = this.state.contract
    let pendAccount = []
    //var pendAccount = [...this.state.pendAccount]
    let result
    let detail

    let getPend = new Promise((resolve, reject) => {
      result = contract.getPendingRequests({from: this.state.account});
      resolve(result)
    });

    getPend
      .then((result) => {
      if (result.length === 0) {
        console.log('No pending requests')
        pendAccount = [];
      }

      for (let i = 0; i < result.length; i++) {
        let pendAccountNum = result[i]
        if (pendAccountNum !== "0x0000000000000000000000000000000000000000") {
          let getDetail = new Promise((resolve, reject) => {
            detail = contract.getStoreOwner(pendAccountNum, {from: this.state.account});
            resolve(detail)
          })

          getDetail
            .then((detail) => {
            pendAccount.push({acct: pendAccountNum,
                              busTitle: detail[0],
                              govID: detail[1],
                              numStores: detail[2]
                            })

            this.setState({pendAccount: pendAccount})
          })
            .catch((err) => {
              console.log('err: getPendingRequests>getStoreOwner> ' + pendAccountNum.toString() + ' failed')
              console.log(err)
          })

        }
      }

    })
      .catch((err) => {console.log('err: getPendingRequests failed \n' + err)})

  }

  handleDiable(account){
    const contract = this.state.contract;
    const disableStoreEvent = contract.StoreDisable({"_storeOwner": account});
    let disableOwner = new Promise((resolve, reject) => {
       contract.revokeAccess(account, {from: this.state.account})
       resolve(true)
     })
     disableOwner
     .then(() => {
       document.getElementById("txWarn").innerHTML = "Processing request! Please allow a few moments..."
       disableStoreEvent.watch((error, result) => {
         if(!error) {
           document.getElementById("txWarn").innerHTML = ""
           console.log(account + ' access as storeowner revoked')
           this.setState({toggle: !this.state.toggle})
         }
       })
     })
     .catch((err) => {
       console.log('err: handleDiable > approveStoreowner')
       console.log(err)
     })
   }

  getApprovedStoreowners() {
    //console.log('getApprovedStoreowners')
    const contract = this.state.contract
    let storeOwners = []
    let result = null
    let detail = null

    let getStoreOwners = new Promise((resolve, reject) => {
      result = contract.getApprovedStoreowners({from: this.state.account});
      resolve(result)
    });

    getStoreOwners
      .then((result) => {
      if (result.length === 0) {
        storeOwners = []
        console.log('No Approved Store Owners Found')
      }
      for (let i = 0; i < result.length; i++) {
        let storeOwner = result[i]
        if (storeOwner !== "0x0000000000000000000000000000000000000000") {
          let getDetail = new Promise((resolve, reject) => {
            detail = contract.getStoreOwner(storeOwner, {from: this.state.account});
            resolve(detail)
          })

          getDetail
            .then((detail) => {
              //console.log(detail)
            storeOwners.push({acct: storeOwner,
                              busTitle: detail[0],
                              govID: detail[1],
                              numStores: detail[2]})

            this.setState({storeOwners: storeOwners})
          })
            .catch((err) => {
              console.log('err: getApprovedStoreowners>getStoreOwner>' + storeOwner.toString() + 'failed')
              console.log(err)
          })
        }
      }

    })
      .catch((err) => {
        console.log('err: getApprovedStoreowners failed')
        console.log(err)
      })

  }

   handlePayout(_storeID){
      const contract = this.state.contract;
      const ownerPaidEvent = contract.OwnerPaid({'_storeID': _storeID });

      let storePayout = new Promise((resolve, reject) => {
        contract.payStore(_storeID, {from: this.state.account})
        resolve(true)
      })
      storePayout
      .then(() => {
        document.getElementById("txWarn").innerHTML = "Processing request! Please allow a few moments..."
        ownerPaidEvent.watch((error, result) => {
          if (!error) {
            this.setState({toggle: !this.state.toggle})

            document.getElementById("txWarn").innerHTML = ""
            this.setState({toggle: !this.state.toggle})
            console.log(_storeID + ' paid out')
          }
        })
      })
      .catch((err) => {
        console.log('err: handlePayout > payStore')
        console.log(err)
      })
    }

   getStores() {
     //console.log('getStores')
     const contract = this.state.contract
     let stores = []
     let result = null
     let detail = null

     let getStores = new Promise((resolve, reject) => {
       result = contract.getAllStores({from: this.state.account});
       resolve(result)
     });

     getStores
       .then((result) => {
       //console.log(result.length)
       if (result.length === 0) {
         stores = []
         console.log('No stores found')
       }
       for (let i = 0; i < result.length; i++) {
         let storeID = result[i]
         //console.log('storeID#' + i + storeID)

         if (storeID != 0 ) { //remove this later

         let getDetail = new Promise((resolve, reject) => {
           detail = contract.getStoreById(storeID, {from: this.state.account});
           resolve(detail)
         })

         getDetail
           .then((detail) => {
             //console.log(detail)
           stores.push({ storeID: storeID,
                         storeOwner: detail[0],
                         title: detail[1],
                         imgIPFS: detail[2],
                         storeBal: detail[3],
                         numItems: detail[4] })
           this.setState({stores: stores})
         })
           .catch((err) => {
             console.log('err: getStores>getStoreById> ' + storeID.toString() + ' failed')
             console.log(err)
           })

         } // If end // TODO: Change the smart contract logic to send skucount and check enable flag here

       }

     })
       .catch((err) => {
         console.log('err: getStores failed')
         console.log(err)
       })

   }

   handleAddSuper(_account){
     const contract = this.state.contract;
     const roleAddedEvent = contract.RoleAdded({"operator": _account})
     let addSuper = new Promise((resolve, reject) => {
       contract.addSuper(_account, {from: this.state.account})
       resolve(true)
     })
     addSuper
     .then(() => {
       document.getElementById("AddSuperuser").reset()
       document.getElementById("txWarn").innerHTML = "Processing request! Please allow a few moments..."
       roleAddedEvent.watch((error, result) => {
         document.getElementById("txWarn").innerHTML = ""
         this.setState({toggle: !this.state.toggle})
       })

     })
     .catch((err) => {
       console.log("err: handleAddSuper > addSuper " + _account)
       console.log(err)
     })

   }

   handlePause(){
    const contract = this.state.contract;
    const pauseEvent = contract.Pause();
    const unpauseEvent = contract.Unpause();
    if (this.state.paused === false) {
        let pauseContract = new Promise((resolve, reject) => {
          contract.pause({from: this.state.account})
          resolve(true)
        })
        pauseContract
        .then(() => {
          console.log('Contract Pause Requested')
          document.getElementById("txWarn").innerHTML = "Processing request! Please allow a few moments..."
          pauseEvent.watch((error, result) => {
            if(!error) {
              document.getElementById("txWarn").innerHTML = ""
              this.setState({paused: true})
              //console.log(result)
            }

          })
        })
        .catch((err) => {
          console.log('err: handleApproveReq > approveStoreowner')
          console.log(err)
        })

    } else {
        let unpauseContract = new Promise((resolve, reject) => {
          contract.unpause({from: this.state.account})
          resolve(true)
        })
        unpauseContract
        .then(() => {
          console.log('Contract UnPause Requested')
          document.getElementById("txWarn").innerHTML = "Processing request! Please allow a few moments..."
          unpauseEvent.watch((error, result) => {
            if(!error) {
              document.getElementById("txWarn").innerHTML = ""
              this.setState({paused: false})
              //console.log(result)
            }

          })
        })
        .catch((err) => {
          console.log('err: handleApproveReq > denyPendingRequest')
          console.log(err)
        })
    }
  }

  admNavCurrent(_menu) {
    //console.log('admNavCurrent ' + _menu)
    if(_menu === "ApproveRequests") {this.getPendingRequests()}
    if(_menu === "DisableStoreOwners") {this.getApprovedStoreowners()}
    if(_menu === "PayStore") {this.getStores()}

    this.state.web3.eth.getBalance(this.state.contract.address, (err, res) => {
        this.setState({contractBal: res})
        //console.log(this.state.contractBal.toString())
    })

    this.setState({admMenu: _menu})

  }

  handleCusItemClick(_sku){
    let sku = null
    const skus = this.state.skus
    //console.log(skus)
    for(let i=0; i < skus.length; i++) {
      if (skus[i].sku == _sku) {
          sku = {
            sku: _sku,
            title: skus[i].title,
            imgIPFS: skus[i].imgIPFS,
            descIPFS: skus[i].descIPFS,
            price: skus[i].price,
            discount: skus[i].discount,
            quantity: skus[i].quantity,
            storeOwner: skus[i].storeOwner,
            storeID: skus[i].storeID
          }
          break
      }
    }
    console.log(sku)
    this.setState({sku: sku, cusMenu: "ItemDetail"})
  }

  handleCusPurchase(_quantity) {
    const contract = this.state.contract
    const sku = this.state.sku
    const web3 = this.state.web3
    const purchaseItemEvent = contract.ItemPurchase({"_sku": sku.sku, "_quantity": _quantity})
    const outOfStockEvent =  contract.OutOfStock({"_sku": sku.sku, "_storeID": sku.storeID, "_storeOwner": sku.storeOwner})
    let skuTotal = _quantity * sku.price * (100 - sku.discount) / 100
    skuTotal = web3.toBigNumber(skuTotal)
    _quantity = Number(_quantity)

    let purchaseItem = new Promise((resolve, reject) => {
      contract.purchaseItem(sku.sku, _quantity, {from: this.state.account, value: skuTotal});
      resolve(true)
    });
    purchaseItem
    .then(() => {
      document.getElementById("txWarn").innerHTML = "Processing request! Please allow a few moments..."
      purchaseItemEvent.watch((error, result) => {
          if(!error) {
            document.getElementById("txWarn").innerHTML = ""
            this.setState({cusMenu: "Shop"})
          }
      })
      outOfStockEvent.watch((error, result) => {
          if(!error) {
            document.getElementById("txWarn").innerHTML = "Item went out-of-stock, order quantity was changed..."
            this.setState({cusMenu: "Shop"})
          }
      })
    })
    .catch((err) => {
      console.log('err: handleCusPurchase > purchaseItem ')
      console.log(err)
    })

  }

  getSkus() {
    const contract = this.state.contract
    let skus = []
    let result = null
    let detail = null
    let detail1 = null
    let detail2 = null

    let getItemCount = new Promise((resolve, reject) => {
      result = contract.getSkuCount({from: this.state.account});
      resolve(result)
    });

    getItemCount
      .then((result) => {

      if (result == 0) {
        skus = [];
        console.log('No items listed')
        this.setState({skus: skus})
      }
      //console.log(result.toString())
      for (let i = 0; i < result; i++) {

        let getDetail = new Promise((resolve, reject) => {
          detail1 = contract.getItemsBySku(i+1, {from: this.state.account});
          resolve(detail1)
        })

        let getDetail2 = new Promise((resolve, reject) => {
          detail2 = contract.getItemsOwner(i+1, {from: this.state.account});
          resolve(detail2)
        })

        Promise.all([getDetail, getDetail2])
          .then((detail) => {
            //console.log(detail[0])
            if (detail[0][0] != "") {
              detail1 = detail[0]
              detail2 = detail[1]

              skus.push({ sku: i+1,
                          title: detail1[0],
                          imgIPFS: detail1[1],
                          descIPFS: detail1[2],
                          price: detail1[3],
                          discount: detail1[4],
                          quantity: detail1[5],
                          storeOwner: detail2[0],
                          storeID: detail2[1]
                          })

             this.setState({skus: skus})
            }
        })
          .catch((err) => {
            console.log('err: getSkus > getItemsBySku | getItemsOwner > ' + (i+1).toString() + ' failed')
            console.log(err)
          })
      }

    })
      .catch((err) => {
        console.log('err: getSkuCount failed')
        console.log(err)
      })
  }

  getSkusByStoreID(_storeID) {
    const contract = this.state.contract
    let skus = []
    let result = null
    let detail = null
    let detail1 = null
    let detail2 = null

    let getStoreItems = new Promise((resolve, reject) => {
      result = contract.getItemsByStoreID(_storeID, {from: this.state.account});
      resolve(result)
    });

    getStoreItems
    .then((result) => {
      if (result.length === 0) {
        skus = [];
        console.log('No items listed for ' + _storeID)
        this.setState({skus: skus})
      }
      for (let i = 0; i < result.length; i++) {
        let getDetail = new Promise((resolve, reject) => {
          detail1 = contract.getItemsBySku(result[i], {from: this.state.account});
          resolve(detail1)
        })

        let getDetail2 = new Promise((resolve, reject) => {
          detail2 = contract.getItemsOwner(result[i], {from: this.state.account});
          resolve(detail2)
        })
        Promise.all([getDetail, getDetail2])
          .then((detail) => {
            //console.log('Promise.all([getDetail, getDetail2]) ')
            if (detail !== null)
              detail1 = detail[0]
              detail2 = detail[1]
              skus.push({ sku: result[i],
                          title: detail1[0],
                          imgIPFS: detail1[1],
                          descIPFS: detail1[2],
                          price: detail1[3],
                          discount: detail1[4],
                          quantity: detail1[5],
                          storeOwner: detail2[0],
                          storeID: detail2[1]
                          })
            this.setState({skus: skus, strMenu: "stateUpdate", cusMenu: 'stateUpdate'})
        })
          .catch((err) => {
            console.log('err: getSkusByStoreID > getItemsBySku | getItemsOwner > ' + result[i].toString() + ' failed')
            console.log(err)
          })
      }


    })
    .catch((err) => {
      console.log('err: getSkusByStoreID > getItemsByStoreID ' + _storeID)
      console.log(err)
    })
  }

  handleCusStoreClick(_storeID){
    //console.log('handleCusStoreClick' + _storeID)
    let store = null
    this.getSkusByStoreID(_storeID)

    window.setTimeout(()=>{
      //console.log('setTimeout')
      for(let i=0; i < this.state.stores.length; i++) {
        if (this.state.stores[i].storeID == _storeID) {
            store = {
              storeID: _storeID,
              storeOwner: this.state.stores[i].storeOwner,
              title: this.state.stores[i].title,
              imgIPFS: this.state.stores[i].imgIPFS,
              storeBal: this.state.stores[i].storeBal,
              numItems: this.state.stores[i].numItems,
            }
        }
      }
      this.setState({store: store, cusMenu: "StoreDetail"})

    }, 500)


  }

  handleRegistration(_busTitle, _govID) {
    const contract = this.state.contract

    let register = new Promise((resolve, reject) => {
      contract.registerAsStoreowner(_busTitle, _govID, {from: this.state.account});
      resolve(true)
    });

    register
    .then(() => {
      document.getElementById("CustomerRegistration").reset()
    })
    .catch(() => console.log("err: handleRegistration"))
  }

  cusNavCurrent(_menu) {
    console.log(_menu)
    this.setState({cusMenu: _menu})
    if(_menu === "Shop") {this.getSkus()}
    if(_menu === "BrowseStores") {this.getStores()}

  }

  handleStoreAdd(_strTitle, _IPFSHash) {
    //console.log('handleStoreAdd ' + _strTitle + _IPFSHash)
    const contract = this.state.contract
    const addStoreEvent = contract.StoreAdd({"_storeOwner": this.state.account})

    let addStore = new Promise((resolve, reject) => {
      contract.addNewStore(_strTitle, _IPFSHash, {from: this.state.account});
      resolve(true)
    })

    addStore
    .then(() => {
      //console.log('addStore')
      document.getElementById("txWarn").innerHTML = "Processing request! Please allow a few moments..."
      addStoreEvent.watch((error, result) => {
          if(!error) {
            this.getMyStores()
            document.getElementById("txWarn").innerHTML = ""
            this.setState({strMenu: "BrowseMyStores"})
          }
      })

    })
    .catch((err) => {
      console.log('err: handleStoreAdd > addStore failed to add ' + _strTitle)
      console.log(err.toString())
    })

  }

  handleStoreEdit(_strTitle, _IPFSHash) {
    //console.log('handleStoreEdit ' + this.state.store.storeID.toString() + _strTitle + _IPFSHash)
    const contract = this.state.contract
    const store = this.state.store
    const maintainStoreEvent = contract.StoreAdd({"_storeID": store.storeID, "_storeOwner": this.state.account})

    let editStore = new Promise((resolve, reject) => {
      contract.maintainStore(store.storeID, _strTitle, _IPFSHash, {from: this.state.account});
      resolve(true)
    })

    editStore
    .then(() => {
      //console.log('editStore')
      document.getElementById("txWarn").innerHTML = "Processing request! Please allow a few moments..."
      maintainStoreEvent.watch((error, result) => {
        if (!error) {
          document.getElementById("txWarn").innerHTML = ""
          this.getMyStores()
          this.setState({strMenu: "BrowseMyStores"})
        }
      })
    })
    .catch((err) => {
      console.log('err: handleStoreAdd > addStore failed to add ' + _strTitle)
      console.log(err)
    })

  }

  handleStrAddClick() {
    //console.log('handleStrAddClick')
    this.setState({strMenu: "storeAdd"})
  }

  handleStrEditClick(_storeID) {
    //console.log('handleStrEditClick ' + _storeID)
    let store = null
    const stores = this.state.stores
    //console.log(stores)
    for (let i=0; i < stores.length; i++) {
      if (_storeID == stores[i].storeID) {
        store = {
          storeID: _storeID,
          storeOwner: stores[i].storeOwner,
          title: stores[i].title,
          imgIPFS: stores[i].imgIPFS,
          storeBal: stores[i].storeBal,
          numItems: stores[i].numItems
        }
        break
      }


    }
    //console.log(store)
    this.setState({store: store, strMenu: "storeEdit"})
  }

  handleStrStoreClick(_storeID) {
    //event.preventDefault()
    //console.log('handleStrStoreClick' + _storeID)

    let store = null
    const stores = this.state.stores
    //console.log(stores)
    for (let i=0; i < stores.length; i++) {
      if (_storeID == stores[i].storeID) {
        store = {
          storeID: _storeID,
          storeOwner: stores[i].storeOwner,
          title: stores[i].title,
          imgIPFS: stores[i].imgIPFS,
          storeBal: stores[i].storeBal,
          numItems: stores[i].numItems
        }
        break
      }

    }
    //console.log(store.numItems.toString(), this.state.skus.length)
    this.getSkusByStoreID(_storeID)
    window.setTimeout(()=>{
      //console.log(setTimeout)
      this.setState({store: store, strMenu: "BrowseMyStoreItems"})
    }, 500)
    //console.log(store.numItems.toString(), this.state.skus.length)
    //while (this.state.skus.length <  store.numItems) {console.log('still less')}


  }

  getMyStores() {
    //console.log('getMyStores')
    const contract = this.state.contract
    let stores = []
    let resultStoreOwner = null
    let resultStores = null
    let results = null
    let storeOwner = null
    let detail = null
    //console.log('account ' + this.state.account)
    let getStoreOwnerDetail = new Promise((resolve, reject) => {
      resultStoreOwner = contract.getStoreOwner(this.state.account, {from: this.state.account});
      resolve(resultStoreOwner)
    });

    let getMyStoresInfo = new Promise((resolve, reject) => {
      resultStores = contract.getStoreByOwner(this.state.account, {from: this.state.account});
      resolve(resultStores)
    });

    Promise.all([getStoreOwnerDetail, getMyStoresInfo])
      .then((results) => {
        //console.log(results)
      resultStoreOwner = results[0]
      storeOwner = {
          busTitle: resultStoreOwner[0],
          govID: resultStoreOwner[1],
          numStores: resultStoreOwner[2]
      }
      this.setState({storeOwner: storeOwner})
      //console.log(this.state.storeOwner)

      resultStores = results[1]
      if (resultStores.length === 0) {
        stores = []
        //console.log('No stores found')
      }
      for (let i = 0; i < resultStores.length; i++) {
        let storeID = resultStores[i]
        let getDetail = new Promise((resolve, reject) => {
          detail = contract.getStoreById(storeID, {from: this.state.account});
          resolve(detail)
        })

        getDetail
          .then((detail) => {
          stores.push({ storeID: storeID,
                        storeOwner: detail[0],
                        title: detail[1],
                        imgIPFS: detail[2],
                        storeBal: detail[3],
                        numItems: detail[4] })
          this.setState({stores: stores})
        })
          .catch((err) => {
            console.log('err: getMyStores > getStoreById > ' + storeID.toString() + ' failed')
            console.log(err)
          })
      }

    })
      .catch((err) => {
        console.log('err: getMyStores > getStoreOwner or getMyStores failed')
        console.log(err)
      })

  }

  handleStoreItemAdd(_skuTitle, _skuPrice, _skuDiscount, _skuQty, _IPFSHash) {
    //console.log('handleStoreItemAdd')
    //console.log(_skuTitle + '@' + _skuPrice + '%off' + _skuDiscount + 'Qty ' + _skuQty)
    //console.log('IPFS ' + _IPFSHash)

    const contract = this.state.contract
    const addItemEvent = contract.ItemAdd({"_storeID": this.state.store.storeID, "_storeOwner": this.state.account})

    let addItem = new Promise((resolve, reject) => {
      contract.addNewItem(this.state.store.storeID,
                          _skuTitle,
                          _IPFSHash,
                          "",
                          _skuPrice,
                          _skuDiscount,
                          _skuQty,
                          {from: this.state.account});
      resolve(true)
    })

    addItem
    .then(() => {
      //console.log('addItem')
      document.getElementById("txWarn").innerHTML = "Processing request! Please allow a few moments..."
      addItemEvent.watch((error, result) => {
          if(!error) {
            document.getElementById("txWarn").innerHTML = ""
            this.handleStrStoreClick(this.state.store.storeID)
          }
      })

    })
    .catch((err) => {
      console.log('err: handleStoreItemAdd > addItem failed to add ' + _skuTitle)
      console.log(err.toString())
    })
  }

  handleStoreItemEdit(_sku, _skuTitle, _skuPrice, _skuDiscount, _skuQty, _IPFSHash) {
    //console.log('handleStoreItemEdit')
    //console.log(_sku + _skuTitle + '@' + _skuPrice + '%off' + _skuDiscount + 'Qty ' + _skuQty)
    //console.log('IPFS ' + _IPFSHash)

    const contract = this.state.contract
    const maintainItemEvent = contract.ItemMaintain({"_sku": _sku, "_storeOwner": this.state.account})

    let editItem = new Promise((resolve, reject) => {
      contract.maintainItem(_sku,
                            _skuTitle,
                            _IPFSHash,
                            "",
                            _skuPrice,
                            _skuDiscount,
                            _skuQty,
                            {from: this.state.account});
      resolve(true)
    })
    editItem
    .then(() => {
      //console.log('editItem')
      document.getElementById("txWarn").innerHTML = "Processing request! Please allow a few moments..."
      maintainItemEvent.watch((error, result) => {
        if (!error) {
          document.getElementById("txWarn").innerHTML = ""
          this.handleStrStoreClick(this.state.store.storeID)
        }
      })
    })
    .catch((err) => {
      console.log('err: handleStoreItemAdd > addItem failed to add ' + _skuTitle)
      console.log(err.toString())
    })

  }


  handleStrItemAddClick() {
    //console.log('handleStrItemAddClick')
    this.setState({strMenu: "storeItemAdd"})
  }

  handleStrItemEditClick(_sku) {
    //console.log('handleStrItemEditClick ' + _sku)
    let sku = null
    const skus = this.state.skus
    //console.log(skus)
    for (let i=0; i < skus.length; i++) {

      if (_sku == skus[i].sku) {
        sku = {
          sku: _sku,
          storeOwner: skus[i].storeOwner,
          title: skus[i].title,
          storeID: skus[i].storeID,
          imgIPFS: skus[i].imgIPFS,
          descIPFS: skus[i].descIPFS,
          price: skus[i].price,
          discount: skus[i].discount,
          quantity: skus[i].quantity
        }
        break
      }


    }
    //console.log(sku)
    this.setState({sku: sku, strMenu: "storeItemEdit"})
  }


  strNavCurrent(_menu) {
    //console.log(_menu)

    if(_menu === "BrowseMyStores") {this.getMyStores()}
    this.setState({strMenu: _menu})
  }

  render() {
    //console.log('render() ')
    return (
      <div className="App">
        <header >
         {this.state.admin || this.state.superuser
           ? <AdmNav admin={this.state.admin} setCurrent={this.admNavCurrent}/>
           : <p></p>
         }

         {this.state.storeowner
           ? <StrNav setCurrent={this.strNavCurrent}/>
           : <p></p>
         }

         {!(this.state.admin || this.state.superuser || this.state.storeowner)
           ? <CusNav setCurrent={this.cusNavCurrent}/>
           : <p></p>
         }
         </header>
         <main className="container">
           <div className="pure-g">
             <div className="pure-u-1-1">
              <h1>Marketplace</h1>
             </div>
             <div className="pure-u-1-1">
             {this.state.paused
               ? <span>The contract operations are currently suspended. Payment functions will be disabled</span>
               : <span></span>
             }
             <span>{this.state.account} visiting as
             {this.state.admin
               ? " Admin"
               :  this.state.superuser
                  ? " Superuser"
                  : this.state.storeowner
                    ? " Store Owner"
                    : " Customer"}
             </span><br/>
             <span id="txWarn"></span><br/>

              {(this.state.admin || this.state.superuser) && this.state.admMenu === "ApproveRequests"
                ? <AdmPendReq
                  pendAccount={this.state.pendAccount}
                  action={this.handleApproveReq} />
                : <p></p>
              }

              {(this.state.admin || this.state.superuser) && this.state.admMenu === "DisableStoreOwners"
                ? <AdmDisableStores
                  storeOwners={this.state.storeOwners}
                  action={this.handleDiable} />
                : <p></p>
              }

              {(this.state.admin || this.state.superuser) && this.state.admMenu === "PayStore"
                ? <AdmPayStore
                  contractBal={this.state.contractBal}
                  stores={this.state.stores}
                  action={this.handlePayout} />
                : <p></p>
              }

              {this.state.admin && this.state.admMenu === "AddSuperuser"
                ? <AdmAddSuper
                  action={this.handleAddSuper} />
                : <p></p>
              }

              {this.state.admin && this.state.admMenu === "PauseOperation"
                ? <AdmPause
                  paused={this.state.paused}
                  action={this.handlePause} />
                : <p></p>
              }

              {this.state.storeowner && this.state.strMenu === "BrowseMyStores"
                ? <StrStoreGrid
                  storeOwner={this.state.storeOwner}
                  stores={this.state.stores}
                  action={this.handleStrStoreClick}
                  actionAdd={this.handleStrAddClick}
                  actionEdit={this.handleStrEditClick} />
                : <p></p>
              }

              {this.state.storeowner && this.state.strMenu === "storeAdd"
                ? <StrAddStore
                  action={this.handleStoreAdd} />
                : <p></p>
              }

              {this.state.storeowner && this.state.strMenu === "storeEdit"
                ? <StrEditStore
                  store={this.state.store}
                  action={this.handleStoreEdit} />
                : <p></p>
              }

              {this.state.storeowner && this.state.strMenu === "BrowseMyStoreItems"
                ? <StrItemGrid
                  storeOwner={this.state.storeOwner}
                  store={this.state.store}
                  skus={this.state.skus}
                  actionAdd={this.handleStrItemAddClick}
                  actionEdit={this.handleStrItemEditClick} />
                : <p></p>
              }

              {this.state.storeowner && this.state.strMenu === "storeItemAdd"
                ? <StrAddStoreItem
                  storeOwner={this.state.storeOwner}
                  store={this.state.store}
                  action={this.handleStoreItemAdd} />
                : <p></p>
              }

              {this.state.storeowner && this.state.strMenu === "storeItemEdit"
                ? <StrEditStoreItem
                  storeOwner={this.state.storeOwner}
                  store={this.state.store}
                  sku={this.state.sku}
                  action={this.handleStoreItemEdit} />
                : <p></p>
              }


              {this.state.cusMenu === "Shop"
                ? <CusItemGrid
                  skus={this.state.skus}
                  action={this.handleCusItemClick} />
                : <p></p>
              }

              {this.state.cusMenu === "ItemDetail"
                ? <CusItemDetail
                  sku={this.state.sku}
                  action={this.handleCusPurchase} />
                : <p></p>
              }

              {this.state.cusMenu === "BrowseStores"
                ? <CusStoreGrid
                  stores={this.state.stores}
                  action={this.handleCusStoreClick} />
                : <p></p>
              }

              {this.state.cusMenu === "StoreDetail"
                ? <CusStoreDetail
                  store={this.state.store}
                  skus={this.state.skus}
                  handleCusItemClick={this.handleCusItemClick} />
                : <p></p>
              }

              {this.state.cusMenu === "RegisterAsStoreowner"
                ? <CusRegister
                  action={this.handleRegistration} />
                : <p></p>
              }
             </div>
           </div>
         </main>
      </div>

    );
  }
}

export default App
