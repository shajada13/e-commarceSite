-- ============================================================
--  ShopBD — Database Schema
--  Subject : Database Management Systems
--  Engine  : MySQL 8.0+ / MariaDB 10.6+
-- ============================================================

-- Drop tables in reverse dependency order (safe re-run)
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

-- ============================================================
--  1. CUSTOMERS
-- ============================================================
CREATE TABLE customers (
    customer_id   VARCHAR(20)   NOT NULL,
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    phone         VARCHAR(20)   DEFAULT NULL,
    address       TEXT          DEFAULT NULL,
    role          ENUM('customer','admin') NOT NULL DEFAULT 'customer',
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_customers PRIMARY KEY (customer_id)
);

-- ============================================================
--  2. PRODUCTS
-- ============================================================
CREATE TABLE products (
    product_id     VARCHAR(20)   NOT NULL,
    name           VARCHAR(200)  NOT NULL,
    description    TEXT          DEFAULT NULL,
    price          DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock_quantity INT           NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    category       VARCHAR(60)   NOT NULL,
    image_url      VARCHAR(10)   DEFAULT '📦',
    rating         DECIMAL(3,1)  NOT NULL DEFAULT 0.0,
    reviews        INT           NOT NULL DEFAULT 0,
    created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_products PRIMARY KEY (product_id)
);

-- ============================================================
--  3. ORDERS
-- ============================================================
CREATE TABLE orders (
    order_id         VARCHAR(20)   NOT NULL,
    customer_id      VARCHAR(20)   NOT NULL,
    order_date       DATE          NOT NULL,
    total_amount     DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    status           ENUM('pending','shipped','delivered','cancelled')
                                   NOT NULL DEFAULT 'pending',
    delivery_address TEXT          DEFAULT NULL,
    created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_orders         PRIMARY KEY (order_id),
    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ============================================================
--  4. ORDER_ITEMS
-- ============================================================
CREATE TABLE order_items (
    order_item_id VARCHAR(20)   NOT NULL,
    order_id      VARCHAR(20)   NOT NULL,
    product_id    VARCHAR(20)   NOT NULL,
    quantity      INT           NOT NULL CHECK (quantity > 0),
    price         DECIMAL(10,2) NOT NULL CHECK (price >= 0),  -- snapshot at purchase time

    CONSTRAINT pk_order_items         PRIMARY KEY (order_item_id),
    CONSTRAINT fk_order_items_order   FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ============================================================
--  5. PAYMENTS
-- ============================================================
CREATE TABLE payments (
    payment_id     VARCHAR(20)  NOT NULL,
    order_id       VARCHAR(20)  NOT NULL UNIQUE,   -- 1-to-1 with orders
    payment_method ENUM('COD','card','bkash','nagad') NOT NULL,
    payment_status ENUM('completed','failed','refunded')
                                NOT NULL DEFAULT 'failed',
    transaction_id VARCHAR(30)  NOT NULL UNIQUE,
    paid_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_payments        PRIMARY KEY (payment_id),
    CONSTRAINT fk_payments_order  FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================================
--  Indexes for common queries
-- ============================================================
CREATE INDEX idx_products_category  ON products(category);
CREATE INDEX idx_orders_customer    ON orders(customer_id);
CREATE INDEX idx_orders_status      ON orders(status);
CREATE INDEX idx_order_items_order  ON order_items(order_id);
CREATE INDEX idx_payments_status    ON payments(payment_status);
