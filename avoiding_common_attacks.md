Marketplace: Safety Checks
==========================

Recursive Calls / Race conditions
---------------------------------
The care is taken to update the state before making a ‘transfer’ call of a payable function. This will make sure that even if function is called recursively, the state update in previous call would reduce balance.

Cross Functional Race Condition
-------------------------------
The inter function calls are avoided to the payable functions.

Integer Arithmetic Overflow
---------------------------
The store balance is uint256 state variable and stores balance in Wei. Since this accumulates the value over time, there is a chance of overflow. The balance is updated upon successful purchase of items listed in the store. For every purchase an integer overflow check is implemented. In case the overflow is to take place, the payment to the store owner with current accumulated balance is triggered first and current balance is replaced with new purchase amount rather than accumulation.

Exposed functions
------------------
All getter functions are public and explicitly defined as ‘view’ functions. The setter functions that are public are access restricted to prevent unintended consequences.

DoS
---
Loops are avoided at most places, especially for setter and payable functions. The only place which implements payments in loops is ‘self destruct’ and that is access controlled to ‘Admin’ only. The loop there is making sure that contract pays out all pending store balances to the respective owners before destroying itself.

DoS because of Gas Limit issue
------------------------------
The loops are avoided in all setter functions. Also the items as well stores have associated hero images. That data is stored on IPFS and only IPFS hash is stored as a part of the state limiting the input length.

The getter for all stores is one function that is vulnerable to this attack still. The contract tries to limit each store owner to list only 3 stores, but it does not prevent instance where malicious store owner creates sybils. The getter for all items just returns an uint, so loops are avoided.

DoS Stack too deep issue
---------------------------
There are no contract to contract calls. The only place where this problem occurs is when returning attributes of item. To avoid this, the item attributes are split into two getter functions. The onus is on the client to ensure both functions are called to get all the attributes.

Tx.Origin problem
-----------------
There is no reliance on Tx.origin

Transaction Ordering Dependence
-------------------------------
Contract currently does not provide protection against this condition. The condition can take place where store owners changes the listing price or discount. Miner can see the transaction in transactionpool and sequence it differently to insert item purchase favorable price/discount combination.

Malicious creator
-----------------
The creator/owner has a lot of power as the store owner is not paid right away and balances have to be reviewed and paid out by Admin or Super User and control the contract balance. The only precaution in place at the moment is in the event where contract has sizable balance and owner destroys the contract. In this event, all store owners first get paid. However the contract does not stop the admin or super users from offline transferring contract balance to other accounts .

Off-chain safety
----------------
Off chain functionality is pretty basic at the moment to allow testing various scenarios and no safety standards are implemented
