import { db } from "../src/data/db.js";
import { User } from "../src/models/User.js";
import { Brand } from "../src/models/Brand.js";
import { SaleService } from "../src/services/SaleService.js";
import { AdvancePayoutService } from "../src/services/AdvancePayoutService.js";
import { ReconcillationService } from "../src/services/ReconcillationService.js";
import { WithdrawalService } from "../src/services/WithdrawalService.js";

function printState(title) {
    console.log("\n==================================================");
    console.log(` STATE: ${title}`);
    console.log("==================================================");
    console.log("Users:", JSON.stringify(db.users, null, 2));
    console.log("Sales:", JSON.stringify(db.sales, null, 2));
    console.log("Withdrawals:", JSON.stringify(db.withdrawals, null, 2));
    console.log("Wallet Transactions:", JSON.stringify(db.walletTransactions, null, 2));
    console.log("==================================================\n");
}

console.log("Starting Manual Affiliate Payout System Test...\n");

// 1. Create a user & brand.
console.log("Step 1: Creating a user and a brand...");
const user = new User(1, 0); // user with ID 1, starting balance 0
const brand = new Brand("Google DeepMind", 1); // brand name, ID 1
db.users.push(user);
db.brands.push(brand);
printState("After User & Brand Creation");

// 2. Create a sale.
console.log("Step 2: Creating a sale of 500 for the user...");
const saleService = new SaleService();
const sale1 = saleService.createSale(1, 1, 500); // userId=1, brandId=1, amount=500
printState("After Sale 1 Creation");

// 3. Claim advance twice (2nd should fail).
console.log("Step 3: Claiming advance payout for Sale 1 (First attempt)...");
const advanceService = new AdvancePayoutService();
advanceService.claimAdvance(sale1.id);
console.log("Current user balance:", user.balance); // should be 50

console.log("\nStep 3 (Retry): Claiming advance payout for Sale 1 again (Second attempt - should fail)...");
advanceService.claimAdvance(sale1.id);
printState("After Claiming Advance (Twice)");

// 4. Approve sale.
console.log("Step 4: Approving Sale 1 (Reconciliation)...");
const reconciliationService = new ReconcillationService();
reconciliationService.reconcileSale(sale1.id, "APPROVED");
console.log("Current user balance after approval:", user.balance); // should be 500 (50 advance + 450 final)
printState("After Sale 1 Approval");

// 5. Create another sale.
console.log("Step 5: Creating another sale of 1000...");
const sale2 = saleService.createSale(1, 1, 1000); // userId=1, brandId=1, amount=1000
printState("After Sale 2 Creation");

// 6. Reject sale after advance.
console.log("Step 6a: Claiming advance on Sale 2 first...");
advanceService.claimAdvance(sale2.id);
console.log("User balance after Sale 2 advance:", user.balance); // should be 500 + 100 = 600

console.log("\nStep 6b: Rejecting Sale 2 after advance payout (should deduct the advance amount)...");
reconciliationService.reconcileSale(sale2.id, "REJECTED");
console.log("User balance after Sale 2 rejection:", user.balance); // should be 600 - 100 = 500
printState("After Sale 2 Rejection");

// 7. Request withdrawal (Simulating Failure first).
console.log("Step 7: Requesting a withdrawal of 200...");
const withdrawalService = new WithdrawalService();
const withdrawal1 = withdrawalService.requestWithdrawal(1, 200);
console.log("User balance after requesting withdrawal:", user.balance); // should be 500 - 200 = 300
printState("After Requesting Withdrawal 1");

// 8. Simulate failure.
console.log("Step 8: Simulating withdrawal FAILURE (should refund the money and set status to FAILED)...");
withdrawalService.handlePaymentResult(withdrawal1.id, "FAILURE");
console.log("User balance after withdrawal failure refund:", user.balance); // should be 300 + 200 = 500
printState("After Simulating Withdrawal 1 Failure");

// 9. Simulate success.
console.log("Step 9a: Requesting withdrawal again (Amount: 300) since previous one failed...");
const withdrawal2 = withdrawalService.requestWithdrawal(1, 300);
console.log("User balance after requesting withdrawal 2:", user.balance); // should be 500 - 300 = 200

console.log("\nStep 9b: Simulating withdrawal SUCCESS (should set status to SUCCESS)...");
withdrawalService.handlePaymentResult(withdrawal2.id, "SUCCESS");
console.log("User balance after successful withdrawal:", user.balance); // should remain 200
printState("Final State (After Simulating Withdrawal 2 Success)");

// 10. Attempt another withdrawal immediately (should fail due to 24-hour limit)
console.log("\nStep 10: Requesting a third withdrawal of 50 immediately after a successful one (should fail due to 24-hour limit)...");
const withdrawal3 = withdrawalService.requestWithdrawal(1, 50);
if (!withdrawal3) {
    console.log("Withdrawal correctly blocked as expected.");
} else {
    console.log("Error: Withdrawal was NOT blocked!", withdrawal3);
}
printState("Final State (After Attempting Blocked Withdrawal)");

console.log("Manual Test Run Completed successfully!");
