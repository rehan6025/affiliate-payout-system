export class WalletTransaction {
    constructor({ id, userId, saleId = null, withdrawalId = null, amount, type }) {
        this.id = id;
        this.userId = userId;
        this.saleId = saleId;
        this.withdrawalId = withdrawalId;
        this.amount = amount;
        this.type = type;
    }
}
