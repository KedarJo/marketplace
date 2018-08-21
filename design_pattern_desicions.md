MarketPlace: Implemented Design Patterns
========================================

Role based access control (Restricted access)
---------------------------------------------
The contract MarketRBAC inherits from Open Zeppelin’s implementation of Roles library and Role Based Access Control (RBAC) contract. This allows to define unique roles - Admin, Superuser and  Store Owner. The is<Role> functionality (such as isAdmin)  and only<Role> modifiers (such as onlyAdmin or onlyAdminOrSuperuser) are then used to control individual market contract functions access.

Fail Early / Fail Loudly
------------------------
Most of the function access is controlled with appropriate modifiers and will cause the EVM failure code. Beyond the role based access, additional require functions are used to ensure specific condition is met such as while processing the Item purchase request, the amount specified in msg.value is at least as much as the (discounted price X quantity specified).  

Pull over push store payments
-----------------------------
Customer makes a payment for the items purchased. In case of excess amount, the change is returned to the customer address, however at the time of payment, store owner is not simultaneously paid. The marketplace contract gets paid instead. The store owner payments are pulled when the Admin or Super user review and approve those. Overall payment function is thus split in two distinct steps in the life cycle.

Circuit Breaker
---------------
Implements Open Zeppelin’s Pause / Unpause functionality. This is only admin controlled. The ‘Pause’ mode will cause all payment functions (item purchase and store payment) to fail.
 
