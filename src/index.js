import express from "express";
import { db } from "./data/db.js";
import { User } from "./models/User.js";
import { Brand } from "./models/Brand.js";
import { SaleService } from "./services/SaleService.js";
import { AdvancePayoutService } from "./services/AdvancePayoutService.js";
import { ReconcillationService } from "./services/ReconcillationService.js";
import { WithdrawalService } from "./services/WithdrawalService.js";

const app = express();
app.use(express.json());

// Seed default user and brand for testing
db.users.push(new User(1, 0));
db.brands.push(new Brand("Test Brand", 1));

const saleService = new SaleService();
const advanceService = new AdvancePayoutService();
const reconcileService = new ReconcillationService();
const withdrawalService = new WithdrawalService();

// Helper endpoint to check db state
app.get("/db", (req, res) => {
    res.json(db);
});

// POST /sales
app.post("/sales", (req, res) => {
    const { userId, brandId, amount } = req.body;
    if (userId === undefined || brandId === undefined || amount === undefined) {
        return res.status(400).json({ error: "userId, brandId, and amount are required" });
    }
    if (isNaN(amount) || Number(amount) <= 0) {
        return res.status(400).json({ error: "amount must be a positive number" });
    }
    const sale = saleService.createSale(Number(userId), Number(brandId), Number(amount));
    if (!sale) {
        return res.status(400).json({ error: "Failed to create sale. Check if userId and brandId exist." });
    }
    res.status(201).json(sale);
});

// POST /sales/:saleId/advance
app.post("/sales/:saleId/advance", (req, res) => {
    const saleId = Number(req.params.saleId);
    if (isNaN(saleId)) {
        return res.status(400).json({ error: "saleId must be a number" });
    }
    const sale = db.sales.find((s) => s.id === saleId);
    if (!sale) {
        return res.status(404).json({ error: "Sale not found" });
    }
    if (sale.status !== "PENDING") {
        return res.status(400).json({ error: "Sale already reconciled" });
    }
    if (sale.advancePaid) {
        return res.status(400).json({ error: "Advance already paid" });
    }

    advanceService.claimAdvance(saleId);

    // Verify if advance was paid by checking the updated status
    if (sale.advancePaid) {
        res.status(200).json({ message: "Advance payout claimed successfully", sale });
    } else {
        res.status(400).json({ error: "Advance payout claim failed" });
    }
});

// POST /sales/:saleId/reconcile
app.post("/sales/:saleId/reconcile", (req, res) => {
    const saleId = Number(req.params.saleId);
    const { status } = req.body;
    if (isNaN(saleId)) {
        return res.status(400).json({ error: "saleId must be a number" });
    }
    if (status !== "APPROVED" && status !== "REJECTED") {
        return res.status(400).json({ error: "status must be APPROVED or REJECTED" });
    }
    const sale = db.sales.find((s) => s.id === saleId);
    if (!sale) {
        return res.status(404).json({ error: "Sale not found" });
    }

    const updatedSale = reconcileService.reconcileSale(saleId, status);
    if (!updatedSale) {
        return res.status(400).json({ error: "Reconciliation failed" });
    }
    res.status(200).json(updatedSale);
});

// POST /withdrawals
app.post("/withdrawals", (req, res) => {
    const { userId, amount } = req.body;
    if (userId === undefined || amount === undefined) {
        return res.status(400).json({ error: "userId and amount are required" });
    }
    if (isNaN(amount) || Number(amount) <= 0) {
        return res.status(400).json({ error: "amount must be a positive number" });
    }

    const user = db.users.find((u) => u.id === Number(userId));
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    if (user.balance < Number(amount)) {
        return res.status(400).json({ error: "Insufficient balance" });
    }

    const withdrawal = withdrawalService.requestWithdrawal(Number(userId), Number(amount));
    if (!withdrawal) {
        return res.status(400).json({ error: "Withdrawal request failed. Check if user is on 24 hour cooling period." });
    }
    res.status(201).json(withdrawal);
});

// POST /withdrawals/:withdrawalId/result
app.post("/withdrawals/:withdrawalId/result", (req, res) => {
    const withdrawalId = Number(req.params.withdrawalId);
    const paymentResult = req.body.result || req.body.status;
    if (isNaN(withdrawalId)) {
        return res.status(400).json({ error: "withdrawalId must be a number" });
    }
    if (paymentResult !== "SUCCESS" && paymentResult !== "FAILURE") {
        return res.status(400).json({ error: "result/status must be SUCCESS or FAILURE" });
    }

    const withdrawal = db.withdrawals.find((w) => w.id === withdrawalId);
    if (!withdrawal) {
        return res.status(404).json({ error: "Withdrawal not found" });
    }

    const updatedWithdrawal = withdrawalService.handlePaymentResult(withdrawalId, paymentResult);
    if (!updatedWithdrawal) {
        return res.status(400).json({ error: "Failed to process payment result" });
    }
    res.status(200).json(updatedWithdrawal);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
export default app;
