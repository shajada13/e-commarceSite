-- ============================================================
--  ShopBD — Seed / Sample Data
--  Run AFTER schema.sql
-- ============================================================

-- ============================================================
--  CUSTOMERS  (password_hash = base64(password + "_salt_bd"))
--  admin password  : admin123
--  user passwords  : user123
-- ============================================================
INSERT INTO customers (customer_id, name, email, password_hash, phone, address, role) VALUES
('admin_001', 'Admin User',    'admin@shopbd.com',  'YWRtaW4xMjNfc2FsdF9iZA==', '01700000000', 'Motijheel, Dhaka 1000',      'admin'),
('cust_001',  'Rahim Uddin',   'rahim@example.com', 'dXNlcjEyM19zYWx0X2Jk',     '01811223344', 'Gulshan-2, Dhaka 1212',      'customer'),
('cust_002',  'Nadia Khatun',  'nadia@example.com', 'dXNlcjEyM19zYWx0X2Jk',     '01955667788', 'Agrabad, Chattogram 4100',   'customer'),
('cust_003',  'Karim Hossain', 'karim@example.com', 'dXNlcjEyM19zYWx0X2Jk',     '01733445566', 'Shahjalal Upashahar, Sylhet','customer');

-- ============================================================
--  PRODUCTS
-- ============================================================
INSERT INTO products (product_id, name, description, price, stock_quantity, category, image_url, rating, reviews) VALUES
('p1',  'Samsung Galaxy A54',          '6.4-inch Super AMOLED, 5000mAh battery, 128GB storage, IP67 water resistant',          35999.00, 45,  'Electronics',    '📱', 4.5, 128),
('p2',  'Apple AirPods Pro (2nd Gen)', 'Active noise cancellation, Spatial Audio, USB-C charging, 30hr total battery',          28999.00, 20,  'Electronics',    '🎧', 4.8, 256),
('p3',  'Nike Air Max 270',            'Lightweight running shoes, breathable mesh upper, Max Air heel unit for all-day comfort', 8999.00, 60,  'Footwear',       '👟', 4.3,  89),
('p4',  "Levi's 511 Slim Fit Jeans",   'Classic 5-pocket styling, premium stretch denim, sits below waist',                      3499.00, 80,  'Clothing',       '👖', 4.1,  42),
('p5',  'Prestige Rice Cooker 1.8L',   'Auto-cook & keep warm function, non-stick inner pot, 3-in-1 use',                        2999.00, 35,  'Home & Kitchen', '🍚', 4.6, 315),
('p6',  'HP Pavilion 15 Laptop',       'Intel Core i5-12th Gen, 8GB DDR4 RAM, 512GB NVMe SSD, Windows 11 Home',                 62999.00, 15,  'Electronics',    '💻', 4.4,  67),
('p7',  'ON Whey Protein 2kg',         '24g protein per serving, 5.5g BCAAs, chocolate fudge brownie flavor',                    4499.00, 55,  'Sports',         '🏋️', 4.7, 203),
('p8',  'Atomic Habits — James Clear', 'An easy and proven way to build good habits and break bad ones. #1 NYT Bestseller',        599.00, 100, 'Books',          '📚', 4.9, 512),
('p9',  'Sony WH-1000XM5',             'Industry-leading noise canceling, 30hr battery, Speak-to-Chat, multipoint connect',     39999.00, 12,  'Electronics',    '🎵', 4.8, 178),
('p10', 'Fitness Yoga Mat 6mm',        'Non-slip TPE surface, eco-friendly, includes carry strap, 183x61cm',                     1299.00, 75,  'Sports',         '🧘', 4.2,  94),
('p11', 'Jamdani Cotton Kurti',        'Authentic Bangladeshi handwoven cotton, printed motifs, regular fit',                     1799.00, 90,  'Clothing',       '👗', 4.0,  61),
('p12', 'Philips Pro Blender 1000W',   '6-blade ProBlend technology, 1.5L jar, 3 speeds + pulse, BPA-free',                     3999.00, 28,  'Home & Kitchen', '🫙', 4.5, 147);

-- ============================================================
--  ORDERS
-- ============================================================
INSERT INTO orders (order_id, customer_id, order_date, total_amount, status, delivery_address) VALUES
('ord_001', 'cust_001', '2025-03-10', 36059.00, 'delivered', 'House 12, Road 5, Gulshan-2, Dhaka 1212'),
('ord_002', 'cust_002', '2025-03-18', 29059.00, 'shipped',   'Flat 4B, Agrabad R/A, Chattogram 4100'),
('ord_003', 'cust_001', '2025-04-01',  9059.00, 'pending',   'House 12, Road 5, Gulshan-2, Dhaka 1212'),
('ord_004', 'cust_003', '2025-04-05',  4559.00, 'cancelled', 'Block C, Shahjalal Upashahar, Sylhet');

-- ============================================================
--  ORDER_ITEMS
-- ============================================================
INSERT INTO order_items (order_item_id, order_id, product_id, quantity, price) VALUES
('oi_001', 'ord_001', 'p1',  1, 35999.00),
('oi_002', 'ord_002', 'p2',  1, 28999.00),
('oi_003', 'ord_003', 'p3',  1,  8999.00),
('oi_004', 'ord_004', 'p4',  1,  3499.00),
('oi_005', 'ord_004', 'p10', 1,  1000.00);

-- ============================================================
--  PAYMENTS
-- ============================================================
INSERT INTO payments (payment_id, order_id, payment_method, payment_status, transaction_id, paid_at) VALUES
('pay_001', 'ord_001', 'bkash', 'completed', 'TXN1741564800001', '2025-03-10 10:30:00'),
('pay_002', 'ord_002', 'card',  'completed', 'TXN1742256000002', '2025-03-18 14:15:00'),
('pay_003', 'ord_003', 'COD',   'completed', 'TXN1743465600003', '2025-04-01 09:00:00'),
('pay_004', 'ord_004', 'nagad', 'refunded',  'TXN1743811200004', '2025-04-05 16:45:00');
