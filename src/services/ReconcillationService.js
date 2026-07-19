import { db } from "../data/db";
import { WalletTransaction } from "../models/WalletTransaction";

class ReconcillationService {
    constructor() {}

    reconcileSale(saleId, status) {
        const sale = db.sales.find((s) => s.id === saleId);
        if (!sale) return;

        const user = db.users.find((u) => u.id === sale.userId);
        if (!user) return;

        if (status === "APPROVED") {
            const amt = sale.advancePaid ? sale.amount * 0.9 : sale.amount;

            const walledTransId = db.walletTransactions.length + 1;
            const walletTransaction = new WalletTransaction({
                id: walledTransId,
                userId: user.id,
                saleId: sale.id,
                amount: amt,
                type: "FINAL_PAYOUT",
            });
            db.walletTransactions.push(walletTransaction);
            user.credit(amt);

            sale.status = "APPROVED";
        } else {
            if (sale.advancePaid) {
                const amt = sale.amount * 0.1;
                const walledTransId = db.walletTransactions.length + 1;
                const walletTransaction = new WalletTransaction({
                    id: walledTransId,
                    userId: user.id,
                    saleId: sale.id,
                    amount: -amt,
                    type: "REJECTION_ADJUSTMENT",
                });

                db.walletTransactions.push(walletTransaction);
                user.debit(amt);
            }

            sale.status = "REJECTED";
        }
        return sale;
    }
}
