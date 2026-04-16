# ShopBD — Database Documentation

> **Subject:** Database Management Systems  
> **Project:** ShopBD E-Commerce Application

---

## 📁 Files in This Folder

| File | Purpose |
|------|---------|
| `schema.sql` | `CREATE TABLE` statements — run this first |
| `seed.sql` | Sample data — run after schema |
| `queries.sql` | Practice queries: SELECT, JOIN, aggregate, subqueries, transactions, views |

---

## 🗃️ Tables Overview

| Table | Rows (seed) | Description |
|-------|-------------|-------------|
| `customers` | 4 | Registered users (includes admin) |
| `products` | 12 | Product catalogue |
| `orders` | 4 | Customer orders |
| `order_items` | 5 | Line items inside each order |
| `payments` | 4 | One payment record per order |

---

## 🔗 Entity Relationship Diagram (ERD)

```
CUSTOMERS           ORDERS              ORDER_ITEMS         PRODUCTS
─────────           ──────              ───────────         ────────
customer_id ◄───┐   order_id       ┌──► order_item_id      product_id ◄──┐
name            └── customer_id    │    order_id ──────────────────────   │
email               order_date     │    product_id ────────────────────►──┘
password_hash       total_amount   │    quantity
phone               status         │    price (snapshot)
address             delivery_addr  │
role                               │
                PAYMENTS           │
                ────────           │
                payment_id         │
                order_id ──────────┘
                payment_method
                payment_status
                transaction_id
                paid_at
```

### Relationships

| Relationship | Type | Constraint |
|---|---|---|
| Customer → Orders | One-to-Many | A customer can have many orders |
| Order → Order Items | One-to-Many | An order contains one or more items |
| Product → Order Items | One-to-Many | A product can appear in many orders |
| Order → Payment | One-to-One | Each order has exactly one payment |

---

## ⚙️ How to Set Up

### MySQL / MariaDB (local)

```bash
# 1. Log in to MySQL
mysql -u root -p

# 2. Create the database
CREATE DATABASE shopbd;
USE shopbd;

# 3. Run schema
source /path/to/database/schema.sql

# 4. Load sample data
source /path/to/database/seed.sql
```

### Using phpMyAdmin

1. Create a new database called `shopbd`
2. Click **Import** → choose `schema.sql` → Go
3. Click **Import** again → choose `seed.sql` → Go

---

## 🔑 Key Design Decisions

- **price stored in order_items** — captures the price *at the time of purchase*, so historical orders remain accurate even if the product price changes later.
- **ENUM types** — `status`, `role`, `payment_method`, and `payment_status` are all ENUMs to enforce valid values at the database level.
- **ON DELETE CASCADE** — deleting an order automatically removes its order_items and payment record.
- **ON DELETE RESTRICT** on `customers → orders` — prevents deleting a customer who has placed orders (data integrity).
- **Indexes** added on frequently queried columns: `category`, `customer_id`, `status`, `order_id`.

---

## 🧪 Concepts Demonstrated

- ✅ Primary & Foreign Keys
- ✅ Referential integrity (CASCADE / RESTRICT)
- ✅ CHECK constraints
- ✅ INNER JOIN, LEFT JOIN (multi-table)
- ✅ Aggregate functions (SUM, COUNT, AVG)
- ✅ GROUP BY / ORDER BY
- ✅ Subqueries
- ✅ Transactions with ROLLBACK
- ✅ Views (virtual tables)
- ✅ Indexes for performance
