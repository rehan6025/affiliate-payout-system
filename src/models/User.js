export class User {
    constructor(id, balance = 0) {
        this.id = id;
        this.balance = balance;
    }

    credit(amount) {
        this.balance += amount;
    }

    debit(amount) {
        this.balance -= amount;
    }
}
