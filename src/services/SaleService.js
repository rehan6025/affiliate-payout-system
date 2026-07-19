import { db } from "../data/db.js";
import { Sale } from "../models/Sale.js";

export class SaleService {
    constructor() {}

    createSale(userId, brandId, amount) {
        let user = db.users.find((u) => u.id === userId);
        if (!user) {
            console.log("no user found");
            return;
        }

        let brand = db.brands.find((b) => b.id === brandId);
        if (!brand) {
            console.log("no brand found");
            return;
        }

        if (amount <= 0) {
            console.log("can't create sale amount less than zero");
            return;
        }
        const id = db.sales.length + 1;
        const sale = new Sale(id, userId, brandId, amount);

        db.sales.push(sale);

        return sale;
    }
}
