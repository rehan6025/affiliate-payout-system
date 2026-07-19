import { db } from "../data/db.js";
import { WalletTransaction } from "../models/WalletTransaction.js";

class AdvancePayoutService {
    constructor() {}

    claimAdvance(saleId) {
        const sale = db.sales.find((sale) => sale.id === saleId);
        if (!sale) {
            console.log("no sale found");
            return;
        }

        if (sale.status !== "PENDING") {
            console.log("sale already disclosed");
            return;
        }

        if (sale.advancePaid === true) {
            console.log("advance already paid");
            return;
        }
        const id = db.walletTransactions.length + 1;
        const amount = sale.amount * 0.1;
        const walletTransaction = new WalletTransaction({
            id,
            userId: sale.userId,
            saleId: sale.id,
            amount,
            type: "ADVANCE_PAYOUT",
        });
        db.walletTransactions.push(walletTransaction);

        sale.advancePaid = true;
        const user = db.users.find((u) => u.id === sale.userId);
        if (!user) {
            console.log("no user found ");
            return;
        }
        user.credit(amount);
    }
}
