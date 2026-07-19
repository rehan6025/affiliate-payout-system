import { db } from "../data/db.js";
import { Withdrawal } from "../models/Withdrawal.js";
import { WalletTransaction } from "../models/WalletTransaction";

class WithdrawalService {
    constructor() {}

    requestWithdrawal(userId, amount) {
        // user check , then balance check, then last transaction check
        const user = db.users.find((u) => u.id === userId);
        if (!user) {
            console.log("no user found");
            return;
        }

        if (user.balance < amount) {
            console.log("insufficient balance");
            return;
        }

        const lastWithdrawal = db.withdrawals
            .filter((w) => w.userId === userId && w.status === "SUCCESS")
            .sort((a, b) => b.createdAt - a.createdAt)[0];

        if (
            lastWithdrawal &&
            Date.now() - lastWithdrawal.createdAt.getTime() <
                24 * 60 * 60 * 1000
        ) {
            console.log("Last withdrawal made within 24 hours, try later");
            return;
        }

        const withdrawalId = db.withdrawals.length + 1;
        const withdrawal = new Withdrawal({
            id: withdrawalId,
            userId: user.id,
            amount,
        });

        db.withdrawals.push(withdrawal);

        user.debit(amount);

        const id = db.walletTransactions.length + 1;
        const walletTransaction = new WalletTransaction({
            id,
            userId: user.id,
            withdrawalId: withdrawalId,
            amount,
            type: "WITHDRAWAL",
        });

        db.walletTransactions.push(walletTransaction);

        return withdrawal;
    }

    handlePaymentResult(withdrawalId, result) {
        const withdrawal = db.withdrawals.find((w) => w.id === withdrawalId);
        if (!withdrawal) {
            console.log("no withdrawal found");
            return;
        }
        const user = db.users.find((u) => u.id === withdrawal.userId);

        if (result === "SUCCESS") {
            withdrawal.markSuccess();
        } else {
            //refund user money& also allow to user to again trigger a withdrawal
            user.credit(withdrawal.amount);
            withdrawal.markFailed();
        }

        return withdrawal;
    }
}
