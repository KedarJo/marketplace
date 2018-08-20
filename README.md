MarketPlace - Contract to support decentralized marketplace
===========================================================

**Local instance**

The project is built from React Truffle Box and inherits all node and css dependencies. The emphasis is to built UI sufficient to support use cases to test out the contract.

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
12. Start local npm server
```
npm run start
```

The default account[0] is used to deploy the contract and at the contract constructor level gets the role of owner as well as Admin. If the local server starts serving without changes to MetaMask accounts, the default login mode is admin and all admin functions should be available on the menu.  

---
