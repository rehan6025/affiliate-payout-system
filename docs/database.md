# Entities

- User
- Sale
- Withdrawl
- Brand
- WalletTransaction

<br>

# Details about entities

## User

- Why does it exist ? Ans: Represents individual user and their details
- Fields : Id , balance, sales[],
- Relationships : User has sales , User creates payout

<br>

| Column     | Type      | Description                  |
| ---------- | --------- | ---------------------------- |
| id         | UUID      | Primary key                  |
| balance    | Decimal   | Current withdrawable balance |
| created_at | Timestamp | ...                          |

## Sale

- Why does this exist ? Ans: To represent every individual sale that gets listed in system
- Fields: Id, BrandName, UserId, Earning, Status, AdvancePayoutGiven
- Relationships : Not Final as of now

<br>

| Column      | Type                          | Description                               |
| ----------- | ----------------------------- | ----------------------------------------- |
| id          | UUID                          | Primary key                               |
| amount      | Decimal                       | earning or amount of sale                 |
| status      | PENDING / APPROVED / REJECTED | Current status of sale                    |
| advancePaid | Boolean                       | Whether advance pay has been taken or not |
| userId      | UUID                          | Foreign Key                               |
| brandId     | UUID                          | Foreign Key                               |

## Brand

- Why it exists? Ans: to represent brands
- Fields: Id, Name , sales[]

<br>

| Column | Type   | Description   |
| ------ | ------ | ------------- |
| id     | UUID   | Primary key   |
| name   | String | name of brand |

## Withdrawl

- Why it exists? Ans: To persist information about withdrawl which user did and their status
- Fields: Id, Amount, UserId, , Status, createdAt

<br>

| Column    | Type                       | Description                  |
| --------- | -------------------------- | ---------------------------- |
| id        | UUID                       | Primary key                  |
| amount    | Decimal                    | Amount withdrawed            |
| userId    | UUID                       | Foreign Key                  |
| status    | PENDING / SUCCESS / FAILED | Current status of withdrawal |
| createdAt | Timestamp                  | When was withdrawal done     |

## WalletTransaction

- Why it exists? Ans: To store details about every wallet transaction like why the balance changed , what caused it
- Fields: Id , user_id , sale_id(nullable), withdrawal_id(nullable), type , amount, createdAt

<br>

| Column       | Type      | Description                                                                                                  |
| ------------ | --------- | ------------------------------------------------------------------------------------------------------------ |
| id           | UUID      | Primary key                                                                                                  |
| amount       | Decimal   | Amount which was incremented or decremented                                                                  |
| type         | String    | wallet transaction types - ADVANCE_PAYOUT, FINAL_PAYOUT, REJECTION_ADJUSTMENT, WITHDRAWAL, WITHDRAWAL_REFUND |
| userId       | UUID      | Foreign key to user                                                                                          |
| saleId       | UUID      | Foreign key to sale if the sale initiated this                                                               |
| withdrawalId | UUID      | Foreign key to withdrawal if it initiated it                                                                 |
| createdAt    | Timestamp | ...                                                                                                          |
