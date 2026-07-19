## SaleService

Responsibilities

---

- create sale
- validate user and brand
- set default status to pending

Methods

---

- createSale(userId, brandId, amount)
- getSaleById(saleId)

## AdvancePayoutService

Responsibilities

---

- Give advance payout
- Prevent duplicate advance
- Create wallet transaction
- Update user balance

Methods

---

- claimAdvance(saleId)

## WithdrawalService

Responsibilities

---

- Give withdrawal
- Check if no other withdrawal was made in past 24 hours
- Create wallet transaction
- Pass to payment gateway
- handle result of payment gateway
- update user balance

Methods

---

- requestWithdrawal(userId, amount)
- handlePaymentResult(withdrawalId, status)

## ReconcillationService

Responsibilities

---

- Update status of sale to approved or rejected
- Create Wallet Transaction , final payout or rejection adjustment
- Update user balance

Methods

---

- reconcileSale(saleId, status)

## UserService

Responsibilities

---

- Handle user profile info

Methods

---

- getBalance(userId)
