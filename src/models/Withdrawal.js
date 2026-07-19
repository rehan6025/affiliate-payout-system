export class Withdrawal {
    constructor({ id, userId, amount }) {
        this.id = id;
        this.userId = userId;
        this.amount = amount;
        this.status = "PENDING";
        this.createdAt = new Date();
    }

    markSuccess() {
        this.status = "SUCCESS";
    }

    markFailed() {
        this.status = "FAILED";
    }
}
