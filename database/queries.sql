-- ============================================================
--  ShopBD — Sample Queries
--  Useful for DB subject assignments & practice
-- ============================================================


-- ============================================================
--  BASIC SELECT
-- ============================================================

-- 1. All products sorted by price (descending)
SELECT product_id, name, category, price, stock_quantity
FROM   products
ORDER  BY price DESC;

-- 2. Products with low stock (less than 20 units)
SELECT name, category, stock_quantity
FROM   products
WHERE  stock_quantity < 20
ORDER  BY stock_quantity ASC;

-- 3. All products in a specific category
SELECT name, price, rating
FROM   products
WHERE  category = 'Electronics'
ORDER  BY rating DESC;

-- 4. Search products by keyword
SELECT name, description, price
FROM   products
WHERE  name       LIKE '%Samsung%'
   OR  description LIKE '%Samsung%';


-- ============================================================
--  JOINS
-- ============================================================

-- 5. Orders with customer name (INNER JOIN)
SELECT o.order_id,
       c.name        AS customer_name,
       c.email,
       o.order_date,
       o.total_amount,
       o.status
FROM   orders   o
JOIN   customers c ON o.customer_id = c.customer_id
ORDER  BY o.order_date DESC;

-- 6. Full order breakdown — items + product names (multi-JOIN)
SELECT o.order_id,
       c.name          AS customer,
       p.name          AS product,
       oi.quantity,
       oi.price        AS unit_price,
       (oi.quantity * oi.price) AS line_total,
       o.status
FROM   order_items oi
JOIN   orders      o  ON oi.order_id   = o.order_id
JOIN   customers   c  ON o.customer_id = c.customer_id
JOIN   products    p  ON oi.product_id = p.product_id
ORDER  BY o.order_date DESC;

-- 7. Orders with their payment status (LEFT JOIN — shows orders with no payment too)
SELECT o.order_id,
       o.total_amount,
       o.status              AS order_status,
       pay.payment_method,
       pay.payment_status,
       pay.transaction_id
FROM   orders   o
LEFT   JOIN payments pay ON o.order_id = pay.order_id
ORDER  BY o.order_date DESC;


-- ============================================================
--  AGGREGATE FUNCTIONS
-- ============================================================

-- 8. Total revenue from completed orders
SELECT SUM(total_amount) AS total_revenue
FROM   orders
WHERE  status != 'cancelled';

-- 9. Number of orders per customer
SELECT c.name,
       c.email,
       COUNT(o.order_id)    AS total_orders,
       SUM(o.total_amount)  AS total_spent
FROM   customers c
LEFT   JOIN orders o ON c.customer_id = o.customer_id
WHERE  c.role = 'customer'
GROUP  BY c.customer_id, c.name, c.email
ORDER  BY total_spent DESC;

-- 10. Total items sold per product
SELECT p.name,
       p.category,
       SUM(oi.quantity)  AS units_sold,
       SUM(oi.quantity * oi.price) AS revenue
FROM   products    p
LEFT   JOIN order_items oi ON p.product_id = oi.product_id
GROUP  BY p.product_id, p.name, p.category
ORDER  BY units_sold DESC;

-- 11. Average order value
SELECT ROUND(AVG(total_amount), 2) AS avg_order_value
FROM   orders
WHERE  status != 'cancelled';

-- 12. Revenue grouped by category
SELECT p.category,
       COUNT(DISTINCT oi.order_id) AS orders,
       SUM(oi.quantity * oi.price) AS revenue
FROM   products    p
JOIN   order_items oi ON p.product_id = oi.product_id
JOIN   orders       o ON oi.order_id  = o.order_id
WHERE  o.status != 'cancelled'
GROUP  BY p.category
ORDER  BY revenue DESC;


-- ============================================================
--  SUBQUERIES
-- ============================================================

-- 13. Most expensive product in each category
SELECT name, category, price
FROM   products p1
WHERE  price = (
    SELECT MAX(price)
    FROM   products p2
    WHERE  p2.category = p1.category
);

-- 14. Customers who have never placed an order
SELECT name, email
FROM   customers
WHERE  customer_id NOT IN (
    SELECT DISTINCT customer_id FROM orders
)
AND role = 'customer';

-- 15. Products that have never been ordered
SELECT name, category, stock_quantity
FROM   products
WHERE  product_id NOT IN (
    SELECT DISTINCT product_id FROM order_items
);


-- ============================================================
--  TRANSACTION — Place an order with rollback safety
-- ============================================================
START TRANSACTION;

-- Step 1: Decrease stock
UPDATE products
SET    stock_quantity = stock_quantity - 1
WHERE  product_id = 'p8'
AND    stock_quantity >= 1;

-- Step 2: Insert the order
INSERT INTO orders (order_id, customer_id, order_date, total_amount, status, delivery_address)
VALUES ('ord_new', 'cust_001', CURDATE(), 659.00, 'pending', 'Gulshan-2, Dhaka 1212');

-- Step 3: Insert order item
INSERT INTO order_items (order_item_id, order_id, product_id, quantity, price)
VALUES ('oi_new', 'ord_new', 'p8', 1, 599.00);

-- Step 4: Insert payment record
INSERT INTO payments (payment_id, order_id, payment_method, payment_status, transaction_id)
VALUES ('pay_new', 'ord_new', 'bkash', 'completed', CONCAT('TXN', UNIX_TIMESTAMP()));

-- If everything looks good:
COMMIT;

-- If something went wrong, roll back everything:
-- ROLLBACK;


-- ============================================================
--  VIEWS — Reusable virtual tables
-- ============================================================

-- View: Customer order summary
CREATE OR REPLACE VIEW vw_customer_summary AS
SELECT c.customer_id,
       c.name,
       c.email,
       COUNT(o.order_id)                                          AS total_orders,
       SUM(CASE WHEN o.status != 'cancelled' THEN o.total_amount ELSE 0 END) AS total_spent,
       SUM(CASE WHEN o.status = 'pending'   THEN 1 ELSE 0 END)  AS pending_orders
FROM   customers c
LEFT   JOIN orders o ON c.customer_id = o.customer_id
WHERE  c.role = 'customer'
GROUP  BY c.customer_id, c.name, c.email;

-- Usage:
SELECT * FROM vw_customer_summary ORDER BY total_spent DESC;


-- View: Product sales performance
CREATE OR REPLACE VIEW vw_product_performance AS
SELECT p.product_id,
       p.name,
       p.category,
       p.price,
       p.stock_quantity,
       COALESCE(SUM(oi.quantity), 0)              AS units_sold,
       COALESCE(SUM(oi.quantity * oi.price), 0)   AS revenue
FROM   products    p
LEFT   JOIN order_items oi ON p.product_id = oi.product_id
LEFT   JOIN orders       o ON oi.order_id  = o.order_id
    AND o.status != 'cancelled'
GROUP  BY p.product_id, p.name, p.category, p.price, p.stock_quantity;

-- Usage:
SELECT * FROM vw_product_performance ORDER BY revenue DESC;
