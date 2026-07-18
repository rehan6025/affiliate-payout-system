# Understanding

## What is the system ?

- This is a user payout management system designed to give users payout for their affiliate sales.
- Users can get 10 percent of the payout even before reconcillation of their sale, means even if the status is pending user can get 10 percent of the amount of their sales and withdraw it

## What are the Business rules ?

- Again first is the advance pay that the user gets even when the status of their sale is pending
- On a single sale, the advance pay must never be applied again if the user has already claimed it, or in other words, once an advance payout is successfully transferred , the same sale must never receive another advance payout
- Remaining payout must depend on status of sale after reconcillation : <br>
  On sale approved: remaining amount = total - advance pay (which is 10% of total) <br>
  On sale rejected: the advance pay that is already paid must be deducted

## What operations happen ?

- User sale comes in
- User can claim advance pay + other amount from successful sales after they are reconciled by an admin
- User can withdraw his money once every 24 hours
- Admin reconciles a sale to either approved or rejected
- On rejected , from user's current money in account or balance , the advance pay is adjusted
- On approved, the remaining pay , which is total - advance pay is credited to user account

## What can fail ?

- User may have successfully transferred advance payout money in their account, then the sale gets rejected and their current balance is zero, but it will go negative after adjustments
- User payout gets failed, then we need to again grant their access to payout again and remove them from the 24 hour long wait queue and also credit failed amount back to user's account

## Some assumptions I am making

- I think to handle rejected sales, I'll just let the user balance go negative so that if lets say user payouts all their balance and then later a sale gets rejected , their balance goes negative later user first has to get their balance in positive before payout again, so here i'm assuming the user will make future sales or still be connected with company

# Functional Requirements

- User has multiple sales
- Every new sale starts as pending
- Pending sales are eligible for a 10% advance payout
- Each sale can receive the advance once only
- Admin can approve or reject a sale
- Approved sales pay the remaining amount
- Rejected sales deduct any advance already paid
- User can withdraw only once every 24 hours
- Failed withdrawls restore the user's withdrawable balance.

# Non functional Requirements

- Idempotent advance payout job.
- Prevent duplicate withdrawls.
- Support retries for failed payouts.
