export class Sale {
    constructor(id, userId, brandId, amount) {
        this.id = id;
        this.userId = userId;
        this.brandId = brandId;
        this.amount = amount;
        this.status = "PENDING";
        this.advancePaid = false;
    }

    markApproved() {
        this.status = "APPROVED";
    }

    markRejected() {
        this.status = "REJECTED";
    }
}
