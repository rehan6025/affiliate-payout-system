# Affiliate Payout Management System

A backend system that simulates an affiliate payout workflow. It supports advance payouts, sale reconciliation, withdrawals, and wallet transaction tracking.

---

## Features

- Create affiliate sales
- Claim 10% advance payout
- Reconcile sales (APPROVED / REJECTED)
- Withdraw wallet balance
- 24-hour withdrawal restriction
- Refund failed withdrawals
- Wallet transaction history
- Express REST APIs
- Manual end-to-end test

---

## Tech Stack

- JavaScript (ES6)
- Node.js
- Express
- In-memory database

---

# Project Structure

```text
.
├── docs/
│   ├── requirements.md
│   ├── lld.md
│   ├── database.md
│   ├── api.md
│   ├── edge-cases.md
│   ├── tradeoffs.md
│   └── database-schema.png
│
├── src/
│   ├── data/
│   ├── models/
│   ├── services/
│   └── app.js
│
├── tests/
│   └── manualTest.js
│
├── package.json
└── README.md
```

---

# Documentation

Detailed documentation is available in the **docs** folder.

| File | Description |
|------|-------------|
| requirements.md | Functional & non-functional requirements |
| lld.md | Low-level design of services |
| database.md | Database schema and relationships |
| api.md | API documentation |
| edge-cases.md | Failure scenarios handled |
| tradeoffs.md | Design decisions and trade-offs |
| class-diagram.png | Class diagram |

---

# Running

Install dependencies

```bash
npm install
```

Start server

```bash
npm start
```

Run manual test

```bash
npm test
```

Server

```
http://localhost:5000
```

---

# Manual Test Flow

The manual test covers:

- User & Brand creation
- Sale creation
- Advance payout
- Duplicate advance prevention
- Sale approval
- Sale rejection
- Withdrawal request
- Failed withdrawal refund
- Successful withdrawal
- 24-hour withdrawal restriction

---

# Assumptions

- In-memory storage is used.
- Payment gateway is simulated.
- Authentication is out of scope.
- IDs are generated sequentially.

---

# Future Improvements

- PostgreSQL support
- Repository layer
- Authentication
- Unit tests
- Background workers
- Swagger/OpenAPI
- UUID-based IDs