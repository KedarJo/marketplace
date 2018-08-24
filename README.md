MarketPlace - Contract to support decentralized marketplace
===========================================================

Please refer to the [Wiki](https://github.com/KedarJo/marketplace/wiki) for supported use cases

**Local instance**

The project is built from React Truffle Box and inherits all node and css dependencies. The emphasis is to built UI sufficient to support use cases to test out the contract. Works best with Chrome.

1. Build a new project folder for MarketPlace
2. Download the React Truffle Box: [React Box](https://truffleframework.com/boxes/react)
3. This also has instruction for Truffle installation (if required) and unboxing
4. Remove the base Storage contract and the associated test solidity files
5. Clone this repository into a temp repository
```
$ git clone https://github.com/KedarJo/marketplace
```
6. Merge this temp folder with MarketPlace folder and
7. Follow instructions at [IPFS Docs](https://docs.ipfs.io/introduction/usage/) to install ipfs
8. Initialize IPFS node
```
$ ipfs init
```  
9. Install [Ganache-CLI](https://github.com/trufflesuite/ganache-cli) if already not installed
10. Start local blockchain with ganache-cli
```
$ ganache-cli or $ ganache-cli -seed "your seed phrase"
```
11. Compile and migrate using Truffle
```
$ truffle compile
$ truffle migrate or truffle migrate --reset
```
12. Execute tests as follows
```
$ truffle test test/marketplaceRBAC.js
$ truffle test test/marketplaceStoreOwner.js
$ truffle test test/marketplaceSKU.js
$ truffle test test/marketplacePurchase.js

```
Test files have description of what they test. Certain tests are designed to fail with VM Exceptions. On Certain tests the asserts are merely to conclude the test. Results are console-logged and indicate the expected behavior.

Running a local instance
------------------------

Start local npm server to access contract with React GUI
```
$ npm run start
```

The default account[0] is used to deploy the contract and at the contract constructor level gets the role of owner as well as Admin. If the local server starts serving without changes to MetaMask accounts, the default login mode is admin and all admin functions should be available on the menu.  

---

Hosting completely from IPFS
----------------------------

A couple of things to be taken care of  

1. Default Webpack optimizer uses UglifyJsPlugin that does not support ES6 and build script fails when parsing ipfs-api use of arrow function, since they are introduced with ES6. For now, we will have to disable minification by commenting out below lines in "config/webpack.config.prod.js". (The right way to do this is to find solution to override UglifyJsPlugin)
```
new webpack.optimize.UglifyJsPlugin({
...
...
..
})
```

2. Modify package.json to add homepage before dependencies
```
"homepage": "./",
```

3. Create application build. A successful build is created in build_webpack
```
$ npm run build
```

4. Let's make sure ipfs daemon is running on one tab
```
$ ipfs daemon
```

5. Now let's add to ipfs by running following commands in sequence
```
$ ipfs swarm peers
$ ipfs add -r build_webpack/
$ ipfs name publish <ipfs hash of build_webpack>
```

6. Once the publish is successful (usually takes a few secs) access application https://gateway.ipfs.io/ipfs/ <ipfs hash of build_webpack>


---

Note: WIP for deploying to Rinkeby.  This file will be updated as this is made available.

---
