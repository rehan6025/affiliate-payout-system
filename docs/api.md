| Method   | Endpoint                            | Request Body                                             | Purpose                                                                     |
| -------- | ----------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------- |
| **POST** | `/sales`                            | `{ "userId": 1, "brandId": 1, "amount": 1000 }`          | Creates a new pending sale.                                                 |
| **POST** | `/sales/:saleId/advance`            | None                                                     | Claims a 10% advance payout for a pending sale.                             |
| **POST** | `/sales/:saleId/reconcile`          | `{ "status": "APPROVED" }` or `{ "status": "REJECTED" }` | Reconciles the sale and performs the final payout or advance recovery.      |
| **POST** | `/withdrawals`                      | `{ "userId": 1, "amount": 500 }`                         | Creates a withdrawal request after validating balance and the 24-hour rule. |
| **POST** | `/withdrawals/:withdrawalId/result` | `{ "result": "SUCCESS" }` or `{ "result": "FAILURE" }`   | Simulates the payment gateway response and updates the withdrawal status.   |
| **GET**  | `/db`                               | None                                                     | Returns the current in-memory database state for debugging/testing.         |
